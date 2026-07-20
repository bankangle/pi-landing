<script>
	// Products as a vert→hor→vert story (Lando-style): on desktop the section
	// pins and continued scrolling slides one product per screen horizontally,
	// then releases back to vertical flow. Built on GSAP ScrollTrigger — the
	// page's native scroll is never hijacked; panels are translated FROM the
	// scroll position each frame, so there is nothing to fight or shake.
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
				horizontal = true;
				// let Svelte apply the horizontal layout before measuring
				tick().then(() => {
					if (killed) return;
					const dist = () => track.scrollWidth - window.innerWidth;
					tween = gsap.to(track, {
						x: () => -dist(),
						ease: 'none',
						scrollTrigger: {
							trigger: pinWrap,
							start: 'top top',
							end: () => '+=' + dist(),
							pin: true,
							scrub: 1,
							snap: { snapTo: 1 / (n() - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut' },
							invalidateOnRefresh: true,
							onUpdate: (st) => (progress = st.progress)
						}
					});
				});
				return () => {
					killed = true;
					tween?.scrollTrigger?.kill();
					tween?.kill();
					gsap.set(track, { clearProps: 'all' });
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

<section id="products" class="relative scroll-mt-24 py-24 max-md:pb-12">
	<div class="mx-auto mb-14 px-6 text-center" use:reveal>
		<h2 class="select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.products.title}</h2>
		<p class="mt-4 text-lg text-slate-400">{i18n.t.products.subtitle}</p>
	</div>

	<div bind:this={pinWrap} class="relative {horizontal ? 'overflow-hidden' : ''}">
		<div
			bind:this={track}
			class={horizontal
				? 'flex h-svh w-max items-stretch will-change-transform'
				: 'mx-auto flex max-w-6xl flex-col gap-5 px-6'}
		>
			{#each i18n.t.products.items as p, i}
				<div class={horizontal ? 'flex h-svh w-screen shrink-0 items-center px-6 py-10 md:px-16' : ''}>
					<article
						class="spotlight beam relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10 {horizontal
							? 'mx-auto max-h-full max-w-3xl overflow-y-auto p-9'
							: ''}"
						use:spotlight
					>
						{#if horizontal}
							<span class="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-bold leading-none text-white/5">
								{String(i + 1).padStart(2, '0')}
							</span>
						{/if}
						<h3 class="text-xl font-semibold {horizontal ? 'md:text-2xl' : ''}">{p.title}</h3>
						<ul class="mt-4 space-y-2.5">
							{#each p.points as point, j}
								{#if j === 0}
									<li class="font-semibold leading-relaxed text-accent">{point}</li>
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

		{#if horizontal}
			<!-- progress: counter + thin bar, lives inside the pinned viewport -->
			<div class="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2">
				<span class="select-none font-mono text-xs tracking-widest text-slate-500">
					{String(current).padStart(2, '0')} / {String(n()).padStart(2, '0')}
				</span>
				<div class="h-0.5 w-40 overflow-hidden rounded-full bg-white/10">
					<div class="h-full rounded-full bg-accent transition-transform duration-150 ease-out" style="transform: scaleX({progress}); transform-origin: left"></div>
				</div>
			</div>
		{/if}
	</div>

	<p class="mx-auto mt-10 max-w-3xl border-l-2 border-accent/50 px-6 pl-4 text-sm italic leading-relaxed text-slate-400" use:reveal>
		{i18n.t.products.note}
	</p>
</section>
