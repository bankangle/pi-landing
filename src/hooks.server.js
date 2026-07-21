import { normalizeLang, DEFAULT_LANG, EN_ENABLED } from '$lib/i18n.js';
import { initNotify } from '$lib/server/notify.js';

// Boot the durable notification queue (idempotent): retry ticker, ledger
// reconcile (re-queue undelivered leads), Telegram self-test.
initNotify();

/** @type {import('@sveltejs/kit').Handle} */
export function handle({ event, resolve }) {
	const lang = EN_ENABLED ? normalizeLang(event.cookies.get('lang')) : DEFAULT_LANG;
	event.locals.lang = lang;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
}
