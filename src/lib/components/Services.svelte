<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { reveal } from '$lib/reveal.js';
	import { spotlight } from '$lib/spotlight.js';
	import ServiceIcon from './ServiceIcon.svelte';
	const i18n = useI18n();

	const icons = ['chart', 'bolt', 'plug'];

	// Mobile has no hover: light the card up (icon animation + border beam)
	// once it's fully visible in the viewport, dim it when it leaves.
	function activateOnView(node) {
		if (!window.matchMedia('(max-width: 767px)').matches) return {};
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					node.classList.toggle('is-active', e.intersectionRatio >= 0.9);
				}
			},
			{ threshold: [0, 0.9, 1] }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<section id="services" class="relative scroll-mt-24 py-24">
	<div class="mx-auto mb-14 max-w-2xl px-6 text-center" use:reveal>
		<h2 class="select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.services.title}</h2>
		<p class="mt-4 text-lg text-slate-400">{i18n.t.services.subtitle}</p>
	</div>

	<div class="mx-auto grid max-w-6xl gap-5 px-6 lg:grid-cols-3">
		{#each i18n.t.services.items as item, i}
			<div
				class="group spotlight beam svc-card flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/15 *:relative *:z-10"
				use:reveal={{ delay: i * 80 }}
				use:spotlight
				use:activateOnView
			>
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
			</div>
		{/each}
	</div>
</section>
