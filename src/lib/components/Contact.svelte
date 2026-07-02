<script>
	import { enhance } from '$app/forms';
	import { useI18n } from '$lib/i18n-context.js';
	import { EMAIL } from '$lib/i18n.js';
	import { reveal } from '$lib/reveal.js';
	import Ambient from './Ambient.svelte';
	import Icon from './Icon.svelte';
	const i18n = useI18n();

	/** @type {'idle' | 'sending' | 'success' | 'error'} */
	let status = $state('idle');

	const submit = () => {
		status = 'sending';
		return async ({ result, update }) => {
			if (result.type === 'success') {
				status = 'success';
				await update({ reset: true });
			} else if (result.type === 'failure') {
				status = 'error';
			} else {
				await update();
				status = 'idle';
			}
		};
	};
</script>

<section id="contact" class="relative scroll-mt-24 overflow-hidden py-24">
	<div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
	<Ambient />

	<div class="relative mx-auto max-w-2xl px-6">
		<div class="text-center" use:reveal>
			<span class="text-sm font-semibold uppercase tracking-wider text-accent">{i18n.t.contact.eyebrow}</span>
			<h2 class="mt-3 select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.contact.title}</h2>
			<p class="mt-4 text-lg text-slate-400">{i18n.t.contact.subtitle}</p>
			<p class="mt-3 text-sm text-slate-400">
				{i18n.t.contact.orEmail}
				<a href="mailto:{EMAIL}" class="font-medium text-accent underline-offset-4 hover:underline">{EMAIL}</a>
			</p>
		</div>

		{#if status === 'success'}
			<div class="mt-10 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-emerald-200" use:reveal>
				<Icon name="check" size={24} />
				<p>{i18n.t.contact.success}</p>
			</div>
		{:else}
			<form
				method="POST"
				use:enhance={submit}
				class="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
				use:reveal
			>
				<div class="grid gap-4 sm:grid-cols-2">
					<label class="grid gap-1.5 text-sm">
						<span class="text-slate-300">{i18n.t.contact.name} *</span>
						<input
							name="name"
							required
							placeholder={i18n.t.contact.namePh}
							class="rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-accent"
						/>
					</label>
					<label class="grid gap-1.5 text-sm">
						<span class="text-slate-300">{i18n.t.contact.email} *</span>
						<input
							name="contact"
							required
							placeholder={i18n.t.contact.emailPh}
							class="rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-accent"
						/>
					</label>
				</div>
				<label class="grid gap-1.5 text-sm">
					<span class="text-slate-300">{i18n.t.contact.message}</span>
					<textarea
						name="message"
						rows="4"
						placeholder={i18n.t.contact.messagePh}
						class="resize-y rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-accent"
					></textarea>
				</label>

				<!-- Honeypot: bots fill this, humans never see it. -->
				<input type="text" name="company_website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

				{#if status === 'error'}
					<p class="text-sm text-rose-300">{i18n.t.contact.error}</p>
				{/if}

				<button
					type="submit"
					disabled={status === 'sending'}
					class="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
				>
					{status === 'sending' ? i18n.t.contact.sending : i18n.t.contact.submit}
					{#if status !== 'sending'}<Icon name="arrow" size={18} />{/if}
				</button>
			</form>
		{/if}
	</div>
</section>
