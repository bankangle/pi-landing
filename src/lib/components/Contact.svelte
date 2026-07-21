<script>
	import { onMount } from 'svelte';
	import { useI18n } from '$lib/i18n-context.js';
	import { EMAIL } from '$lib/i18n.js';
	import { reveal } from '$lib/reveal.js';
	import Ambient from './Ambient.svelte';
	const i18n = useI18n();

	let sectionEl = $state();

	// Contact gravity: inertia arriving from above always lands centred on this
	// section; the footer below takes ONE more deliberate scroll. Crossing-based
	// (like the products deck), so scrolling onward/back is never trapped.
	onMount(() => {
		let raf0 = 0;
		let cleanup = () => {};
		(async () => {
			const { getLenis } = await import('$lib/smooth-scroll.js');
			const lenis = getLenis();
			if (!lenis || !sectionEl) return;
			let prev = window.scrollY;
			let consumed = false; // gate already used for this approach
			let snapping = false;
			const onScroll = () => {
				const T = sectionEl.getBoundingClientRect().top + window.scrollY;
				const gate = T - window.innerHeight * 0.3;
				const y = window.scrollY;
				if (snapping) {
					prev = y;
					return;
				}
				if (y < gate - 60) consumed = false; // left upward -> re-arm
				// intercept IN FLIGHT: the moment the approach crosses the gate,
				// retarget the scroll to land on the section — never reach the
				// footer on the first pass. lock keeps leftover wheel momentum
				// from pushing past; the NEXT gesture scrolls to the footer.
				if (!consumed && prev < gate && y >= gate) {
					consumed = true;
					snapping = true;
					lenis.scrollTo(T, {
						duration: 0.7,
						lock: true,
						easing: (x) => 1 - Math.pow(1 - x, 3),
						onComplete: () => (snapping = false)
					});
					setTimeout(() => (snapping = false), 1000); // safety
				}
				prev = y;
			};
			window.addEventListener('scroll', onScroll, { passive: true });
			cleanup = () => window.removeEventListener('scroll', onScroll);
		})();
		return () => {
			cancelAnimationFrame(raf0);
			cleanup();
		};
	});
</script>

<section id="contact" bind:this={sectionEl} class="relative flex min-h-svh scroll-mt-24 flex-col justify-center overflow-hidden py-24">
	<div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
	<Ambient />

	<div class="relative mx-auto w-full max-w-2xl px-6 text-center" use:reveal>
		<h2 class="select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.contact.title}</h2>
		<a
			href="mailto:{EMAIL}"
			class="mt-8 inline-block rounded-full bg-accent px-8 py-4 text-xl font-semibold text-white transition-transform hover:scale-[1.03]"
		>
			{EMAIL}
		</a>
	</div>
</section>
