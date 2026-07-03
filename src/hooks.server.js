import { normalizeLang, DEFAULT_LANG, EN_ENABLED } from '$lib/i18n.js';

/** @type {import('@sveltejs/kit').Handle} */
export function handle({ event, resolve }) {
	const lang = EN_ENABLED ? normalizeLang(event.cookies.get('lang')) : DEFAULT_LANG;
	event.locals.lang = lang;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
}
