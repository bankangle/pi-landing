<script>
	// Minimal hand-drawn icon set (Lucide-style strokes), no dependency.
	let { name, size = 24, class: klass = '' } = $props();

	const paths = {
		chart: 'M3 3v18h18 M7 14l3-3 3 3 4-5',
		bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
		plug: 'M9 2v6 M15 2v6 M6 8h12v3a6 6 0 0 1-12 0V8z M12 20v2',
		search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-3.5-3.5',
		spark: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M5.6 5.6l2.8 2.8 M15.6 15.6l2.8 2.8 M18.4 5.6l-2.8 2.8 M8.4 15.6l-2.8 2.8',
		check: 'M20 6 9 17l-5-5',
		arrow: 'M5 12h14 M13 6l6 6-6 6',
		globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z'
	};
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={klass}
	aria-hidden="true"
>
	{#each (paths[name] ?? '').split(' M').map((d, i) => (i ? 'M' + d : d)) as d}
		<path {d} />
	{/each}
</svg>
