<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import Icon from './Icon.svelte';
	const i18n = useI18n();

	const points = [
		{ icon: 'check', tKey: 'point1' },
		{ icon: 'bolt', tKey: 'point2' },
		{ icon: 'chart', tKey: 'point3' }
	];
</script>

<section id="about" class="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
	<div class="grid items-center gap-14 lg:grid-cols-2">
		<div use:reveal>
			<span class="text-sm font-semibold uppercase tracking-wider text-accent">{i18n.t.about.eyebrow}</span>
			<h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.about.title}</h2>
			<p class="mt-5 text-lg leading-relaxed text-slate-300">{i18n.t.about.body}</p>
		</div>

		<div class="grid gap-4" use:reveal={{ delay: 120 }}>
			{#each points as p}
				<div class="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
					<div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
						<Icon name={p.icon} size={22} />
					</div>
					<div>
						<h3 class="font-semibold">{i18n.t.about[p.tKey + 'Title']}</h3>
						<p class="mt-1 text-sm text-slate-400">{i18n.t.about[p.tKey + 'Body']}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
