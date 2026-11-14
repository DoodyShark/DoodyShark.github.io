import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createHash, timingSafeEqual } from 'crypto';
import { clientKey, retryAfterSeconds, recordFailure, clearFailures } from '@/lib/login-limit';

function safeCompare(a: string, b: string): boolean {
  const aBuf = createHash('sha256').update(a).digest();
  const bBuf = createHash('sha256').update(b).digest();
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
  const key = clientKey(req);

  const wait = await retryAfterSeconds(key);
  if (wait > 0) {
    const minutes = Math.ceil(wait / 60);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` },
      { status: 429, headers: { 'Retry-After': String(wait) } },
    );
  }

  const { password } = await req.json().catch(() => ({ password: '' }));
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  if (!adminPassword || typeof password !== 'string' || !safeCompare(password, adminPassword)) {
    await recordFailure(key);
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  await clearFailures(key);
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  return NextResponse.json({ ok: true });
}
