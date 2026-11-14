import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { parseObjectId, notFound } from '@/lib/objectid';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const _id = parseObjectId((await params).id);
  if (!_id) return notFound();
  const db = await getDb();
  const doc = await db.collection('cards').findOne({ _id });
  if (!doc) return notFound();
  return NextResponse.json({ ...doc, _id: doc._id.toString() });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const _id = parseObjectId((await params).id);
  if (!_id) return notFound();
  // Strip _id from body — MongoDB forbids updating the immutable _id field
  const body = await req.json();
  delete body._id;
  const db = await getDb();
  const res = await db.collection('cards').updateOne({ _id }, { $set: { ...body, updatedAt: new Date() } });
  if (!res.matchedCount) return notFound();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const _id = parseObjectId((await params).id);
  if (!_id) return notFound();
  const db = await getDb();
  const res = await db.collection('cards').deleteOne({ _id });
  if (!res.deletedCount) return notFound();
  return NextResponse.json({ ok: true });
}
