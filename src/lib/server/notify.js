// Server-only notifications. Uses the global fetch — no SDK, no dependencies.
// Runs inside the SvelteKit server action (a serverless/Node function), so the
// bot tokens stay on the server and are never shipped to the browser.
//
// Uses $env/dynamic/private so values are read from the real process env at
// runtime on your VPS (systemd/pm2/docker), not baked in at build time.
import { env } from '$env/dynamic/private';

/**
 * @param {{ name: string, contact: string, message: string, lang: string }} data
 * @returns {Promise<boolean>} true if at least one channel accepted the message
 */
export async function notify(data) {
	const text = formatMessage(data);
	// Fire all configured channels; succeed if any one of them delivered.
	const results = await Promise.allSettled([sendTelegram(text), sendMax(text)]);
	return results.some((r) => r.status === 'fulfilled' && r.value === true);
}

/** @param {{ name: string, contact: string, message: string, lang: string }} d */
function formatMessage(d) {
	return [
		'🟦 <b>New PI Retail enquiry</b>',
		'',
		`<b>Name:</b> ${escapeHtml(d.name)}`,
		`<b>Contact:</b> ${escapeHtml(d.contact)}`,
		d.message ? `<b>Message:</b> ${escapeHtml(d.message)}` : '',
		'',
		`<i>lang: ${d.lang} · ${new Date().toISOString()}</i>`
	]
		.filter(Boolean)
		.join('\n');
}

/** @param {string} text */
async function sendTelegram(text) {
	const token = env.TELEGRAM_BOT_TOKEN;
	const chatId = env.TELEGRAM_CHAT_ID;
	if (!token || !chatId) return false; // not configured -> skip silently

	const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			chat_id: chatId,
			text,
			parse_mode: 'HTML',
			disable_web_page_preview: true
		})
	});
	if (!res.ok) {
		console.error('[notify] telegram failed', res.status, await safeText(res));
		return false;
	}
	return true;
}

/**
 * Max (VK messenger) — same fetch pattern. Endpoint is stubbed until we wire the
 * real bot; leaving MAX_BOT_TOKEN empty makes this a silent no-op today.
 * @param {string} text
 */
async function sendMax(text) {
	const token = env.MAX_BOT_TOKEN;
	const chatId = env.MAX_CHAT_ID;
	if (!token || !chatId) return false;

	// TODO: replace with the confirmed Max Bot API endpoint/shape when available.
	const res = await fetch(`https://botapi.max.ru/messages?access_token=${token}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text })
	});
	if (!res.ok) {
		console.error('[notify] max failed', res.status, await safeText(res));
		return false;
	}
	return true;
}

/** @param {Response} res */
async function safeText(res) {
	try {
		return await res.text();
	} catch {
		return '<no body>';
	}
}

/** @param {string} s */
function escapeHtml(s) {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
