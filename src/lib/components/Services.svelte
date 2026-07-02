<script>
	import { onMount } from 'svelte';
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import { spotlight } from '$lib/spotlight.js';
	import ServiceIcon from './ServiceIcon.svelte';
	const i18n = useI18n();

	const icons = ['chart', 'bolt', 'plug'];
	const n = i18n.t.services.items.length;

	// Mobile: discrete panel stepper. Snap positions = each card centered.
	// Forward gesture (scroll DOWN or RIGHT) -> next card; past the last -> exit
	// downward. Backward (UP or LEFT) -> prev; before the first -> exit upward.
	// One step per gesture (locked until the finger/notch settles).
	let sectionEl = $state();
	let pinEl = $state(); // the carousel block — pinning centers THIS, header sits above off-screen
	let enabled = $state(false);
	let engaged = $state(false); // section is the active, locked panel
	let index = $state(0);

	let settled = $state(-1); // panel that has finished sliding (gates icon anim)
	let armed = true; // re-arms only after the user moves the block away post-exit
	let gestureDone = false; // one step per gesture
	let prevTop = null; // pinEl top on the previous scroll event (crossing detection)
	let touching = false; // a finger is on the screen
	let pending = null; // crossing happened mid-drag -> snap deferred to finger lift
	let tsx = 0, tsy = 0;
	let idleT, wheelT;

	// icon/border animation waits until the slide (500ms) has finished,
	// otherwise half the animation plays off-screen
	$effect(() => {
		const i = index;
		settled = -1;
		if (engaged) {
			const t = setTimeout(() => (settled = i), 550);
			return () => clearTimeout(t);
		}
	});

	const vh = () => window.innerHeight;
	const topDoc = () => pinEl.getBoundingClientRect().top + window.scrollY;

	function measure() {
		enabled =
			window.matchMedia('(max-width: 767px)').matches &&
			!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!enabled) {
			engaged = false;
			index = 0;
		}
	}

	// Eased glide to the pin position instead of an instant scrollTo — a fling
	// can cross the threshold with tens of px of overshoot, and hard-correcting
	// that in one frame reads as a "jump" right before the horizontal mode.
	let aligning = false;
	function alignTo(target) {
		const start = window.scrollY;
		const dist = target - start;
		if (Math.abs(dist) < 2) {
			window.scrollTo(0, target);
			return;
		}
		aligning = true;
		const t0 = performance.now();
		const D = 260;
		const step = (now) => {
			if (!aligning) return; // cancelled (exit)
			const p = Math.min(1, (now - t0) / D);
			const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
			window.scrollTo(0, start + dist * e);
			if (p < 1) requestAnimationFrame(step);
			else aligning = false;
		};
		requestAnimationFrame(step);
	}

	function engage(entry) {
		index = entry === 'up' ? n - 1 : 0;
		engaged = true;
		gestureDone = true; // consume the gesture that brought us in
		alignTo(topDoc()); // smooth settle onto the pin point
	}

	// Exit = just unlock. No assisted scrolling — the user decides where to go.
	// Re-arming happens in onScroll once the block has left the pin zone.
	function exit() {
		engaged = false;
		armed = false;
		aligning = false;
	}

	function stepForward() {
		if (index < n - 1) index += 1;
		else exit();
	}
	function stepBackward() {
		if (index > 0) index -= 1;
		else exit();
	}
	function tryStep(sign) {
		if (gestureDone || aligning) return;
		gestureDone = true;
		if (sign > 0) stepForward();
		else stepBackward();
	}

	function onScroll() {
		if (!enabled || !pinEl) return;
		if (engaged) {
			if (aligning) return; // the glide is driving the scroll — don't fight it
			// hold the panel pinned — cancels any residual momentum/drift
			const t = topDoc();
			if (Math.abs(window.scrollY - t) > 1) window.scrollTo(0, t);
			return;
		}
		const top = pinEl.getBoundingClientRect().top;
		if (!armed) {
			// just exited: stay passive until the block moves off the pin point,
			// then crossing detection takes over again
			if (Math.abs(top) > 30) armed = true;
			prevTop = top;
			return;
		}
		if (prevTop === null) {
			prevTop = top;
			return;
		}
		if (pending) {
			// finger still down: don't snap yet (that fight causes shaking) — just
			// clamp so the drag can't continue past the pin point
			const t = topDoc();
			if (pending === 'down' && window.scrollY > t) window.scrollTo(0, t);
			else if (pending === 'up' && window.scrollY < t) window.scrollTo(0, t);
			const now = pinEl.getBoundingClientRect().top;
			// dragging clearly back the way they came cancels the pending snap
			if ((pending === 'down' && now > 40) || (pending === 'up' && now < -40)) pending = null;
			prevTop = now;
			return;
		}
		// Engage ONLY when the block's top CROSSES the pin point (~10px):
		//  - from above-approach, scrolling down  -> snap to FIRST panel
		//  - from below-approach, scrolling up    -> snap to LAST panel
		// Moving away never crosses, so exits scroll freely in both directions.
		// Crossing also catches fast flings that overshoot between events.
		const NEAR = 10;
		if (prevTop > NEAR && top <= NEAR) {
			if (touching) pending = 'down';
			else engage('down');
		} else if (prevTop < -NEAR && top >= -NEAR) {
			if (touching) pending = 'up';
			else engage('up');
		}
		prevTop = top;
	}

	// forward = scroll down (finger up) or scroll right (finger left)
	function onWheel(e) {
		if (!enabled || !engaged) return;
		e.preventDefault();
		const s = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
		if (Math.abs(s) < 4) return;
		tryStep(Math.sign(s));
		clearTimeout(wheelT);
		wheelT = setTimeout(() => (gestureDone = false), 300);
	}
	function onTouchStart(e) {
		if (!enabled) return;
		touching = true;
		const t = e.touches[0];
		tsx = t.clientX;
		tsy = t.clientY;
		gestureDone = false;
	}
	function onTouchMove(e) {
		if (!enabled || !engaged) return;
		const t = e.touches[0];
		const fy = tsy - t.clientY; // >0 => scrolling down (forward)
		const fx = tsx - t.clientX; // >0 => scrolling right (forward)
		const s = Math.abs(fy) >= Math.abs(fx) ? fy : fx;
		if (Math.abs(s) < 14) return; // needs a little intent
		tryStep(Math.sign(s));
	}
	function onTouchEnd() {
		touching = false;
		gestureDone = false;
		if (pending) {
			// finger lifted at the pin point -> now do the actual snap + lock
			const p = pending;
			pending = null;
			engage(p);
		}
	}

	onMount(() => {
		measure();
		const onResize = () => measure();
		window.addEventListener('resize', onResize);
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('wheel', onWheel, { passive: false });
		window.addEventListener('touchstart', onTouchStart, { passive: true });
		window.addEventListener('touchmove', onTouchMove, { passive: true });
		window.addEventListener('touchend', onTouchEnd, { passive: true });
		window.addEventListener('touchcancel', onTouchEnd, { passive: true });
		return () => {
			clearTimeout(idleT);
			clearTimeout(wheelT);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
			window.removeEventListener('touchcancel', onTouchEnd);
		};
	});
