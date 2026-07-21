<script>
	// Products as a vert→hor→vert story (Lando-style): on desktop the WHOLE
	// block pins — header stays on top, the note + progress stay at the bottom,
	// and continued scrolling slides one product per screen horizontally in the
	// middle. Built on GSAP ScrollTrigger — native scroll is never hijacked;
	// panels are translated FROM the scroll position each frame.
	// Mobile / no-JS / reduced-motion: plain vertical stack of the same panels.
	import { onMount, tick } from 'svelte';
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import { spotlight } from '$lib/spotlight.js';
	const i18n = useI18n();

	let pinWrap = $state();
	let track = $state();
	let horizontal = $state(false); // true while the GSAP layout is active
	let progress = $state(0);
	/** @type {HTMLElement[]} */
	let panels = [];

	const n = () => i18n.t.products.items.length;
	const current = $derived(Math.min(n(), Math.max(1, Math.round(progress * (n() - 1)) + 1)));

	onMount(() => {
		let ctx;
		let cancelled = false;
		(async () => {
			const [{ gsap }, { ScrollTrigger }] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger')
			]);
			if (cancelled) return;
			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.matchMedia();
			ctx.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
				let killed = false;
				let tween;
				let approach;
				let cleanupExtra;
				horizontal = true;
				// let Svelte apply the horizontal layout before measuring
				tick().then(async () => {
					if (killed) return;
					const { getLenis } = await import('$lib/smooth-scroll.js');
					const dist = () => track.scrollWidth - window.innerWidth;
					// Lenis-native snap: when scrolling rests mid-story, glide the
					// nearest card to centre THROUGH the virtual scroll (no fighting).
					let snapT;
					const scheduleSnap = (st) => {
						clearTimeout(snapT);
						snapT = setTimeout(() => {
							const lenis = getLenis();
							if (!lenis || killed) return;
							const p = st.progress;
							if (p <= 0.001 || p >= 0.999) return;
							const idx = Math.round(p * (n() - 1));
							const target = st.start + (idx / (n() - 1)) * (st.end - st.start);
							if (Math.abs(window.scrollY - target) < 2) return;
							lenis.scrollTo(target, { duration: 0.55, easing: (t) => 1 - Math.pow(1 - t, 3) });
						}, 180);
					};
					// Deck effect: every card's shift/scale/depth is a continuous
					// function of its distance to the centre, so all size changes
					// animate smoothly with the scroll — nothing snaps by class.
					const deck = (p) => {
						const fi = p * (n() - 1);
						panels.forEach((el, k) => {
							if (!el) return;
							const d = k - fi;
							const ad = Math.abs(d);
							const w = el.offsetWidth || 600;
							gsap.set(el, {
								x: -Math.sign(d) * Math.min(ad, 1) * w * 0.42, // tuck under the active card
								scale: 1 - 0.12 * Math.min(ad, 1.3),
								zIndex: 100 - Math.round(ad * 10),
								opacity: 1 - 0.3 * Math.min(ad, 1),
								transformOrigin: 'center center'
							});
						});
					};
					// approach: the assembled deck rides in from the right while the
					// section is still scrolling INTO view — motion never stands still
					approach = gsap.fromTo(
						track,
						{ x: () => window.innerWidth * 0.55 },
						{
							x: 0,
							ease: 'none',
							immediateRender: true,
							scrollTrigger: {
								trigger: pinWrap,
								start: 'top bottom',
								end: 'top top',
								scrub: 1,
								invalidateOnRefresh: true
							}
						}
					);
					tween = gsap.fromTo(track, { x: 0 }, {
						x: () => -dist(),
						ease: 'none',
						immediateRender: false,
						scrollTrigger: {
							trigger: pinWrap,
							start: 'top top',
							end: () => '+=' + dist(),
							pin: true,
							scrub: 1,
							invalidateOnRefresh: true,
							onUpdate: (st) => {
								progress = st.progress;
								deck(st.progress);
								scheduleSnap(st);
							},
							onRefresh: (st) => deck(st.progress)
						}
					});
					deck(tween.scrollTrigger?.progress ?? 0);
					const clearSnap = () => clearTimeout(snapT);
					cleanupExtra = clearSnap;
				});
				return () => {
					killed = true;
					cleanupExtra?.();
					approach?.scrollTrigger?.kill();
					approach?.kill();
					tween?.scrollTrigger?.kill();
					tween?.kill();
					gsap.set(track, { clearProps: 'all' });
					if (panels.length) gsap.set(panels.filter(Boolean), { clearProps: 'all' });
					horizontal = false;
				};
			});
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	});
</script>

