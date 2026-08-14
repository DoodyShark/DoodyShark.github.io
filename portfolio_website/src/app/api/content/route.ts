import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const collection = searchParams.get('collection');
  const locale = searchParams.get('locale') || 'en';
  const slug = searchParams.get('slug');
  const includeBody = searchParams.get('body') === 'true';

  const db = await getDb();
  // If no collection but slug is given, search by slug+locale across all collections
  const query: Record<string, string> = { locale };
  if (collection) query.collection = collection;
  if (slug) query.slug = slug;

  if (!collection && !slug) {
    return NextResponse.json({ error: 'collection or slug is required' }, { status: 400 });
  }

  const projection = includeBody ? {} : { body: 0 };
  const docs = await db
    .collection('cards')
    .find(query, { projection })
    .sort({ order: 1 })
    .toArray();

  return NextResponse.json(
    docs.map(({ _id, ...rest }) => ({ ...rest, _id: _id.toString() }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const db = await getDb();
  const now = new Date();
  const result = await db.collection('cards').insertOne({ ...body, createdAt: now, updatedAt: now });
  return NextResponse.json({ _id: result.insertedId.toString() }, { status: 201 });
}
