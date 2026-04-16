/**
 * One-time seed script: imports existing static JSON + Markdown files into MongoDB.
 * Run once before deploying:
 *   npx tsx scripts/seed.ts
 *
 * Requires MONGODB_URI in .env.local
 */

import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI!;
if (!uri) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}

const PUBLIC = join(__dirname, '../public');

function readJson(path: string): unknown[] {
  const full = join(PUBLIC, 'json', path);
  if (!existsSync(full)) { console.warn(`  skipping missing: ${path}`); return []; }
  return JSON.parse(readFileSync(full, 'utf-8'));
}

function readMd(path: string): string {
  const full = join(PUBLIC, 'md', path);
  if (!existsSync(full)) return '';
  return readFileSync(full, 'utf-8');
}

type CardJson = { slug: string; title: string; image?: string; description?: string; linked: boolean; link?: string };

function toCards(json: CardJson[], collection: string, locale: string, mdDir?: string) {
  return json.map((item, idx) => ({
    slug:        item.slug,
    collection,
    locale,
    title:       item.title       ?? '',
    description: item.description ?? '',
    image:       item.image       ?? '',
    linked:      item.linked      ?? false,
    link:        item.link        ?? '',
    body:        mdDir ? readMd(`${mdDir}/${item.slug}.md`) : '',
    order:       idx,
    createdAt:   new Date(),
    updatedAt:   new Date(),
  }));
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('portfolio');
  const cards = db.collection('cards');
  const pubs  = db.collection('publications');

  console.log('Connected to MongoDB. Starting seed…\n');

  const inserts: object[] = [];

  // Career blog
  inserts.push(...toCards(readJson('blog.json')    as CardJson[], 'blog', 'en', 'blog'));
  inserts.push(...toCards(readJson('blog_ar.json') as CardJson[], 'blog', 'ar', 'blog/ar'));

  // Personal blog
  inserts.push(...toCards(readJson('blog_personal.json') as CardJson[], 'blog_personal', 'en'));

  // Projects
  inserts.push(...toCards(readJson('projects.json')    as CardJson[], 'projects', 'en'));
  inserts.push(...toCards(readJson('projects_ar.json') as CardJson[], 'projects', 'ar'));

  // Positions
  inserts.push(...toCards(readJson('positions.json')    as CardJson[], 'positions', 'en', 'positions'));
  inserts.push(...toCards(readJson('positions_ar.json') as CardJson[], 'positions', 'ar'));

  // Coursework (locale-independent, stored as en)
  inserts.push(...toCards(readJson('masters-courses.json')   as CardJson[], 'coursework_masters',   'en'));
  inserts.push(...toCards(readJson('bachelors-courses.json') as CardJson[], 'coursework_bachelors', 'en'));

  // Art
  inserts.push(...toCards(readJson('art/illustration.json') as CardJson[], 'art_illustration', 'en'));
  inserts.push(...toCards(readJson('art/sewing.json')       as CardJson[], 'art_sewing',       'en'));
  inserts.push(...toCards(readJson('art/painting.json')     as CardJson[], 'art_painting',     'en'));

  // Food
  inserts.push(...toCards(readJson('food/arabic.json')  as CardJson[], 'food_arabic',  'en'));
  inserts.push(...toCards(readJson('food/dessert.json') as CardJson[], 'food_dessert', 'en'));

  if (inserts.length) {
    console.log(`Inserting ${inserts.length} cards…`);
    await cards.insertMany(inserts);
    console.log('Cards seeded.\n');
  }

  // Publications
  type PubJson = { year: number; title: string; authors: string; venue: string; image?: string; link?: string };
  const pubData = readJson('publications.json') as PubJson[];
  if (pubData.length) {
    const pubDocs = pubData.map((p) => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    console.log(`Inserting ${pubDocs.length} publications…`);
    await pubs.insertMany(pubDocs);
    console.log('Publications seeded.\n');
  }

  // Indexes for fast lookup
  await cards.createIndex({ collection: 1, locale: 1, order: 1 });
  await cards.createIndex({ collection: 1, locale: 1, slug: 1 }, { unique: true });
  await pubs.createIndex({ year: -1 });
  console.log('Indexes created.');

  await client.close();
  console.log('\nSeed complete!');
}

main().catch((err) => { console.error(err); process.exit(1); });
