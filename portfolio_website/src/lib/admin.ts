import { getSession } from './session';
import { redirect } from 'next/navigation';

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.isLoggedIn) redirect('/admin/login');
  return session;
}

export const CARD_COLLECTIONS = [
  { id: 'blog-en',              collection: 'blog',               locale: 'en', label: 'Blog (EN)',            hasBody: true  },
  { id: 'blog-ar',              collection: 'blog',               locale: 'ar', label: 'Blog (AR)',            hasBody: true  },
  { id: 'blog-personal',        collection: 'blog_personal',      locale: 'en', label: 'Personal Blog',        hasBody: true  },
  { id: 'projects-en',          collection: 'projects',           locale: 'en', label: 'Projects (EN)',        hasBody: true  },
  { id: 'projects-ar',          collection: 'projects',           locale: 'ar', label: 'Projects (AR)',        hasBody: true  },
  { id: 'positions-en',         collection: 'positions',          locale: 'en', label: 'Positions (EN)',       hasBody: true  },
  { id: 'positions-ar',         collection: 'positions',          locale: 'ar', label: 'Positions (AR)',       hasBody: true  },
  { id: 'coursework-masters',   collection: 'coursework_masters', locale: 'en', label: 'Masters Coursework',  hasBody: false },
  { id: 'coursework-bachelors', collection: 'coursework_bachelors', locale: 'en', label: "Bachelor's Coursework", hasBody: false },
  { id: 'art-illustration',     collection: 'art_illustration',   locale: 'en', label: 'Art – Illustration',  hasBody: false },
  { id: 'art-sewing',           collection: 'art_sewing',         locale: 'en', label: 'Art – Sewing',        hasBody: false },
  { id: 'art-painting',         collection: 'art_painting',       locale: 'en', label: 'Art – Painting',      hasBody: false },
  { id: 'food-arabic',          collection: 'food_arabic',        locale: 'en', label: 'Food – Arabic',       hasBody: true  },
  { id: 'food-dessert',         collection: 'food_dessert',       locale: 'en', label: 'Food – Desserts',     hasBody: true  },
] as const;

export type CollectionId = (typeof CARD_COLLECTIONS)[number]['id'];
