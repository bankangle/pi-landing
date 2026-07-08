<script>
	// The "pi" mark, redrawn as vectors faithful to the original raster logo:
	// solid p with a slate foundation tick under the descender; the i wears a
	// blue growth-wedge (roof rising right) over its own slate tick.
	let { size = 28, class: klass = '' } = $props();
</script>

<svg
	viewBox="0 0 120 130"
	width={size}
	height={size * (130 / 120)}
	class={klass}
	aria-hidden="true"
	fill="none"
>
	<!-- p: stem with descender + bowl fused to it -->
	<rect x="10" y="29" width="18" height="82" rx="2" fill="currentColor" />
	<circle cx="45" cy="64" r="26" stroke="currentColor" stroke-width="18" />
	<rect x="10" y="114" width="18" height="7" rx="1.5" class="fill-slate-500" />
	<!-- i: growth wedge, slate tick, bar down to the x-height baseline -->
	<polygon points="96,24 96,19 114,8 114,24" class="fill-accent" />
	<rect x="96" y="27" width="18" height="7" rx="1.5" class="fill-slate-500" />
	<rect x="96" y="38" width="18" height="61" rx="2" fill="currentColor" />
</svg>
