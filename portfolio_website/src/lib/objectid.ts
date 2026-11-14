import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Parses a route id into an ObjectId, or null if it's malformed.
// `new ObjectId('garbage')` throws, which would otherwise surface as a 500.
export function parseObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) && /^[0-9a-f]{24}$/i.test(id) ? new ObjectId(id) : null;
}

export const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });
