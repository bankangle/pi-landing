<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { provideI18n } from '$lib/i18n-context.js';
	import ScrollIndicator from '$lib/components/ScrollIndicator.svelte';

	let { data, children } = $props();

	let smooth = $state(false);
	onMount(async () => {
		const { initSmoothScroll } = await import('$lib/smooth-scroll.js');
		smooth = Boolean(initSmoothScroll());
	});

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

{#if smooth}
	<ScrollIndicator />
{/if}
{@render children()}
