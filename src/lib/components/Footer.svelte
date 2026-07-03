<script>
	import { useI18n } from '$lib/i18n-context.js';
	import Logo from './Logo.svelte';
	const i18n = useI18n();
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-white/10">
	<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
		<a href="#top" class="flex items-center gap-2 font-semibold">
			<Logo size={26} class="text-white" />
		</a>
		<p class="text-sm text-slate-500">© {year} pi-retail. {i18n.t.footer.rights}</p>
	</div>
</footer>
