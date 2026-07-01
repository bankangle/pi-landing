<script>
	import '../app.css';
	import { provideI18n } from '$lib/i18n-context.js';

	let { data, children } = $props();

	let lang = $state(data.lang);

	provideI18n({
		getLang: () => lang,
		setLang: (l) => {
			lang = l;
			// Persist for SSR on the next visit; 1 year, root path.
			document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
			document.documentElement.lang = l;
		}
	});
</script>

{@render children()}
