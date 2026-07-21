<script>
	import { enhance } from '$app/forms';
	import { useI18n } from '$lib/i18n-context.js';
	import { EMAIL } from '$lib/i18n.js';
	import { reveal } from '$lib/reveal.js';
	import Ambient from './Ambient.svelte';
	import Icon from './Icon.svelte';
	const i18n = useI18n();

	let { token = '' } = $props();

	/** @type {'idle' | 'sending' | 'success' | 'error'} */
	let status = $state('idle');
	let errorCode = $state('');
	let contactValue = $state('');

	// mirror of the server-side check, for instant feedback
	const validContact = (v) => {
		const s = v.trim();
		if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return true;
		return /^\+?\d{10,15}$/.test(s.replace(/[\s\-().]/g, ''));
	};

	const submit = ({ cancel }) => {
		if (!validContact(contactValue)) {
			status = 'error';
			errorCode = 'bad_contact';
			cancel();
			return;
		}
		status = 'sending';
		return async ({ result, update }) => {
			if (result.type === 'success') {
				status = 'success';
				await update({ reset: true });
			} else if (result.type === 'failure') {
				status = 'error';
				errorCode = result.data?.error ?? '';
			} else {
				await update();
				status = 'idle';
			}
		};
	};

	const errorText = () => {
		if (errorCode === 'bad_contact') return i18n.t.contact.badContact;
		if (errorCode === 'expired') return i18n.t.contact.errorExpired;
		if (errorCode === 'rate_limited') return i18n.t.contact.errorRate;
		if (errorCode === 'required') return i18n.t.contact.required;
		return i18n.t.contact.error;
	};
</script>

<section id="contact" class="relative scroll-mt-24 overflow-hidden py-24">
	<div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
	<Ambient />

	<div class="relative mx-auto max-w-2xl px-6 text-center">
		<div use:reveal>
			<h2 class="select-none text-3xl font-bold tracking-tight sm:text-4xl">{i18n.t.contact.title}</h2>
			<p class="mt-4 text-sm text-slate-400">
				{i18n.t.contact.orEmail}
				<a href="mailto:{EMAIL}" class="font-medium text-white underline-offset-4 hover:underline">{EMAIL}</a>
			</p>
			<p class="mt-6 text-lg text-slate-400">{i18n.t.contact.orLeave}</p>
		</div>

		{#if status === 'success'}
			<div class="mx-auto mt-10 flex w-fit items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-8 py-6 text-emerald-200" use:reveal>
				<Icon name="check" size={22} />
				<p>{i18n.t.contact.success}</p>
			</div>
		{:else}
			<form method="POST" use:enhance={submit} class="reveal-rise mx-auto mt-10 max-w-md" use:reveal>
				<div class="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
					<input
						name="name"
						required
						placeholder={i18n.t.contact.namePh}
						aria-label={i18n.t.contact.name}
						class="w-full rounded-xl border border-white/10 bg-ink-soft px-5 py-3.5 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-accent"
					/>
					<input
						name="contact"
						required
						bind:value={contactValue}
						placeholder={i18n.t.contact.emailPh}
						aria-label={i18n.t.contact.email}
						class="w-full rounded-xl border border-white/10 bg-ink-soft px-5 py-3.5 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-accent"
					/>
					<button
						type="submit"
						disabled={status === 'sending'}
						class="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{status === 'sending' ? i18n.t.contact.sending : i18n.t.contact.submit}
						{#if status !== 'sending'}<Icon name="arrow" size={18} />{/if}
					</button>

					{#if status === 'error'}
						<p class="text-sm text-rose-300">{errorText()}</p>
					{/if}
				</div>

				<!-- Honeypot: bots fill this, humans never see it. -->
				<input type="text" name="company_website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
				<!-- Time-trap token: proves the form was rendered by us, >=3s ago. -->
				<input type="hidden" name="form_token" value={token} />
			</form>
		{/if}
	</div>
</section>
