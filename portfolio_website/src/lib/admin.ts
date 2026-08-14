import { getSession } from './session';
import { redirect } from 'next/navigation';
import { getDb } from './mongodb';

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect('/admin/login');
  return session;
}

export const CARD_COLLECTIONS = [
  // AR is handled inline via the bilingual CardForm — no separate AR rows needed
  { id: 'blog',                 collection: 'blog',               locale: 'en', label: 'Blog',                 hasBody: true,  supportsAr: true  },
  { id: 'blog-personal',        collection: 'blog_personal',      locale: 'en', label: 'Personal Blog',        hasBody: true,  supportsAr: false },
  { id: 'projects',             collection: 'projects',           locale: 'en', label: 'Projects',             hasBody: true,  supportsAr: true  },
  { id: 'positions',            collection: 'positions',          locale: 'en', label: 'Positions',            hasBody: true,  supportsAr: true  },
  { id: 'coursework-masters',   collection: 'coursework_masters', locale: 'en', label: 'Masters Coursework',  hasBody: true,  supportsAr: false },
  { id: 'coursework-bachelors', collection: 'coursework_bachelors', locale: 'en', label: "Bachelor's Coursework", hasBody: true,  supportsAr: false },
  { id: 'awards',               collection: 'awards',              locale: 'en', label: 'Awards & Honors',      hasBody: false, supportsAr: true  },
  // Art & Food sections are fully dynamic (created via /admin/sections) and resolve through
  // the section_defs fallback below — do not add static entries for them here. A static
  // entry whose id happens to match a section_defs key (as the old food-arabic/food-dessert
  // entries did) shadows the dynamic lookup and silently saves cards under the wrong
  // collection name, making them invisible on the public site.
] as const;

export type CollectionId = (typeof CARD_COLLECTIONS)[number]['id'];

// Lookup by id — checks static list then dynamic MongoDB section_defs
export async function getCollectionMeta(id: string) {
  const staticMeta = CARD_COLLECTIONS.find(c => c.id === id);
  if (staticMeta) return staticMeta;

  // Dynamic section (created by user in admin/sections)
  const db  = await getDb();
  const doc = await db.collection('section_defs').findOne({ key: id });
  if (doc) {
    return {
      id:         doc.key as string,
      collection: doc.key as string,
      locale:     'en',
      label:      doc.label as string,
      hasBody:    true,
      supportsAr: false,
    };
  }
  return null;
}
