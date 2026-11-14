import Link from 'next/link';
import { requireAdminSession } from '@/lib/admin';
import { getDb } from '@/lib/mongodb';
import PdfUrlForm from '@/components/admin/PdfUrlForm';
import { TRANSCRIPTS } from '@/lib/transcripts';

export default async function TranscriptsAdminPage() {
  await requireAdminSession();

  const db   = await getDb();
  const docs = await db
    .collection('page_content')
    .find({ page: { $in: TRANSCRIPTS.map(t => t.pageKey) }, locale: 'en' })
    .toArray();
  const urlFor = (key: string) => (docs.find(d => d.page === key)?.body ?? '').trim();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/admin/dashboard" className="text-zinc-400 hover:text-white text-sm">← Dashboard</Link>
      <h1 className="text-2xl font-bold mt-1 mb-2">Transcripts</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Upload a PDF for each degree. It is hosted on Vercel Blob and linked next to the matching
        heading on the Coursework page (the merged one sits next to the page title). Leave a field empty (or click Remove) to hide its link.
      </p>

      <div className="space-y-10">
        {TRANSCRIPTS.map(t => (
          <section key={t.pageKey} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t.label}</h2>
            <PdfUrlForm pageKey={t.pageKey} currentUrl={urlFor(t.pageKey)} label="Transcript URL" allowClear />
          </section>
        ))}
      </div>
    </div>
  );
}
