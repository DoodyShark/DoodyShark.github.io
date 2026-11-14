import { unstable_cache } from 'next/cache';
import type { Document, WithId } from 'mongodb';
import { getDb } from './mongodb';

// Cached, server-side reads for the public site.
//
// Each read is tagged; the admin API routes call `revalidateTag` on write
// (`revalidateTag(TAGS.x)`), so edits show up on the next request while
// every other request is served from cache instead of hitting MongoDB.

export const TAGS = {
  cards:        'cards',
  pageContent:  'page_content',
  publications: 'publications',
  sectionDefs:  'section_defs',
} as const;

export type Card = {
  _id: string;
  slug: string;
  title: string;
  image: string;
  imageBlur?: string;
  description: string;
  linked: boolean;
  link?: string;
  body?: string;
};

export type Publication = {
  _id: string;
  year: number;
  title: string;
  authors: string;
  venue: string;
  image?: string;
  link?: string;
};

export type SectionDef = { _id: string; key: string; label: string; labelAr: string };

// Mongo docs → plain JSON (ObjectId/Date aren't cache-serializable)
function plain<T>(doc: WithId<Document>): T {
  return JSON.parse(JSON.stringify({ ...doc, _id: doc._id.toString() })) as T;
}

export const getCards = unstable_cache(
  async (collection: string, locale: string): Promise<Card[]> => {
    const db = await getDb();
    const docs = await db.collection('cards')
      .find({ collection, locale }, { projection: { body: 0 } })
      .sort({ order: 1 })
      .toArray();
    return docs.map(d => plain<Card>(d));
  },
  ['cards-list'],
  { tags: [TAGS.cards] },
);

/** One post by slug, optionally restricted to a set of collections. */
export const getCard = unstable_cache(
  async (slug: string, locale: string, collections: string[] | null): Promise<Card | null> => {
    const db = await getDb();
    const query: Document = { slug, locale };
    if (collections?.length) query.collection = { $in: collections };
    const doc = await db.collection('cards').findOne(query);
    return doc ? plain<Card>(doc) : null;
  },
  ['cards-one'],
  { tags: [TAGS.cards] },
);

export const getPageContent = unstable_cache(
  async (page: string, locale: string): Promise<{ body?: string; news?: { date: string; text: string }[] } | null> => {
    const db = await getDb();
    const doc = await db.collection('page_content').findOne({ page, locale });
    return doc ? plain(doc) : null;
  },
  ['page-content'],
  { tags: [TAGS.pageContent] },
);

/** Convenience: a page_content entry used as a single URL (CV, transcripts). */
export async function getPageUrl(page: string): Promise<string> {
  return (await getPageContent(page, 'en'))?.body?.trim() ?? '';
}

export const getPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const db = await getDb();
    const docs = await db.collection('publications').find({}).sort({ year: -1 }).toArray();
    return docs.map(d => plain<Publication>(d));
  },
  ['publications'],
  { tags: [TAGS.publications] },
);

export const getSectionDefs = unstable_cache(
  async (type: string): Promise<SectionDef[]> => {
    const db = await getDb();
    const docs = await db.collection('section_defs').find({ type }).sort({ order: 1 }).toArray();
    return docs.map(d => plain<SectionDef>(d));
  },
  ['section-defs'],
  { tags: [TAGS.sectionDefs] },
);
