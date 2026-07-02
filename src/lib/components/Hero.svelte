<script>
	import { onMount } from 'svelte';
	import { useI18n } from '$lib/i18n-context.js';
	import { countUp } from '$lib/anim.js';
	import Ambient from './Ambient.svelte';
	import ScrollHint from './ScrollHint.svelte';
	import Icon from './Icon.svelte';
	const i18n = useI18n();

	// Subtle parallax: the hero copy drifts up and fades as you scroll into the story.
	let scrollY = $state(0);
	let reduce = $state(false);
	onMount(() => {
		reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
	const py = $derived(reduce ? 0 : scrollY * 0.15);
	const fade = $derived(reduce ? 1 : Math.max(0, 1 - scrollY / 600));
</script>

<svelte:window on:scroll={() => (scrollY = window.scrollY)} />

<section id="top" class="relative flex min-h-svh flex-col justify-center overflow-hidden">
	<Ambient grid />

	<div class="relative mx-auto w-full max-w-6xl px-6 py-28 sm:py-32">
		<div class="mx-auto max-w-3xl text-center" style="transform: translateY({py}px); opacity: {fade}">
			<h1 class="text-balance select-none text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
				{i18n.t.hero.title}
			</h1>

			<p class="mx-auto mt-6 max-w-2xl select-none text-pretty text-lg leading-relaxed text-slate-300">
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
			{#each i18n.t.hero.stats as s}
				<div class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
					<div class="select-none text-3xl font-bold text-accent" use:countUp>{s.value}</div>
					<div class="mt-1 text-sm text-slate-400">{s.label}</div>
				</div>
			{/each}
		</div>
	</div>

	<ScrollHint />
</section>
