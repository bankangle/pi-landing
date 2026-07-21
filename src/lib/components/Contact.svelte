<script>
	import { useI18n } from '$lib/i18n-context.js';
	import { EMAIL } from '$lib/i18n.js';
	import { reveal } from '$lib/reveal.js';
	import Ambient from './Ambient.svelte';
	const i18n = useI18n();
</script>

<section id="contact" class="relative flex min-h-svh scroll-mt-24 flex-col justify-center overflow-hidden py-24">
	<div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
	<Ambient />

	<div class="relative mx-auto w-full max-w-2xl px-6 text-center" use:reveal>
		<h2 class="select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.contact.title}</h2>
		<a
			href="mailto:{EMAIL}"
			class="mt-8 inline-block rounded-full bg-accent px-8 py-4 text-xl font-semibold text-white transition-transform hover:scale-[1.03]"
		>
			{EMAIL}
		</a>
	</div>
</section>
