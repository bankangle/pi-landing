import { fail } from '@sveltejs/kit';
import { notify } from '$lib/server/notify.js';
import { normalizeLang } from '$lib/i18n.js';

export const actions = {
	/** @type {import('./$types').Actions['default']} */
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const name = String(form.get('name') ?? '').trim();
		const contact = String(form.get('contact') ?? '').trim();
		const message = String(form.get('message') ?? '').trim();
		const honeypot = String(form.get('company_website') ?? '').trim();

		// Spam trap: pretend success without notifying anyone.
		if (honeypot) return { success: true };

		if (!name || !contact) {
			return fail(400, { error: 'required', name, contact, message });
		}
		if (name.length > 200 || contact.length > 200 || message.length > 4000) {
			return fail(400, { error: 'too_long' });
		}

		const delivered = await notify({ name, contact, message, lang: normalizeLang(locals.lang) });
		if (!delivered) {
			// Either no channel configured, or every channel errored.
			return fail(502, { error: 'send_failed', name, contact, message });
		}

		return { success: true };
	}
};
