// Desync a CSS animation so multiple elements don't loop in lockstep.
// Runs client-side only (Svelte actions never run during SSR), so there's no
// hydration mismatch from the random values.
//
// - A random *negative* delay starts the element at a random point in its cycle.
// - The duration is jittered a bit so the loops slowly drift apart over time.
/** @param {HTMLElement} node @param {{ base: number, jitter?: number }} opts */
export function desync(node, { base, jitter = 0.35 }) {
	if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return {};
	}
	const duration = base * (1 - jitter / 2 + Math.random() * jitter);
	node.style.animationDuration = `${duration.toFixed(2)}s`;
	node.style.animationDelay = `-${(Math.random() * duration).toFixed(2)}s`;
	return {};
}

// Count a number up from 0 when it scrolls into view. Parses the node's text
// (e.g. "20+", "+18%") into prefix / number / suffix and animates the number.
/** @param {HTMLElement} node @param {{ duration?: number }} [opts] */
export function countUp(node, { duration = 1400 } = {}) {
	const final = (node.textContent ?? '').trim();
	const m = final.match(/^(\D*)([\d.,\s]+)(.*)$/);
	if (!m || typeof IntersectionObserver === 'undefined') return {};

	const prefix = m[1];
	const target = parseFloat(m[2].replace(/[\s,]/g, ''));
	const suffix = m[3];
	if (Number.isNaN(target)) return {};

	const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) return {};

	/** @param {number} v */
	const render = (v) => (node.textContent = `${prefix}${Math.round(v)}${suffix}`);
	render(0);

	let raf = 0;
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					io.unobserve(node);
					const start = performance.now();
					const step = (now) => {
						const p = Math.min(1, (now - start) / duration);
						render(target * (1 - Math.pow(1 - p, 3))); // ease-out cubic
						if (p < 1) raf = requestAnimationFrame(step);
						else node.textContent = final; // restore exact original ("20+")
					};
					raf = requestAnimationFrame(step);
				}
			}
		},
		{ threshold: 0.5 }
	);
	io.observe(node);

	return {
		destroy() {
			cancelAnimationFrame(raf);
			io.disconnect();
		}
	};
}
