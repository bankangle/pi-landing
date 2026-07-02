// Reveal-on-scroll Svelte action — hand-coded with IntersectionObserver, no lib.
// Usage: <div use:reveal> ... </div>  (add class `reveal` via the action)
/** @param {HTMLElement} node @param {{ delay?: number, x?: number, y?: number }} [opts] */
export function reveal(node, opts = {}) {
	node.classList.add('reveal');
	if (opts.delay) node.style.transitionDelay = `${opts.delay}ms`;
	// Directional entrance: offset the start position (px). Defaults to rising up.
	if (opts.x != null) node.style.setProperty('--rx', `${opts.x}px`);
	if (opts.y != null) node.style.setProperty('--ry', `${opts.y}px`);

	// No-op fallback if IO is unavailable (very old browsers / SSR safety).
	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('is-visible');
		return {};
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					io.unobserve(node);
				}
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
	);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
}
