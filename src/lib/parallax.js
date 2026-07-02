// Inertial pointer parallax — the target eases toward the cursor with a low
// factor, so it reacts slowly and "coasts" (delayed / inert). Client-only.
// Applies a translate on the node; children keep their own animations.
/** @param {HTMLElement} node @param {{ max?: number, ease?: number }} [opts] */
export function parallax(node, opts = {}) {
	const max = opts.max ?? 26; // px of travel at the screen edges
	const ease = opts.ease ?? 0.045; // low = slow, inert follow

	if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return {};
	}

	let tx = 0, ty = 0, cx = 0, cy = 0;
	let raf = 0;

	const loop = () => {
		cx += (tx - cx) * ease;
		cy += (ty - cy) * ease;
		node.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
		if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
			raf = requestAnimationFrame(loop);
		} else {
			raf = 0;
		}
	};

	/** @param {PointerEvent} e */
	const onMove = (e) => {
		tx = (e.clientX / window.innerWidth - 0.5) * 2 * max;
		ty = (e.clientY / window.innerHeight - 0.5) * 2 * max;
		if (!raf) raf = requestAnimationFrame(loop);
	};

	window.addEventListener('pointermove', onMove, { passive: true });
	node.style.willChange = 'transform';

	return {
		destroy() {
			window.removeEventListener('pointermove', onMove);
			cancelAnimationFrame(raf);
		}
	};
}
