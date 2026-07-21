// Lando-style virtual scroll: Lenis owns the scroll — wheel/trackpad input is
// lerped into a smooth position, and GSAP ScrollTrigger reads that smoothed
// value (single physics system, no fighting). The native scrollbar is hidden
// (a passive indicator component replaces it); dragging it is impossible.
// Touch devices keep fully native scrolling — Lenis stays out of the way there.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis = null;

/** Idempotent. Returns the Lenis instance, or null when staying native. */
export function initSmoothScroll() {
	if (lenis || typeof window === 'undefined') return lenis;
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
	if (matchMedia('(pointer: coarse)').matches) return null; // native on touch

	gsap.registerPlugin(ScrollTrigger);

	lenis = new Lenis({
		lerp: 0.1, // Lando-feel smoothing; higher = snappier
		anchors: true // #nav links glide through Lenis instead of jumping
	});
	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);

	// hide the real scrollbar; ScrollIndicator renders the passive one
	document.documentElement.classList.add('no-scrollbar');
	return lenis;
}
