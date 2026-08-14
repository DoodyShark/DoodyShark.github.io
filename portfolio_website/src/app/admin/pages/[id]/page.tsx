import { requireAdminSession } from '@/lib/admin';
import { getDb } from '@/lib/mongodb';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import PageContentEditor from './PageContentEditor';

async function getDefaultContent(page: string, locale: string): Promise<string> {
  if (page === 'career-about') {
    const t = await getTranslations({ locale, namespace: 'career.about' });
    return `## ${t('title')}

${t('bio1')}

${t('bio2')}

## ${t('interests')}

- ${t('interest1')}
- ${t('interest2')}
- ${t('interest3')}

## ${t('news')}

**Sept 20, 2025** – Joined the MASAID program as a Teaching Assistant co-developing materials for the AI Project course.

**Sept 15, 2025** – First day at my MSc in CS program at ETH Zürich.

**Aug 28, 2025** – Co-developing an executive education program in Oxford for a delegation from South Korea.

**Jun 14, 2025** – Supporting the UAE Chief Artificial Intelligence Officers Program 2025.
`;
  }
  if (page === 'personal-about') {
    return locale === 'ar'
      ? 'اكتب شيئًا عن نفسك هنا — هواياتك، اهتماماتك، أي شيء شخصي.'
      : 'Write something about yourself here — hobbies, interests, anything personal.';
  }
  return '';
}

const PAGE_META: Record<string, { label: string; replaces: string }> = {
  'career-about':   { label: 'Career About',  replaces: 'Bio, research interests, and news. Profile photo and social links always stay.' },
  'personal-about': { label: 'Personal About', replaces: 'Personal intro text. Video, profile photo, and Instagram link always stay.'      },
};

type Params = { params: Promise<{ id: string }> };

export default async function PageContentEditPage({ params }: Params) {
  await requireAdminSession();
  const { id } = await params;
  const meta = PAGE_META[id];
  if (!meta) notFound();

  const db = await getDb();
  const [enDoc, arDoc] = await Promise.all([
    db.collection('page_content').findOne({ page: id, locale: 'en' }),
    db.collection('page_content').findOne({ page: id, locale: 'ar' }),
  ]);

  const initialEn = enDoc?.body ?? await getDefaultContent(id, 'en');
  const initialAr = arDoc?.body ?? await getDefaultContent(id, 'ar');

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-1">{meta.label}</h1>
      <p className="text-zinc-400 text-sm mb-6">
        <strong className="text-zinc-300">What this replaces:</strong> {meta.replaces}
      </p>
      <PageContentEditor
        page={id}
        initialEn={initialEn}
        initialAr={initialAr}
        backUrl="/admin/pages"
      />
    </div>
  );
}
