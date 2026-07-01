<script>
	import { useI18n } from '$lib/i18n-context.js';
	const i18n = useI18n();
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-white/10">
	<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
		<a href="#top" class="flex items-center gap-2 font-semibold">
			<span class="grid h-7 w-7 place-items-center rounded-lg bg-accent text-ink font-bold">π</span>
			PI<span class="text-accent">Retail</span>
		</a>
		<p class="text-sm text-slate-400">{i18n.t.footer.tagline}</p>
		<p class="text-sm text-slate-500">© {year} PI Retail. {i18n.t.footer.rights}</p>
	</div>
</footer>
