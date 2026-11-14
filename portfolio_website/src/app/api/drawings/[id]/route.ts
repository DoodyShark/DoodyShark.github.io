import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { parseObjectId, notFound } from '@/lib/objectid';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const _id = parseObjectId((await params).id);
  if (!_id) return notFound();
  const db = await getDb();
  const res = await db.collection('drawings').deleteOne({ _id });
  if (!res.deletedCount) return notFound();
  return NextResponse.json({ ok: true });
}
