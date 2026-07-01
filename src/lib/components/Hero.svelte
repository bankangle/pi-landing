<script>
	import { useI18n } from '$lib/i18n-context.js';
	import Icon from './Icon.svelte';
	const i18n = useI18n();

	const stats = [
		{ value: '50+', key: 'stat1' },
		{ value: '+20%', key: 'stat2' },
		{ value: '2', unit: { ru: 'нед', en: 'wks' }, key: 'stat3' }
	];
</script>

<section id="top" class="relative overflow-hidden">
	<!-- ambient background -->
	<div class="pointer-events-none absolute inset-0 bg-grid opacity-60"></div>
	<div class="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"></div>
	<div class="pointer-events-none absolute -right-32 top-40 h-[360px] w-[360px] rounded-full bg-indigo-500/20 blur-[120px]"></div>

	<div class="relative mx-auto max-w-6xl px-6 pb-24 pt-36 sm:pt-44">
		<div class="mx-auto max-w-3xl text-center">
			<span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
				<span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
				{i18n.t.hero.eyebrow}
			</span>

			<h1 class="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
				{i18n.t.hero.title}
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">
				{i18n.t.hero.subtitle}
			</p>

			<div class="mt-9 flex flex-wrap items-center justify-center gap-4">
				<a
					href="#contact"
					class="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-ink transition-transform hover:scale-[1.03]"
				>
					{i18n.t.hero.ctaPrimary}
					<Icon name="arrow" size={18} class="transition-transform group-hover:translate-x-0.5" />
				</a>
				<a
					href="#services"
					class="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-100 transition-colors hover:border-accent hover:text-accent"
				>
					{i18n.t.hero.ctaSecondary}
				</a>
			</div>
		</div>

		<div class="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
			{#each stats as s}
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
					<div class="text-3xl font-bold text-accent">
						{s.value}{#if s.unit}<span class="text-xl"> {s.unit[i18n.lang]}</span>{/if}
					</div>
					<div class="mt-1 text-sm text-slate-400">{i18n.t.hero[s.key]}</div>
				</div>
			{/each}
		</div>
	</div>
</section>
