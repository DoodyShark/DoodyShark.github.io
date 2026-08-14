import { requireAdminSession } from '@/lib/admin';
import Link from 'next/link';

const PAGES = [
  { id: 'career-about',   label: 'Career About',   desc: 'Bio, research interests, and news. Photo and links always stay.' },
  { id: 'personal-about', label: 'Personal About',  desc: 'Personal intro text. Video, photo, and links always stay.'       },
];

export default async function PagesListPage() {
  await requireAdminSession();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Page Content</h1>
      </div>
      <p className="text-zinc-400 text-sm mb-6">
        Edit the text shown on the About pages. Supports both English and Arabic in one form.
      </p>
      <div className="space-y-3">
        {PAGES.map(p => (
          <Link
            key={p.id}
            href={`/admin/pages/${p.id}`}
            className="flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-4 transition-colors"
          >
            <div>
              <p className="font-medium">{p.label}</p>
              <p className="text-zinc-500 text-sm mt-0.5">{p.desc}</p>
            </div>
            <span className="text-zinc-500 text-sm">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
