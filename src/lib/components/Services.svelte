<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import Section from './Section.svelte';
	import Icon from './Icon.svelte';
	const i18n = useI18n();

	const icons = ['chart', 'bolt', 'plug', 'search'];
</script>

<Section id="services" ns="services">
	<div class="grid gap-5 sm:grid-cols-2">
		{#each i18n.t.services.items as item, i}
			<div
				class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-accent/40"
				use:reveal={{ delay: i * 80 }}
			>
				<div class="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent transition-transform group-hover:scale-110">
					<Icon name={icons[i]} size={24} />
				</div>
				<h3 class="mt-5 text-xl font-semibold">{item.title}</h3>
				<p class="mt-2 leading-relaxed text-slate-400">{item.body}</p>
				<div class="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"></div>
			</div>
		{/each}
	</div>
</Section>
