import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const db = await getDb();
  const drawings = await db.collection('drawings').find({}).sort({ createdAt: -1 }).limit(100).toArray();
  return NextResponse.json(drawings.map(d => ({ ...d, _id: d._id.toString() })));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { strokes } = body;

  if (!Array.isArray(strokes) || strokes.length === 0) {
    return NextResponse.json({ error: 'No strokes provided' }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection('drawings').insertOne({
    strokes,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ id: result.insertedId.toString() });
}
