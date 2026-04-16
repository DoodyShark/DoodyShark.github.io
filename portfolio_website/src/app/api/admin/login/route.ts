import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createHash, timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  const aBuf = createHash('sha256').update(a).digest();
  const bBuf = createHash('sha256').update(b).digest();
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';

  if (!adminPassword || !safeCompare(password, adminPassword)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  return NextResponse.json({ ok: true });
}
