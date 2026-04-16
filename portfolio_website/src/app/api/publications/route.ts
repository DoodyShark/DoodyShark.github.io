import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/session';

export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection('publications')
    .find({})
    .sort({ year: -1 })
    .toArray();
  return NextResponse.json(
    docs.map(({ _id, ...rest }) => ({ ...rest, _id: _id.toString() }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const db = await getDb();
  const now = new Date();
  const result = await db.collection('publications').insertOne({ ...body, createdAt: now, updatedAt: now });
  return NextResponse.json({ _id: result.insertedId.toString() }, { status: 201 });
}
