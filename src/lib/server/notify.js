// Durable lead-notification queue. Design goal: a hot lead can NEVER be lost
// to a channel outage or a misconfigured token —
//   1. leads are persisted (store.js) before this module ever sees them;
//   2. every CONFIGURED channel is retried until it succeeds (backoff capped
//      at 30 min) for up to 7 days;
//   3. the queue is rebuilt from the ledger on boot, so pending deliveries
//      survive restarts and deploys;
//   4. on startup a self-test message goes to Telegram — a broken config is
//      discovered on deploy day, not on lead-loss day.
// Channels: Telegram (primary), email via SMTP (Yandex), Max (stub).
import { env } from '$env/dynamic/private';
import { markDelivery, readLedger } from './store.js';
import nodemailer from 'nodemailer';

/** @typedef {{ id: string, name: string, contact: string, message: string, lang: string, at: string }} Lead */

// ---------------------------------------------------------------- channels
const channels = [
	{
		key: 'telegram',
		configured: () => Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
		send: (/** @type {Lead} */ lead) => sendTelegram(formatText(lead))
	},
	{
		key: 'email',
		configured: () => Boolean(env.SMTP_USER && env.SMTP_PASS),
		send: sendEmail
	},
	{
		key: 'max',
		configured: () => Boolean(env.MAX_BOT_TOKEN && env.MAX_CHAT_ID),
		send: (/** @type {Lead} */ lead) => sendMax(formatText(lead))
	}
];

// ---------------------------------------------------------------- queue
const RETRY_DELAYS_MS = [60_000, 300_000, 900_000, 1_800_000]; // then every 30 min
const MAX_AGE_MS = 7 * 24 * 3600_000; // stop retrying after a week
const TICK_MS = 30_000;

/** @type {Map<string, { lead: Lead, pending: Set<string>, tries: number, nextAt: number }>} */
const queue = new Map();
let started = false;

/** Public API: hand a persisted lead to the delivery queue. */
export function enqueueLead(lead) {
	const pending = new Set(channels.filter((c) => c.configured()).map((c) => c.key));
	if (pending.size === 0) {
		console.error(`[notify] lead ${lead.id}: NO channels configured — lead saved but nobody will be pinged!`);
		return;
	}
	queue.set(lead.id, { lead, pending, tries: 0, nextAt: 0 });
	void pump(); // attempt immediately
}

let pumping = false;
async function pump() {
	if (pumping) return;
	pumping = true;
	try {
		const now = Date.now();
		for (const [id, item] of queue) {
			if (item.nextAt > now) continue;
			if (now - Date.parse(item.lead.at) > MAX_AGE_MS) {
				console.error(`[notify] lead ${id}: giving up after 7 days; channels never recovered: ${[...item.pending]}`);
				queue.delete(id);
				continue;
			}
			item.tries++;
			/** @type {Record<string, boolean|number>} */
			const status = { attempt: item.tries };
			for (const c of channels) {
				if (!item.pending.has(c.key)) continue;
				const ok = await guard(c.send, item.lead);
				status[c.key] = ok === true;
				if (ok === true) item.pending.delete(c.key);
			}
			await markDelivery(id, status);
			if (item.pending.size === 0) {
				queue.delete(id);
			} else {
				const delay = RETRY_DELAYS_MS[Math.min(item.tries - 1, RETRY_DELAYS_MS.length - 1)];
				item.nextAt = Date.now() + delay;
				console.warn(`[notify] lead ${id}: still pending [${[...item.pending]}], retry in ${delay / 1000}s`);
			}
		}
	} finally {
		pumping = false;
	}
}

/**
 * Boot init (idempotent): start the retry ticker, re-queue undelivered leads
 * from the ledger, and send the Telegram self-test.
 */
export function initNotify() {
	if (started) return;
	started = true;
	setInterval(() => void pump(), TICK_MS).unref?.();
	void reconcile();
	void selfTest();
}

async function reconcile() {
	try {
		const { leads, delivered } = await readLedger();
		const configured = channels.filter((c) => c.configured()).map((c) => c.key);
		if (configured.length === 0) return;
		let requeued = 0;
		for (const [id, lead] of leads) {
			if (Date.now() - Date.parse(lead.at) > MAX_AGE_MS) continue;
			const done = delivered.get(id) ?? new Set();
			const pending = new Set(configured.filter((k) => !done.has(k)));
			if (pending.size > 0 && !queue.has(id)) {
				queue.set(id, { lead, pending, tries: 0, nextAt: 0 });
				requeued++;
			}
		}
		if (requeued) {
			console.warn(`[notify] reconcile: re-queued ${requeued} undelivered lead(s) from the ledger`);
			void pump();
		}
	} catch (e) {
		console.error('[notify] reconcile failed', e);
	}
}

async function selfTest() {
	if (env.NOTIFY_SELFTEST === '0') return;
	const state = channels.map((c) => `${c.key}: ${c.configured() ? 'настроен' : '—'}`).join(', ');
	console.log(`[notify] channels: ${state}`);
	if (channels[0].configured()) {
		const ok = await guard(sendTelegram, `✅ pi-retail лендинг запущен. Каналы: ${state}`);
		if (ok !== true) console.error('[notify] SELF-TEST FAILED: telegram is configured but not reachable!');
	}
}

// ---------------------------------------------------------------- senders
/** @param {Lead} d */
function formatText(d) {
	return [
		'🟦 Новая заявка с pi-retail',
		'',
		`Имя: ${d.name}`,
		`Контакт: ${d.contact}`,
		d.message ? `Сообщение: ${d.message}` : '',
		'',
		`${d.at} · id ${d.id}`
	]
		.filter(Boolean)
		.join('\n');
}

async function guard(fn, arg) {
	try {
		return await fn(arg);
	} catch (e) {
		console.error(`[notify] channel threw:`, e?.message || e);
		return false;
	}
}

/** @param {string} text */
async function sendTelegram(text) {
	const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true })
	});
	if (!res.ok) {
		console.error('[notify] telegram failed', res.status, await res.text().catch(() => ''));
		return false;
	}
	return true;
}

let transporter = null;
/** @param {Lead} lead */
async function sendEmail(lead) {
	transporter ??= nodemailer.createTransport({
		host: env.SMTP_HOST || 'smtp.yandex.ru',
		port: Number(env.SMTP_PORT || 465),
		secure: true,
		auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
	});
	await transporter.sendMail({
		from: `"pi-retail сайт" <${env.SMTP_USER}>`,
		to: env.LEADS_EMAIL || env.SMTP_USER,
		subject: `Заявка с сайта: ${lead.name}`,
		text: formatText(lead),
		replyTo: lead.contact.includes('@') ? lead.contact : undefined
	});
	return true;
}

/** @param {string} text */
async function sendMax(text) {
	const res = await fetch(`https://botapi.max.ru/messages?access_token=${env.MAX_BOT_TOKEN}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ chat_id: env.MAX_CHAT_ID, text })
	});
	if (!res.ok) {
		console.error('[notify] max failed', res.status, await res.text().catch(() => ''));
		return false;
	}
	return true;
}
