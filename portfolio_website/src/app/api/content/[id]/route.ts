import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { ObjectId } from 'mongodb';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const doc = await db.collection('cards').findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { _id, ...rest } = doc;
  return NextResponse.json({ ...rest, _id: _id.toString() });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();
  await db
    .collection('cards')
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...body, updatedAt: new Date() } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.collection('cards').deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
