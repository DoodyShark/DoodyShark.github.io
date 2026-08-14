import { requireAdminSession } from '@/lib/admin';
import { getDb } from '@/lib/mongodb';
import CVAdminForm from './CVAdminForm';

export default async function CVAdminPage() {
  await requireAdminSession();

  const db  = await getDb();
  const doc = await db.collection('page_content').findOne({ page: 'cv-url', locale: 'en' });
  const currentUrl = doc?.body?.trim() ?? '';

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">CV / Résumé</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Upload a new PDF to replace the CV shown on the site. The file will be hosted on Vercel Blob.
        If no file is uploaded here, the site uses <code className="text-zinc-300">/pdf/cv.pdf</code>.
      </p>
      <CVAdminForm currentUrl={currentUrl} />
    </div>
  );
}
