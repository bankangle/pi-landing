<script>
	// Barely-visible "scroll down" chevron that fades in only after the user has
	// been idle near the top for a moment (no intent to scroll). Any scroll hides
	// it; if they return to the top and idle again, it comes back.
	import { onMount } from 'svelte';

	let visible = $state(false);
	let timer;
	const DELAY = 3500; // ms of no-scroll before the hint appears
	const NEAR_TOP = 80; // only hint while still at the very top

	function schedule() {
		clearTimeout(timer);
		visible = false;
		if (window.scrollY < NEAR_TOP) {
			timer = setTimeout(() => {
				if (window.scrollY < NEAR_TOP) visible = true;
			}, DELAY);
		}
	}

	onMount(() => {
		schedule();
		const onScroll = () => schedule();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			clearTimeout(timer);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<a
	href="#about"
	aria-hidden="true"
	tabindex="-1"
	class="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-slate-400 transition-opacity duration-1000 {visible
		? 'opacity-30 hover:opacity-60'
		: 'pointer-events-none opacity-0'}"
>
	<svg
		class="hint-bounce"
		width="46"
		height="34"
		viewBox="0 0 24 18"
		fill="none"
		stroke="currentColor"
		stroke-width="1.4"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M3 3l9 7 9-7" />
		<path d="M3 9l9 7 9-7" />
	</svg>
</a>
