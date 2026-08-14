import { requireAdminSession } from '@/lib/admin';
import { getDb } from '@/lib/mongodb';
import Link from 'next/link';
import SectionManager from './SectionManager';

const ART_DEFAULTS = [
  { type: 'art',  key: 'art-illustration', label: 'Illustration', labelAr: 'رسم توضيحي', order: 0 },
  { type: 'art',  key: 'art-sewing',       label: 'Sewing',       labelAr: 'خياطة',       order: 1 },
  { type: 'art',  key: 'art-painting',     label: 'Painting',     labelAr: 'رسم',         order: 2 },
];
const FOOD_DEFAULTS = [
  { type: 'food', key: 'food-arabic',  label: 'Arabic Food', labelAr: 'أكل عربي', order: 0 },
  { type: 'food', key: 'food-dessert', label: 'Desserts',    labelAr: 'حلويات',   order: 1 },
];

export default async function SectionsPage() {
  await requireAdminSession();
  const db  = await getDb();
  const now = new Date().toISOString();

  let artSections  = await db.collection('section_defs').find({ type: 'art'  }).sort({ order: 1 }).toArray();
  let foodSections = await db.collection('section_defs').find({ type: 'food' }).sort({ order: 1 }).toArray();

  // One-time seed of defaults into MongoDB so they become editable/deletable
  if (artSections.length === 0) {
    await db.collection('section_defs').insertMany(ART_DEFAULTS.map(d => ({ ...d, createdAt: now })));
    artSections = await db.collection('section_defs').find({ type: 'art' }).sort({ order: 1 }).toArray();
  }
  if (foodSections.length === 0) {
    await db.collection('section_defs').insertMany(FOOD_DEFAULTS.map(d => ({ ...d, createdAt: now })));
    foodSections = await db.collection('section_defs').find({ type: 'food' }).sort({ order: 1 }).toArray();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialize = (docs: any[]) => docs.map(d => ({ ...d, _id: String(d._id) }));

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200">← Dashboard</Link>
        <h1 className="text-2xl font-bold">Manage Sections</h1>
      </div>
      <p className="text-zinc-400 text-sm mb-8">
        All sections are editable and deletable. Deleting a section hides it from the public site
        but does <strong className="text-zinc-300">not</strong> delete the cards inside — they remain in the database.
      </p>
      <SectionManager initialArt={serialize(artSections)} initialFood={serialize(foodSections)} />
    </div>
  );
}
