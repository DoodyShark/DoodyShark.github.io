import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page   = searchParams.get('page');
  const locale = searchParams.get('locale') || 'en';

  if (!page) return NextResponse.json({ error: 'page required' }, { status: 400 });

  const db  = await getDb();
  const doc = await db.collection('page_content').findOne({ page, locale });
  return NextResponse.json(doc ? { ...doc, _id: doc._id.toString() } : null);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { page, locale, body } = await request.json();
  if (!page || !locale) return NextResponse.json({ error: 'page and locale required' }, { status: 400 });

  const db  = await getDb();
  const now = new Date().toISOString();
  await db.collection('page_content').updateOne(
    { page, locale },
    { $set: { page, locale, body, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );
  return NextResponse.json({ ok: true });
}
