import { normalizeLang } from '$lib/i18n.js';

/** @type {import('@sveltejs/kit').Handle} */
export function handle({ event, resolve }) {
	const lang = normalizeLang(event.cookies.get('lang'));
	event.locals.lang = lang;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
}
