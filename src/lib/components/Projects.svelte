<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import Section from './Section.svelte';
	import Icon from './Icon.svelte';
	const i18n = useI18n();
</script>

<Section id="projects" ns="projects">
	<div class="grid gap-5 md:grid-cols-3">
		{#each i18n.t.projects.items as p, i}
			<article
				class="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-7 transition-transform hover:-translate-y-1"
				use:reveal={{ delay: i * 90 }}
			>
				<span class="w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">{p.tag}</span>
				<h3 class="mt-4 text-xl font-semibold">{p.title}</h3>
				<p class="mt-2 flex-1 leading-relaxed text-slate-400">{p.body}</p>
				<div class="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 font-semibold text-accent">
					<Icon name="spark" size={18} />
					{p.metric}
				</div>
			</article>
		{/each}
	</div>
</Section>
