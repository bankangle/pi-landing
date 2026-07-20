// Telegram relay: RU datacenters often block api.telegram.org, so the VPS
// instance forwards messages here — this same app deployed on non-RU infra
// (Render) — and this endpoint passes them on to Telegram.
// Auth: shared bearer secret (RELAY_SECRET). Chat/token come from THIS
// instance's env, so the caller can't redirect messages elsewhere.
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const secret = env.RELAY_SECRET;
	const auth = request.headers.get('authorization') || '';
	if (!secret || auth !== `Bearer ${secret}`) {
		return json({ ok: false, error: 'unauthorized' }, { status: 401 });
	}
	if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
		return json({ ok: false, error: 'relay not configured' }, { status: 503 });
	}

	let text = '';
	try {
		({ text } = await request.json());
	} catch {}
	if (!text || typeof text !== 'string' || text.length > 4000) {
		return json({ ok: false, error: 'bad text' }, { status: 400 });
	}

	const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true })
	});
	if (!res.ok) {
		console.error('[tg-relay] telegram failed', res.status, await res.text().catch(() => ''));
		return json({ ok: false, error: 'telegram rejected' }, { status: 502 });
	}
	return json({ ok: true });
}
