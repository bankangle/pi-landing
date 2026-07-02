// Reveal-on-scroll Svelte action — hand-coded, no library.
// Usage: <div use:reveal={{ delay, x, y }}> ... </div>
//
// Two triggers, because IntersectionObserver alone is not enough on iOS:
// Safari batches IO callbacks during momentum scrolling, so a fast fling can
// sail through whole sections while they're still opacity:0 (blank screen).
//  1. a shared IO with a generous pre-trigger margin (reveals ~35% early)
//  2. a shared scroll/resize fallback that force-reveals anything already
//     inside (or near) the viewport — catching up instantly, without stagger.

const pending = new Set();
let io = null;
let bound = false;
let raf = 0;

function show(node, catchUp = false) {
	if (catchUp) {
		// late catch-up (mid-fling): no stagger, quick fade instead of the full 0.7s
		node.style.transitionDelay = '0ms';
		node.style.transitionDuration = '0.3s';
	}
	node.classList.add('is-visible');
	pending.delete(node);
	io?.unobserve(node);
}

function flush() {
	raf = 0;
	if (!pending.size) return;
	const limit = window.innerHeight + 150;
	for (const node of [...pending]) {
		const r = node.getBoundingClientRect();
		if (r.top < limit && r.bottom > -150) show(node, true);
	}
}

function onScroll() {
	if (!raf && pending.size) raf = requestAnimationFrame(flush);
}

function ensure() {
	if (typeof IntersectionObserver !== 'undefined' && !io) {
		io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) show(e.target);
			},
			{ threshold: 0, rootMargin: '0px 0px 35% 0px' }
		);
	}
	if (!bound && typeof window !== 'undefined') {
		bound = true;
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
	}
}

/** @param {HTMLElement} node @param {{ delay?: number, x?: number, y?: number }} [opts] */
export function reveal(node, opts = {}) {
	node.classList.add('reveal');
	if (opts.delay) node.style.transitionDelay = `${opts.delay}ms`;
	// Directional entrance: offset the start position (px). Defaults to rising up.
	if (opts.x != null) node.style.setProperty('--rx', `${opts.x}px`);
	if (opts.y != null) node.style.setProperty('--ry', `${opts.y}px`);

	ensure();
	if (!io) {
		// very old browsers: never leave content hidden
		node.classList.add('is-visible');
		return {};
	}
	pending.add(node);
	io.observe(node);

	return {
		destroy() {
			pending.delete(node);
			io?.unobserve(node);
		}
	};
}
