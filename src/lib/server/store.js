// Persist-first lead storage: every submission is appended to a JSONL file
// BEFORE any notification attempt, so a lead can never be lost to a channel
// outage. No database, no dependency — just an append-only file on a volume.
//
// LEADS_FILE env sets the path (default ./data/leads.jsonl). In Docker, mount
// a volume over its directory so leads survive container rebuilds.
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';

const file = () => resolve(env.LEADS_FILE || './data/leads.jsonl');

let dirReady = false;
async function ensureDir() {
	if (dirReady) return;
	await mkdir(dirname(file()), { recursive: true });
	dirReady = true;
}

/**
 * Append a lead. Returns the stored record (with id) or throws — the caller
 * treats a failed write as a hard error, because persistence is the guarantee.
 * @param {{ name: string, contact: string, message: string, lang: string, ip: string }} data
 */
export async function saveLead(data) {
	await ensureDir();
	const record = { id: randomUUID(), at: new Date().toISOString(), ...data };
	await appendFile(file(), JSON.stringify(record) + '\n', 'utf8');
	return record;
}

/**
 * Append a delivery-status line for a lead (audit trail: which channels
 * accepted it, and when). Best-effort — never throws.
 * @param {string} id @param {Record<string, boolean|null|number>} channels
 */
export async function markDelivery(id, channels) {
	try {
		await ensureDir();
		const line = { deliveryFor: id, at: new Date().toISOString(), channels };
		await appendFile(file(), JSON.stringify(line) + '\n', 'utf8');
	} catch (e) {
		console.error('[store] delivery mark failed', e);
	}
}

/**
 * Re-read the ledger: all leads + the union of channels that ever succeeded
 * for each. Used on boot to re-queue anything still undelivered, so pending
 * notifications survive restarts. Never throws (missing file = empty ledger).
 * @returns {Promise<{ leads: Map<string, any>, delivered: Map<string, Set<string>> }>}
 */
export async function readLedger() {
	const leads = new Map();
	const delivered = new Map();
	try {
		const { readFile } = await import('node:fs/promises');
		const text = await readFile(file(), 'utf8');
		for (const line of text.split('\n')) {
			if (!line.trim()) continue;
			let obj;
			try {
				obj = JSON.parse(line);
			} catch {
				continue;
			}
			if (obj.id) leads.set(obj.id, obj);
			else if (obj.deliveryFor) {
				const set = delivered.get(obj.deliveryFor) ?? new Set();
				for (const [k, v] of Object.entries(obj.channels ?? {})) if (v === true) set.add(k);
				delivered.set(obj.deliveryFor, set);
			}
		}
	} catch {}
	return { leads, delivered };
}
