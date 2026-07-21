<script>
	// Intro match-cut: the PI mark appears large in the centre, holds a beat,
	// then flies and shrinks EXACTLY into the navbar logo slot (FLIP via WAAPI,
	// zero deps). Plays once per session; skipped on reduced-motion, deep
	// scroll restores, or when the nav slot is missing.
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';

	let show = $state(false);
	let size = $state(240);
	let mark = $state();
	let veil = $state();

	onMount(() => {
		try {
			if (sessionStorage.getItem('pi-intro-done')) return;
			if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			if (window.scrollY > 40) return;
			const slot = document.getElementById('nav-logo-slot');
			if (!slot) return;

			sessionStorage.setItem('pi-intro-done', '1');
			size = Math.min(Math.round(window.innerHeight * 0.32), 300);
			slot.style.opacity = '0';
			show = true;

			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					if (!mark) return;
					const from = mark.getBoundingClientRect();
					const to = slot.getBoundingClientRect();
					const dx = to.left + to.width / 2 - (from.left + from.width / 2);
					const dy = to.top + to.height / 2 - (from.top + from.height / 2);
					const s = to.height / from.height;
					veil?.animate(
						[
							{ opacity: 1, offset: 0 },
							{ opacity: 1, offset: 0.35 },
							{ opacity: 0 }
						],
						{ duration: 1300, easing: 'ease-out', fill: 'forwards' }
					);
					const anim = mark.animate(
						[
							{ transform: 'translate(0px, 0px) scale(1)', offset: 0 },
							{ transform: 'translate(0px, 0px) scale(1)', offset: 0.3 },
							{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }
						],
						{ duration: 1300, easing: 'cubic-bezier(0.7, 0, 0.22, 1)', fill: 'forwards' }
					);
					const done = () => {
						slot.style.opacity = '';
						show = false;
					};
					anim.onfinish = done;
					anim.oncancel = done;
				})
			);
		} catch {}
	});
</script>

{#if show}
	<div class="pointer-events-none fixed inset-0 z-85 flex items-center justify-center" aria-hidden="true">
		<div bind:this={veil} class="absolute inset-0 bg-ink/85 backdrop-blur-md"></div>
		<div bind:this={mark} class="relative will-change-transform">
			<Logo {size} class="text-white" />
		</div>
	</div>
{/if}
