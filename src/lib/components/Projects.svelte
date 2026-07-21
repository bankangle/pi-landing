<script>
	import { onMount } from 'svelte';
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import { spotlight } from '$lib/spotlight.js';
	import Section from './Section.svelte';
	const i18n = useI18n();

	let grid = $state();
	/** @type {HTMLElement[]} */
	let cards = [];

	// Column parallax: while the section passes through the viewport, side
	// columns drift up and the middle column drifts down — same Lenis physics
	// as everything else. Desktop only; stacked mobile keeps still.
	onMount(() => {
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
			ctx.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
				const speed = [22, -30, 22]; // px of drift per column over the pass
				const apply = (p) => {
					cards.forEach((el, i) => {
						if (!el) return;
						gsap.set(el, { y: speed[i % 3] * (1 - 2 * p) });
					});
				};
				const st = ScrollTrigger.create({
					trigger: grid,
					start: 'top bottom',
					end: 'bottom top',
					scrub: getLenis() ? true : 1,
					onUpdate: (s) => apply(s.progress),
					onRefresh: (s) => apply(s.progress)
				});
				return () => {
					st.kill();
					gsap.set(cards.filter(Boolean), { clearProps: 'y' });
				};
			});
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	});
</script>

<Section id="projects" ns="projects">
	<div bind:this={grid} class="grid gap-5 md:grid-cols-3">
		{#each i18n.t.projects.items as p, i}
			<article
				bind:this={cards[i]}
				class="plx spotlight beam grid row-span-3 grid-rows-subgrid gap-y-0 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-white/[0.07] to-transparent p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10"
				use:reveal={{ delay: i * 90 }}
				use:spotlight
			>
				<h3 class="text-xl font-semibold">{p.title}</h3>
				<p class="mt-2 leading-relaxed text-slate-400">{p.body}</p>
				<div class="mt-4 font-semibold text-white">{p.metric}</div>
			</article>
		{/each}
	</div>
</Section>
