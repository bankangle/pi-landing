<script>
	import { onMount } from 'svelte';
	import { useI18n } from '$lib/i18n-context.js';
	import { countUp } from '$lib/anim.js';
	import Ambient from './Ambient.svelte';
	import IntroReveal from './IntroReveal.svelte';
	import ScrollHint from './ScrollHint.svelte';
	import Icon from './Icon.svelte';
	const i18n = useI18n();

	let sectionEl = $state();
	let contentEl = $state();
	let dive = $state(false); // desktop scroll-dive owns the transform

	// Mobile fallback: the old soft drift-up + fade on scroll.
	let scrollY = $state(0);
	let reduce = $state(false);
	const py = $derived(reduce || dive ? 0 : scrollY * 0.15);
	const fade = $derived(reduce || dive ? 1 : Math.max(0, 1 - scrollY / 600));

	onMount(() => {
		reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let ctx;
		let cancelled = false;
		(async () => {
			const [{ gsap }, { ScrollTrigger }, { getLenis }] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger'),
				import('$lib/smooth-scroll.js')
			]);
			if (cancelled) return;
			gsap.registerPlugin(ScrollTrigger);
			ctx = gsap.matchMedia();
			// Zoom-through dive: hero pins, the copy flies INTO the viewer and you
			// pass "through" it into About; the grid zooms along for depth.
			ctx.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
				dive = true;
				gsap.set(contentEl, { transformOrigin: '50% 42%' });
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top top',
						end: '+=75%',
						pin: true,
						scrub: getLenis() ? true : 1,
						invalidateOnRefresh: true
					}
				});
				tl.to(contentEl, { scale: 4.6, autoAlpha: 0, ease: 'power1.in' }, 0)
					.to('.ambient-grid', { scale: 1.6, ease: 'none' }, 0);
				return () => {
					tl.scrollTrigger?.kill();
					tl.kill();
					gsap.set([contentEl, '.ambient-grid'], { clearProps: 'all' });
					dive = false;
				};
			});
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	});
</script>

<svelte:window on:scroll={() => (scrollY = window.scrollY)} />

<IntroReveal />

<section id="top" bind:this={sectionEl} class="relative flex min-h-svh flex-col justify-center overflow-hidden">
	<Ambient grid />

	<div class="relative mx-auto w-full max-w-6xl px-6 py-28 sm:py-32">
		<div
			bind:this={contentEl}
			class="mx-auto max-w-3xl text-center"
			style={dive ? '' : `transform: translateY(${py}px); opacity: ${fade}`}
		>
			<h1 class="text-balance select-none text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
				{#each i18n.t.hero.title.split(' ') as w, wi}
					<span class="hw" style="--d:{120 + wi * 95}ms"><span class="hwi">{w}</span></span>{' '}
				{/each}
			</h1>

			<p class="hero-sub mx-auto mt-6 max-w-2xl select-none text-pretty text-lg leading-relaxed text-slate-300">
				{i18n.t.hero.subtitle}
			</p>

			<div class="mt-9 flex flex-wrap items-center justify-center gap-4">
				<a
					href="#contact"
					class="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
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
					<div class="select-none text-3xl font-bold text-white" use:countUp>{s.value}</div>
					<div class="mt-1 text-sm text-slate-400">{s.label}</div>
				</div>
			{/each}
		</div>
	</div>

	<ScrollHint />
</section>
