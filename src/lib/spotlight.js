// Card inner-glow that eases toward the cursor (--spot-x / --spot-y) and records
// the pointer ENTRY point (--ex / --ey) so the CSS border beam spreads from there.
// The beam radius (--br) itself is animated purely in CSS (see app.css).
/** @param {HTMLElement} node @param {{ ease?: number }} [opts] */
export function spotlight(node, opts = {}) {
	const ease = opts.ease ?? 0.15;

	if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return {};
	}

	let raf = 0;
	let hovering = false;
	let cx = 0, cy = 0, tx = 0, ty = 0;

	const apply = () => {
		node.style.setProperty('--spot-x', `${cx}px`);
		node.style.setProperty('--spot-y', `${cy}px`);
	};

	const loop = () => {
		cx += (tx - cx) * ease;
		cy += (ty - cy) * ease;
		apply();
		if (hovering || Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
			raf = requestAnimationFrame(loop);
		} else {
			raf = 0;
		}
	};

	const rect = () => node.getBoundingClientRect();
	const kick = () => {
		if (!raf) raf = requestAnimationFrame(loop);
	};

	/** @param {PointerEvent} e */
	const onEnter = (e) => {
		hovering = true;
		const r = rect();
		const ex = e.clientX - r.left;
		const ey = e.clientY - r.top;
		cx = tx = ex;
		cy = ty = ey;
		node.style.setProperty('--ex', `${ex}px`);
		node.style.setProperty('--ey', `${ey}px`);
		kick();
	};

	/** @param {PointerEvent} e */
	const onMove = (e) => {
		const r = rect();
		tx = e.clientX - r.left;
		ty = e.clientY - r.top;
		kick();
	};

	const onLeave = () => {
		hovering = false;
		kick();
	};

	node.addEventListener('pointerenter', onEnter);
	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener('pointerenter', onEnter);
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
}
