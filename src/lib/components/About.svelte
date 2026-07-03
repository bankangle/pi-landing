<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import { spotlight } from '$lib/spotlight.js';
	import Icon from './Icon.svelte';
	const i18n = useI18n();
</script>

<section id="about" class="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
	<div class="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
		<div use:reveal={{ x: -40 }}>
			<span class="text-sm font-semibold uppercase tracking-wider text-accent">{i18n.t.about.eyebrow}</span>
			<div class="mt-5 space-y-4 text-lg leading-relaxed text-slate-300">
				<p>{i18n.t.about.p1}</p>
				<p>{i18n.t.about.p2}</p>
				<p>{i18n.t.about.p3}</p>
			</div>
			<p class="mt-6 border-l-2 border-accent/50 pl-4 text-sm italic text-slate-400">{i18n.t.about.note}</p>
		</div>

		<div class="flex flex-col gap-4" use:reveal={{ delay: 120 }}>
			<div class="spotlight beam rounded-2xl border border-white/10 bg-white/5 p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10" use:spotlight>
				<h3 class="font-semibold text-white">{i18n.t.about.principlesTitle}</h3>
				<ul class="mt-4 space-y-3">
					{#each i18n.t.about.principles as p}
						<li class="flex items-start gap-3 text-slate-300">
							<span class="mt-0.5 shrink-0 text-accent"><Icon name="check" size={20} /></span>
							{p}
						</li>
					{/each}
				</ul>
			</div>
			<div class="spotlight beam rounded-2xl border border-white/10 bg-linear-to-br from-accent/15 to-transparent p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10" use:spotlight>
				<h3 class="font-semibold text-white">{i18n.t.about.teamTitle}</h3>
				<p class="mt-2 leading-relaxed text-slate-300">{i18n.t.about.team}</p>
			</div>
		</div>
	</div>
</section>
