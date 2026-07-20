// Server-only notifications, fanned out to every configured channel:
//   - Telegram (primary, instant)
//   - Email copy via SMTP (Yandex: smtp.yandex.ru, app password)
//   - Max (VK messenger) — stub until the bot exists
// Unconfigured channels are skipped silently. Failures are retried in the
// background with backoff; persistence (store.js) already guarantees the lead
// itself is never lost, so notifications are best-effort delivery on top.
import { env } from '$env/dynamic/private';
import { markDelivery } from './store.js';
import nodemailer from 'nodemailer';

/** @typedef {{ id: string, name: string, contact: string, message: string, lang: string, at: string }} Lead */

/** Fire all channels once; returns per-channel result (true=sent, false=failed, null=not configured). */
async function attempt(lead) {
	const text = formatText(lead);
	const [tg, mail, max] = await Promise.all([
		guard(sendTelegram, text),
		guard(sendEmail, lead),
		guard(sendMax, text)
	]);
	return { telegram: tg, email: mail, max };
}

/**
 * Notify with background retries (3 attempts: now, +1min, +5min per channel).
 * Never throws; records the final outcome next to the lead.
 * @param {Lead} lead
 */
export function notifyWithRetry(lead) {
	const delays = [0, 60_000, 300_000];
	let attemptNo = 0;
	/** @type {Record<string, boolean|null>} */
	let result = { telegram: null, email: null, max: null };

	const run = async () => {
		attemptNo++;
		const r = await attempt(lead);
		// keep the best result per channel (once true, stays true)
		for (const k of Object.keys(result)) result[k] = result[k] === true ? true : r[k];
		const pendingRetry = Object.values(result).some((v) => v === false) && attemptNo < delays.length;
		await markDelivery(lead.id, { ...result, attempt: attemptNo });
		if (pendingRetry) {
			setTimeout(run, delays[attemptNo]);
		} else if (Object.values(result).every((v) => v !== true)) {
			console.error(`[notify] lead ${lead.id}: NO channel delivered — check channel config; lead is safe in the store`);
		}
	};
	run().catch((e) => console.error('[notify] unexpected', e));
}

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
		console.error(`[notify] ${fn.name} threw`, e?.message || e);
		return false;
	}
}

/** @param {string} text */
async function sendTelegram(text) {
	const token = env.TELEGRAM_BOT_TOKEN;
	const chatId = env.TELEGRAM_CHAT_ID;
	if (!token || !chatId) return null;
	const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
	});
	if (!res.ok) {
		console.error('[notify] telegram failed', res.status, await res.text().catch(() => ''));
		return false;
	}
	return true;
}

let transporter = null;
function smtp() {
	if (!env.SMTP_USER || !env.SMTP_PASS) return null;
	transporter ??= nodemailer.createTransport({
		host: env.SMTP_HOST || 'smtp.yandex.ru',
		port: Number(env.SMTP_PORT || 465),
		secure: true,
		auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
	});
	return transporter;
}

/** @param {Lead} lead */
async function sendEmail(lead) {
	const t = smtp();
	if (!t) return null;
	const to = env.LEADS_EMAIL || env.SMTP_USER;
	await t.sendMail({
		from: `"pi-retail сайт" <${env.SMTP_USER}>`,
		to,
		subject: `Заявка с сайта: ${lead.name}`,
		text: formatText(lead),
		replyTo: lead.contact.includes('@') ? lead.contact : undefined
	});
	return true;
}

/** Max (VK messenger) — same fetch pattern; fill env when the bot exists. */
async function sendMax(text) {
	const token = env.MAX_BOT_TOKEN;
	const chatId = env.MAX_CHAT_ID;
	if (!token || !chatId) return null;
	const res = await fetch(`https://botapi.max.ru/messages?access_token=${token}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text })
	});
	if (!res.ok) {
		console.error('[notify] max failed', res.status, await res.text().catch(() => ''));
		return false;
	}
	return true;
}
