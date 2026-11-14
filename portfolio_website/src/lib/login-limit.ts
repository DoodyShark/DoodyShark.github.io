import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';
import { getDb } from './mongodb';

// Admin login throttle: at most MAX_FAILURES failed attempts per IP per WINDOW.
// Stored in MongoDB (serverless instances don't share memory); a TTL index
// expires old attempts automatically. IPs are stored hashed, not raw.
export const MAX_FAILURES = 10;
const WINDOW_MS = 60 * 60 * 1000;

let indexReady: Promise<unknown> | undefined;

async function attempts() {
  const col = (await getDb()).collection<{ ipHash: string; at: Date }>('login_attempts');
  indexReady ??= col.createIndex({ at: 1 }, { expireAfterSeconds: WINDOW_MS / 1000 }).catch(() => { indexReady = undefined; });
  await indexReady;
  return col;
}

export function clientKey(req: NextRequest): string {
  // On Vercel the first x-forwarded-for entry is the real client IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          || req.headers.get('x-real-ip')
          || 'unknown';
  return createHash('sha256').update(`login:${ip}`).digest('hex');
}

/** Returns seconds until the client may retry, or 0 if they're allowed to try now. */
export async function retryAfterSeconds(ipHash: string): Promise<number> {
  const col = await attempts();
  const since = new Date(Date.now() - WINDOW_MS);
  const recent = await col.find({ ipHash, at: { $gt: since } }).sort({ at: 1 }).limit(MAX_FAILURES).toArray();
  if (recent.length < MAX_FAILURES) return 0;
  return Math.max(1, Math.ceil((recent[0].at.getTime() + WINDOW_MS - Date.now()) / 1000));
}

export async function recordFailure(ipHash: string) {
  await (await attempts()).insertOne({ ipHash, at: new Date() });
}

export async function clearFailures(ipHash: string) {
  await (await attempts()).deleteMany({ ipHash });
}
