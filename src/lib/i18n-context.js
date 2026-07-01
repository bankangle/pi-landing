import { getContext, setContext } from 'svelte';
import { dict, normalizeLang, LANGS } from './i18n.js';

const KEY = Symbol('i18n');

/**
 * Called once in the root layout. `getLang` / `setLang` read & write the
 * layout's $state rune, so everything stays reactive and SSR-safe (state lives
 * on the component instance, not at module scope).
 * @param {{ getLang: () => string, setLang: (l: string) => void }} api
 */
export function provideI18n(api) {
	const ctx = {
		get lang() {
			return api.getLang();
		},
		/** the active dictionary — reading it tracks `lang`, so markup re-renders on switch */
		get t() {
			return dict[normalizeLang(api.getLang())];
		},
		langs: LANGS,
		toggle() {
			const next = api.getLang() === 'ru' ? 'en' : 'ru';
			api.setLang(next);
		},
		/** @param {string} l */
		set(l) {
			api.setLang(normalizeLang(l));
		}
	};
	setContext(KEY, ctx);
	return ctx;
}

/** @returns {ReturnType<typeof provideI18n>} */
export function useI18n() {
	return getContext(KEY);
}
