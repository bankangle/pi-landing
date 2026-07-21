<script>
	// Passive scrollbar replacement: a thin thumb on the right edge that mirrors
	// scroll position. pointer-events: none — it indicates, it cannot be dragged.
	// Fades out after a moment of scroll silence, macOS-style.
	import { onMount } from 'svelte';

	let top = $state(0); // thumb offset, %
	let size = $state(10); // thumb height, %
	let active = $state(false);

	onMount(() => {
		let raf = 0;
		let lastY = -1;
		let hideT;
		const loop = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - window.innerHeight;
			const y = window.scrollY;
			size = Math.max(6, (window.innerHeight / doc.scrollHeight) * 100);
			top = max > 0 ? (y / max) * (100 - size) : 0;
			if (y !== lastY) {
				lastY = y;
				active = true;
				clearTimeout(hideT);
				hideT = setTimeout(() => (active = false), 900);
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(hideT);
		};
	});
</script>

<div class="pointer-events-none fixed inset-y-2 right-1 z-[90] w-1" aria-hidden="true">
	<div
		class="w-full rounded-full bg-slate-400/50 transition-opacity duration-500 {active ? 'opacity-100' : 'opacity-0'}"
		style="height: {size}%; transform: translateY({(top / size) * 100}%)"
	></div>
</div>
