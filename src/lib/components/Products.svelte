<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import { spotlight } from '$lib/spotlight.js';
	import Section from './Section.svelte';
	const i18n = useI18n();

	// point[0] = «Эффект…» (the money line), point[1] = complexity/cost/timeline meta
	const isEffect = (idx) => idx === 0;
	const isMeta = (idx) => idx === 1;
</script>

<Section id="products" ns="products">
	<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
		{#each i18n.t.products.items as p, i}
			<article
				class="spotlight beam flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10"
				use:reveal={{ delay: (i % 3) * 80 }}
				use:spotlight
			>
				<h3 class="text-xl font-semibold">{p.title}</h3>
				<ul class="mt-4 space-y-2.5">
					{#each p.points as point, j}
						{#if isEffect(j)}
							<li class="font-semibold leading-relaxed text-accent">{point}</li>
						{:else if isMeta(j)}
							<li class="text-xs leading-relaxed text-slate-500">{point}</li>
						{:else}
							<li class="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
								<span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"></span>
								{point}
							</li>
						{/if}
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<p class="mx-auto mt-10 max-w-3xl border-l-2 border-accent/50 pl-4 text-sm italic leading-relaxed text-slate-400" use:reveal>
		{i18n.t.products.note}
	</p>
</Section>