</script>

{#snippet cardBody(item, i)}
	<div class="svc-icon grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent transition-transform group-hover:scale-110">
		<ServiceIcon name={icons[i]} size={24} />
	</div>
	<h3 class="mt-5 text-xl font-semibold">{item.title}</h3>
	<ul class="mt-4 space-y-2.5">
		{#each item.points as point}
			<li class="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
				<span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"></span>
				{point}
			</li>
		{/each}
	</ul>
{/snippet}

<section
	bind:this={sectionEl}
	id="services"
	style={enabled ? `touch-action:${engaged ? 'none' : 'auto'}` : ''}
	class="relative scroll-mt-24 py-24 max-md:py-0"
>
	<div class="mx-auto mb-14 max-w-2xl px-6 text-center max-md:mb-0 max-md:pb-2 max-md:pt-24" use:reveal>
		<h2 class="select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.services.title}</h2>
		<p class="mt-4 text-lg text-slate-400">{i18n.t.services.subtitle}</p>
	</div>

	{#if enabled}
		<!-- mobile: full-height carousel block below the header. Pinning centers
		     this block, so the header ends up off-screen above while stepping. -->
		<div bind:this={pinEl} class="flex h-svh flex-col justify-center pb-2 pt-14">
			<div class="overflow-hidden">
				<div
					class="flex items-stretch transition-transform duration-500 ease-out will-change-transform"
					style="transform: translateX(-{index * 100}%)"
				>
					{#each i18n.t.services.items as item, i}
						<div class="w-full shrink-0 px-4">
							<div
								class="group spotlight beam svc-card flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 transition-[border-color,box-shadow] duration-300 *:relative *:z-10"
								class:is-active={engaged && settled === i}
								use:spotlight
							>
								{@render cardBody(item, i)}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="mx-auto grid max-w-6xl gap-5 px-6 lg:grid-cols-3">
			{#each i18n.t.services.items as item, i}
				<div
					class="group spotlight beam svc-card flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10"
					use:reveal={{ delay: i * 80 }}
					use:spotlight
				>
					{@render cardBody(item, i)}
				</div>
			{/each}
		</div>
	{/if}
</section>
