import { fail } from '@sveltejs/kit';
import { saveLead } from '$lib/server/store.js';
import { enqueueLead } from '$lib/server/notify.js';
import { issueToken, checkToken, allowIp, isDuplicate } from '$lib/server/antispam.js';
import { normalizeLang } from '$lib/i18n.js';

/** @type {import('./$types').PageServerLoad} */
export function load() {
	// anti-spam time-trap: the form carries a signed issue timestamp
	return { formToken: issueToken() };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Accepts an email, or a phone with 10–15 digits (+, spaces, dashes, parens ok). */
function isValidContact(raw) {
	const v = String(raw).trim();
	if (EMAIL_RE.test(v)) return true;
	const digits = v.replace(/[\s\-().]/g, '');
	return /^\+?\d{10,15}$/.test(digits);
}

export const actions = {
	/** @type {import('./$types').Actions['default']} */
	default: async ({ request, locals, getClientAddress }) => {
		const form = await request.formData();

		const name = String(form.get('name') ?? '').trim();
		const contact = String(form.get('contact') ?? '').trim();
		const honeypot = String(form.get('company_website') ?? '').trim();
		const token = String(form.get('form_token') ?? '');

		// -------- spam gates: bots get a fake "success", humans get real errors ----
		if (honeypot) return { success: true };

		const tokenState = checkToken(token);
		if (tokenState === 'too_fast' || tokenState === 'bad') return { success: true };
		// 'expired' falls through: a human with a day-old tab deserves a clean retry
		if (tokenState === 'expired') {
			return fail(400, { error: 'expired', name, contact });
		}

		// -------- validation FIRST: a typo fixed 5s later must not eat into the
		// rate limit --------
		if (!name || !contact) return fail(400, { error: 'required', name, contact });
		if (name.length > 200 || contact.length > 200) return fail(400, { error: 'too_long' });
		if (!isValidContact(contact)) return fail(400, { error: 'bad_contact', name, contact });

		let ip = 'unknown';
		try {
			ip = getClientAddress();
		} catch {}
		if (!allowIp(ip)) return fail(429, { error: 'rate_limited', name, contact });

		if (isDuplicate(contact, name)) return { success: true }; // already have it

		// -------- persist first (the only hard failure point), then notify ----
		let lead;
		try {
			lead = await saveLead({ name, contact, message: '', lang: normalizeLang(locals.lang), ip });
		} catch (e) {
			console.error('[form] PERSIST FAILED', e);
			return fail(500, { error: 'send_failed', name, contact });
		}

		enqueueLead(lead); // durable queue: retries until every configured channel accepts

		return { success: true };
	}
};