<section id="products" class="relative scroll-mt-24 py-24 max-md:pb-12 {horizontal ? 'pb-0' : ''}">
	<!-- telegram-chat-style doodle wallpaper for the whole section -->
	<div class="doodle-bg pointer-events-none absolute inset-0" aria-hidden="true"></div>
	<div bind:this={pinWrap} class={horizontal ? 'flex h-svh flex-col pt-24 [@media(max-height:56rem)]:pt-20' : ''}>
		<!-- header: pinned on top with the same rhythm as other sections when
		     height allows; tightens, then hides, as the viewport gets shorter -->
		<div
			class="mx-auto px-6 text-center {horizontal
				? 'mb-14 shrink-0 [@media(max-height:56rem)]:mb-4 [@media(max-height:36rem)]:hidden'
				: 'mb-14'}"
			use:reveal
		>
			<h2 class="select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.products.title}</h2>
			<p class="mt-4 text-lg text-slate-400 {horizontal ? '[@media(max-height:47rem)]:hidden' : ''}">
				{i18n.t.products.subtitle}
			</p>
		</div>

		<!-- panels: active card centered, neighbours peeking at the sides.
		     --cardw: 88vw on phones (no neighbours visible), 40rem on desktop -->
		<div class={horizontal ? 'relative flex min-h-0 flex-1 items-center overflow-hidden' : ''}>
			<div
				bind:this={track}
				style={horizontal ? '--cardw: min(40rem, 88vw); padding-inline: calc((100vw - var(--cardw)) / 2)' : ''}
				class={horizontal
					? 'flex w-max items-stretch gap-6 will-change-transform'
					: 'mx-auto flex max-w-6xl flex-col gap-5 px-6'}
			>
				{#each i18n.t.products.items as p, i}
					<div
						class={horizontal
							? 'relative flex w-(--cardw) shrink-0 items-stretch py-4'
							: ''}
					>
						<article
							class="spotlight beam relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 *:relative *:z-10 {horizontal
								? 'h-full bg-[#111b31] p-8 shadow-2xl shadow-black/60'
								: 'bg-white/5 hover:shadow-2xl hover:shadow-accent/15'}"
							use:spotlight
						>
							{#if horizontal}
								{#if i === current - 1}
									<!-- split-flap: the top half of the digit falls into place on activation -->
									{#key current}
										<span class="flipnum pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-bold leading-none" aria-hidden="true">
											<span class="fn-bottom text-white/10">{String(i + 1).padStart(2, '0')}</span>
											<span class="fn-top text-white/10">{String(i + 1).padStart(2, '0')}</span>
										</span>
									{/key}
								{:else}
									<span class="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-bold leading-none text-white/5">
										{String(i + 1).padStart(2, '0')}
									</span>
								{/if}
							{/if}
							<h3 class="text-xl font-semibold {horizontal ? 'md:text-2xl' : ''}">{p.title}</h3>
							<ul class="mt-4 space-y-2.5">
								{#each p.points as point, j}
									{#if j === 0}
										<li class="font-semibold leading-relaxed text-white">{point}</li>
									{:else if j === 1}
										<li class="text-xs leading-relaxed text-slate-500">{point}</li>
									{:else}
										<li class="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
											<span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"></span>
											{point}
										</li>
									{/if}
								{/each}
							</ul>
						</article>
					</div>
				{/each}
			</div>
		</div>

		{#if horizontal}
			<!-- note + progress: pinned at the bottom for the whole story -->
			<div class="mx-auto flex w-full max-w-4xl shrink-0 flex-col items-center gap-2 px-6 pb-10 pt-4 [@media(max-height:56rem)]:pb-5">
				<p
					class="select-none rounded-2xl border border-white/10 bg-[#0e1727]/90 px-6 py-2.5 text-center text-xs italic leading-relaxed text-slate-400 backdrop-blur-sm [@media(max-height:47rem)]:hidden {progress > 0.95
						? 'note-on'
						: ''}"
				>
					{i18n.t.products.note}
				</p>
			</div>
		{:else}
			<p class="note-glow mx-auto mt-10 w-fit max-w-3xl rounded-2xl border border-white/10 bg-[#0e1727]/90 px-6 py-3 text-center text-sm italic leading-relaxed text-slate-400 backdrop-blur-sm" use:reveal>
				{i18n.t.products.note}
			</p>
		{/if}
	</div>
</section>
