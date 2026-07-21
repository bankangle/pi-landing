<script>
	// Shared animated background so hero + contact look uniform.
	// - blobs drift/pulse on randomized (desynced) timings
	// - the whole blob layer eases toward the cursor with inertia (parallax)
	// - a dither overlay removes gradient banding
	// - grid/mesh is opt-in (hero only)
	import { desync } from '$lib/anim.js';
	import { parallax } from '$lib/parallax.js';

	let { grid = false } = $props();
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden">
	{#if grid}
		<div class="anim-grid ambient-grid absolute inset-0 bg-grid opacity-60" use:desync={{ base: 40 }}></div>
	{/if}

	<div class="absolute inset-0" use:parallax>
		<div
			class="anim-blob-a absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
			use:desync={{ base: 16 }}
		></div>
		<div
			class="anim-blob-b absolute -right-32 top-40 h-[360px] w-[360px] rounded-full bg-indigo-500/20 blur-[120px]"
			use:desync={{ base: 22 }}
		></div>
		<div
			class="anim-blob-c absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full bg-sky-400/15 blur-[130px]"
			use:desync={{ base: 19 }}
		></div>
	</div>

	<!-- dither overlay: normal-blend gray grain (overlay/soft-light are invisible on
	     dark bg). This is what actually removes the 8-bit gradient banding. -->
	<div class="absolute inset-0 bg-noise opacity-[0.09]"></div>
</div>
