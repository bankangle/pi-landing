<script>
	// Shared section shell: id, centered eyebrow/title/subtitle header.
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	const i18n = useI18n();

	let { id, ns, children } = $props();
	// `ns` is the dictionary namespace (about/services/projects/contact).
</script>

<section {id} class="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
	<div class="mx-auto max-w-2xl text-center" use:reveal>
		<span class="text-sm font-semibold uppercase tracking-wider text-accent">{i18n.t[ns].eyebrow}</span>
		<h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t[ns].title}</h2>
		{#if i18n.t[ns].subtitle}
			<p class="mt-4 text-lg text-slate-400">{i18n.t[ns].subtitle}</p>
		{/if}
	</div>

	<div class="mt-14">
		{@render children()}
	</div>
</section>
