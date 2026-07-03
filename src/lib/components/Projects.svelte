<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import { spotlight } from '$lib/spotlight.js';
	import Section from './Section.svelte';
	const i18n = useI18n();
</script>

<Section id="projects" ns="projects">
	<!-- Subgrid: title / body / metric are shared row tracks, so each section
	     starts at the same height across every card in a row. -->
	<div class="grid gap-5 md:grid-cols-3">
		{#each i18n.t.projects.items as p, i}
			<article
				class="spotlight beam grid row-span-3 grid-rows-subgrid gap-y-0 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/[0.07] to-transparent p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10"
				use:reveal={{ delay: i * 90 }}
				use:spotlight
			>
				<h3 class="text-xl font-semibold">{p.title}</h3>
				<p class="mt-2 leading-relaxed text-slate-400">{p.body}</p>
				<div class="mt-4 font-semibold text-accent">{p.metric}</div>
			</article>
		{/each}
	</div>
</Section>
