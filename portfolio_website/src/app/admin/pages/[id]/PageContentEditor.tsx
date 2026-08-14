'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import Link from 'next/link';

import { translateToArabic } from '@/lib/translate-client';

interface Props {
  page:      string;
  initialEn: string;
  initialAr: string;
  backUrl:   string;
}

export default function PageContentEditor({ page, initialEn, initialAr, backUrl }: Props) {
  const [tab,      setTab]      = useState<'en' | 'ar'>('en');
  const [bodyEn,   setBodyEn]   = useState(initialEn);
  const [bodyAr,   setBodyAr]   = useState(initialAr);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [xlating,  setXlating]  = useState(false);
  const router = useRouter();

  const handleTranslate = async () => {
    setXlating(true);
    const translated = await translateToArabic(bodyEn);
    setBodyAr(translated);
    setTab('ar');
    setXlating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await Promise.all([
      fetch('/api/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, locale: 'en', body: bodyEn }),
      }),
      fetch('/api/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, locale: 'ar', body: bodyAr }),
      }),
    ]);
    setSaving(false);
    setSaved(true);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Language tabs + auto-translate */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-zinc-600">
          <button type="button" onClick={() => setTab('en')}
            className={`px-4 py-1.5 text-sm transition-colors ${tab === 'en' ? 'bg-zinc-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            🇬🇧 English
          </button>
          <button type="button" onClick={() => setTab('ar')}
            className={`px-4 py-1.5 text-sm transition-colors ${tab === 'ar' ? 'bg-zinc-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            🇸🇦 Arabic
          </button>
        </div>
        <button
          type="button"
          onClick={handleTranslate}
          disabled={xlating}
          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {xlating ? 'Translating…' : '↕ Auto-translate EN → AR'}
        </button>
      </div>

      {/* Editor */}
      {tab === 'en'
        ? <RichTextEditor value={bodyEn} onChange={setBodyEn} />
        : <RichTextEditor value={bodyAr} onChange={setBodyAr} />
      }

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save both languages'}
        </button>
        <Link href={backUrl} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          ← Back
        </Link>
        {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
      </div>
    </div>
  );
}
