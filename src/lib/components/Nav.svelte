<script>
	import { useI18n } from '$lib/i18n-context.js';
	const i18n = useI18n();

	let scrolled = $state(false);
	let open = $state(false);

	function onScroll() {
		scrolled = window.scrollY > 12;
	}

	const links = [
		{ href: '#about', key: 'about' },
		{ href: '#services', key: 'services' },
		{ href: '#projects', key: 'projects' },
		{ href: '#contact', key: 'contact' }
	];
</script>

<svelte:window on:scroll={onScroll} />

<header
	class="fixed inset-x-0 top-0 z-50 transition-all duration-300
		{scrolled ? 'border-b border-white/10 bg-ink/80 backdrop-blur-md' : 'border-b border-transparent'}"
>
	<nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href="#top" class="flex items-center gap-2 font-semibold tracking-tight">
			<span class="grid h-8 w-8 place-items-center rounded-lg bg-accent text-ink font-bold">π</span>
			<span class="text-lg">PI<span class="text-accent"> Retail</span></span>
		</a>

		<div class="hidden items-center gap-8 md:flex">
			{#each links as l}
				<a href={l.href} class="text-sm text-slate-300 transition-colors hover:text-white">
					{i18n.t.nav[l.key]}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-3">
			<button
				onclick={() => i18n.toggle()}
				class="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-accent hover:text-accent"
				aria-label="Switch language"
			>
				{i18n.lang === 'ru' ? 'EN' : 'RU'}
			</button>
			<a
				href="#contact"
				class="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink transition-transform hover:scale-[1.03] sm:inline-block"
			>
				{i18n.t.nav.cta}
			</a>
			<button
				class="md:hidden text-slate-200"
				onclick={() => (open = !open)}
				aria-label="Toggle menu"
				aria-expanded={open}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
					{#if open}
						<path d="M6 6l12 12 M18 6 6 18" />
					{:else}
						<path d="M4 7h16 M4 12h16 M4 17h16" />
					{/if}
				</svg>
			</button>
		</div>
	</nav>

	{#if open}
		<div class="border-t border-white/10 bg-ink/95 px-6 py-4 md:hidden">
			<div class="flex flex-col gap-4">
				{#each links as l}
					<a href={l.href} onclick={() => (open = false)} class="text-slate-200 hover:text-accent">
						{i18n.t.nav[l.key]}
					</a>
				{/each}
				<a href="#contact" onclick={() => (open = false)} class="rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-ink">
					{i18n.t.nav.cta}
				</a>
			</div>
		</div>
	{/if}
</header>
