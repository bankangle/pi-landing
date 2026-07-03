<script>
	// "pi" mark from the original pi-retail logo, redrawn minimal & geometric:
	// bold letters in currentColor, the i's dot is an accent growth-wedge,
	// slate base ticks under both stems (measurement / bar-chart hint).
	let { size = 28, class: klass = '' } = $props();
</script>

<svg
	viewBox="0 0 118 124"
	width={size}
	height={size}
	class={klass}
	aria-hidden="true"
	fill="none"
>
	<!-- p: stem (with descender) + bowl -->
	<rect x="12" y="34" width="18" height="74" rx="1.5" fill="currentColor" />
	<circle cx="48" cy="61" r="18" stroke="currentColor" stroke-width="18" />
	<rect x="12" y="112" width="18" height="6" rx="1.5" class="fill-slate-500" />
	<!-- i: stem -->
	<rect x="88" y="34" width="18" height="52" rx="1.5" fill="currentColor" />
	<rect x="88" y="90" width="18" height="6" rx="1.5" class="fill-slate-500" />
	<!-- growth wedge = the i's dot -->
	<polygon points="88,26 106,8 106,26" class="fill-accent" />
</svg>
