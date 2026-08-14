/**
 * One-time backfill: generates a tiny base64 blur placeholder (`imageBlur`) for every
 * existing card/publication that has an `image` but no `imageBlur` yet, so old content
 * gets the same low-res-loads-first behavior as newly uploaded images.
 *
 * Run once:
 *   npx tsx scripts/backfill-image-blur.ts
 *
 * Requires MONGODB_URI in .env.local
 */

import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import sharp from 'sharp';

config({ path: join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI!;
if (!uri) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}

const PUBLIC = join(__dirname, '../public');

// Cache by image URL/path so cards that share an image (e.g. EN/AR pairs) only fetch once.
const cache = new Map<string, string | undefined>();

async function getImageBytes(image: string): Promise<Buffer | undefined> {
  if (/^https?:\/\//.test(image)) {
    const res = await fetch(image);
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const localPath = join(PUBLIC, image.replace(/^\//, ''));
  if (!existsSync(localPath)) throw new Error(`local file not found: ${localPath}`);
  return readFileSync(localPath);
}

async function makeBlurDataURL(image: string): Promise<string | undefined> {
  if (cache.has(image)) return cache.get(image);
  let result: string | undefined;
  try {
    const bytes = await getImageBytes(image);
    if (!bytes) throw new Error('no bytes');
    const thumb = await sharp(bytes).resize(24, 24, { fit: 'inside' }).jpeg({ quality: 40 }).toBuffer();
    result = `data:image/jpeg;base64,${thumb.toString('base64')}`;
  } catch (err) {
    console.warn(`  skip "${image}": ${err instanceof Error ? err.message : err}`);
    result = undefined;
  }
  cache.set(image, result);
  return result;
}

async function backfillCollection(db: import('mongodb').Db, name: string) {
  const coll = db.collection(name);
  const docs = await coll
    .find({ image: { $exists: true, $ne: '' }, $or: [{ imageBlur: { $exists: false } }, { imageBlur: '' }] })
    .toArray();

  console.log(`\n${name}: ${docs.length} document(s) missing imageBlur`);
  let updated = 0;
  let skipped = 0;
  for (const doc of docs) {
    const blurDataURL = await makeBlurDataURL(doc.image);
    if (!blurDataURL) { skipped++; continue; }
    await coll.updateOne({ _id: doc._id }, { $set: { imageBlur: blurDataURL, updatedAt: new Date() } });
    updated++;
    process.stdout.write(`  [${updated + skipped}/${docs.length}]\r`);
  }
  console.log(`${name}: updated ${updated}, skipped ${skipped}`);
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('portfolio');

  console.log('Connected to MongoDB. Backfilling image blur placeholders…');
  await backfillCollection(db, 'cards');
  await backfillCollection(db, 'publications');

  await client.close();
  console.log('\nBackfill complete!');
}

main().catch((err) => { console.error(err); process.exit(1); });
