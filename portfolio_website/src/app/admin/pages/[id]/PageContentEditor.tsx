'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import Link from 'next/link';

import { translateToArabic } from '@/lib/translate-client';

type NewsItem = { date: string; text: string };

interface Props {
  page:         string;
  initialEn:    string;
  initialAr:    string;
  initialNewsEn?: NewsItem[];
  initialNewsAr?: NewsItem[];
  backUrl:      string;
}

export default function PageContentEditor({ page, initialEn, initialAr, initialNewsEn, initialNewsAr, backUrl }: Props) {
  const [tab,      setTab]      = useState<'en' | 'ar'>('en');
  const [bodyEn,   setBodyEn]   = useState(initialEn);
  const [bodyAr,   setBodyAr]   = useState(initialAr);
  const [newsEn,   setNewsEn]   = useState<NewsItem[]>(initialNewsEn ?? []);
  const [newsAr,   setNewsAr]   = useState<NewsItem[]>(initialNewsAr ?? []);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [xlating,  setXlating]  = useState(false);
  const router = useRouter();

  const hasNews = initialNewsEn !== undefined;
  const news    = tab === 'en' ? newsEn : newsAr;
  const setNews = tab === 'en' ? setNewsEn : setNewsAr;

  const addNewsItem = () => setNews([{ date: '', text: '' }, ...news]);
  const removeNewsItem = (i: number) => setNews(news.filter((_, idx) => idx !== i));
  const updateNewsItem = (i: number, field: 'date' | 'text', value: string) =>
    setNews(news.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  const moveNewsItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= news.length) return;
    const next = [...news];
    [next[i], next[j]] = [next[j], next[i]];
    setNews(next);
  };

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
        body: JSON.stringify(hasNews ? { page, locale: 'en', body: bodyEn, news: newsEn } : { page, locale: 'en', body: bodyEn }),
      }),
      fetch('/api/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hasNews ? { page, locale: 'ar', body: bodyAr, news: newsAr } : { page, locale: 'ar', body: bodyAr }),
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

      {/* News timeline entries — structured, not part of the body text above */}
      {hasNews && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-zinc-400">
              News timeline ({tab === 'en' ? 'English' : 'Arabic'})
            </label>
            <button
              type="button"
              onClick={addNewsItem}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-colors"
            >
              + Add entry
            </button>
          </div>

          <div className="space-y-2">
            {news.map((item, i) => (
              <div key={i} className="flex gap-2 items-start bg-zinc-800/60 border border-zinc-700 rounded-lg p-2">
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => moveNewsItem(i, -1)} disabled={i === 0}
                    className="text-zinc-500 hover:text-zinc-200 disabled:opacity-30 text-xs leading-none px-1">▲</button>
                  <button type="button" onClick={() => moveNewsItem(i, 1)} disabled={i === news.length - 1}
                    className="text-zinc-500 hover:text-zinc-200 disabled:opacity-30 text-xs leading-none px-1">▼</button>
                </div>
                <input
                  type="text"
                  value={item.date}
                  onChange={e => updateNewsItem(i, 'date', e.target.value)}
                  placeholder="Aug 14, 2026"
                  dir={tab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-40 shrink-0 px-2 py-1.5 bg-zinc-900 border border-zinc-600 rounded text-sm focus:outline-none focus:border-zinc-400"
                />
                <textarea
                  value={item.text}
                  onChange={e => updateNewsItem(i, 'text', e.target.value)}
                  placeholder="What happened…"
                  dir={tab === 'ar' ? 'rtl' : 'ltr'}
                  rows={2}
                  className="flex-1 px-2 py-1.5 bg-zinc-900 border border-zinc-600 rounded text-sm focus:outline-none focus:border-zinc-400 resize-y"
                />
                <button
                  type="button"
                  onClick={() => removeNewsItem(i)}
                  className="text-zinc-500 hover:text-red-400 text-sm px-2 py-1.5"
                  title="Remove entry"
                >
                  ✕
                </button>
              </div>
            ))}
            {news.length === 0 && (
              <p className="text-zinc-500 text-sm italic">No entries yet — click &quot;+ Add entry&quot; above.</p>
            )}
          </div>
        </div>
      )}

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
