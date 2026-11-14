'use client';
import Link from 'next/link';
import PdfUrlForm from '@/components/admin/PdfUrlForm';

export default function CVAdminForm({ currentUrl }: { currentUrl: string }) {
  return (
    <div className="space-y-5">
      <PdfUrlForm pageKey="cv-url" currentUrl={currentUrl} label="Current CV URL" placeholder="/pdf/cv.pdf" />
      <Link href="/admin/dashboard" className="inline-block text-sm text-zinc-400 hover:text-zinc-200">
        ← Dashboard
      </Link>
    </div>
  );
}
