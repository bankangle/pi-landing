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
 * @param {string} id @param {Record<string, boolean>} channels
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
