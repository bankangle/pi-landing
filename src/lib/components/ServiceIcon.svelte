<script>
	// Purpose-built animated icons for the Services cards. Each reacts to the
	// ancestor .group:hover (see the .svc-* rules in app.css):
	//  - chart: line redraws upward and turns green
	//  - bolt:  strikes with a flash + glow, turns yellow
	//  - plug:  two halves slide together and a spark fires
	let { name, size = 24 } = $props();
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
	class="svc svc-{name}"
	aria-hidden="true"
>
	{#if name === 'chart'}
		<path class="svc-axis" d="M4 4v16h16" />
		<polyline class="svc-line" points="6.5 15 10 11.5 13.5 13.5 19 7" />
		<path class="svc-arrow" d="M15.5 7H19v3.5" />
	{:else if name === 'bolt'}
		<path class="svc-bolt" d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
	{:else if name === 'plug'}
		<g class="svc-plug-left">
			<path d="M2 12h3" />
			<rect x="5" y="8.5" width="4" height="7" rx="1.2" />
			<path d="M9 10.5h3M9 13.5h3" />
		</g>
		<g class="svc-plug-right">
			<path d="M12 10.5h3M12 13.5h3" />
			<rect x="15" y="7.5" width="5" height="9" rx="1.6" />
		</g>
		<g class="svc-spark">
			<path d="M12 6.5v-2M12 19.5v-2M6 12H4M20 12h-2" />
		</g>
	{/if}
</svg>
