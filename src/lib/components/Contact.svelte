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
			let armed = false;
			let snapping = false;
			let t;
			const onScroll = () => {
				const T = sectionEl.getBoundingClientRect().top + window.scrollY;
				const gate = T - window.innerHeight * 0.45;
				const y = window.scrollY;
				if (snapping) {
					prev = y;
					return;
				}
				if (prev < gate && y >= gate) armed = true; // crossed in from above
				if (y < gate) armed = false; // left upward
				prev = y;
				if (!armed) return;
				clearTimeout(t);
				t = setTimeout(() => {
					const y2 = window.scrollY;
					if (y2 >= gate && Math.abs(y2 - T) > 2) {
						snapping = true;
						armed = false;
						lenis.scrollTo(T, {
							duration: 0.6,
							easing: (x) => 1 - Math.pow(1 - x, 3),
							onComplete: () => (snapping = false)
						});
						setTimeout(() => (snapping = false), 900); // safety
					} else {
						armed = false;
					}
				}, 150);
			};
			window.addEventListener('scroll', onScroll, { passive: true });
			cleanup = () => {
				clearTimeout(t);
				window.removeEventListener('scroll', onScroll);
			};
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
