import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'food' | 'art'
  const db = await getDb();
  const query = type ? { type } : {};
  const docs = await db.collection('section_defs').find(query).sort({ order: 1 }).toArray();
  return NextResponse.json(docs.map(d => ({ ...d, _id: d._id.toString() })));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, label, labelAr = '' } = await request.json();
  if (!type || !label) return NextResponse.json({ error: 'type and label required' }, { status: 400 });

  const key = `${type}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
  const db  = await getDb();

  const count = await db.collection('section_defs').countDocuments({ type });

  await db.collection('section_defs').insertOne({
    type, key, label, labelAr, order: count + 10,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, key });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { key, label, labelAr } = await request.json();
  if (!key || !label) return NextResponse.json({ error: 'key and label required' }, { status: 400 });

  const db = await getDb();
  await db.collection('section_defs').updateOne(
    { key },
    { $set: { label, labelAr: labelAr ?? '', updatedAt: new Date().toISOString() } },
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { key } = await request.json();
  const db = await getDb();
  await db.collection('section_defs').deleteOne({ key });
  return NextResponse.json({ ok: true });
}
