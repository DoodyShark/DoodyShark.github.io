'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { translateToArabic } from '@/lib/translate-client';

interface Props {
  sectionKey: string;
  initialLabel: string;
  initialLabelAr: string;
}

export default function SectionTitleEditor({ sectionKey, initialLabel, initialLabelAr }: Props) {
  const [editing,  setEditing]  = useState(false);
  const [label,    setLabel]    = useState(initialLabel);
  const [labelAr,  setLabelAr]  = useState(initialLabelAr);
  const [xlating,  setXlating]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const router = useRouter();

  if (!editing) {
    return (
      <div className="flex items-center gap-2 mb-6">
        <span className="text-zinc-400 text-sm">{label}{labelAr ? ` / ${labelAr}` : ''}</span>
        <button onClick={() => setEditing(true)}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline">
          Rename section
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/section-defs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: sectionKey, label, labelAr }),
    });
    setSaving(false);
    setEditing(false);
    router.refresh();
  };

  const handleTranslate = async () => {
    setXlating(true);
    setLabelAr(await translateToArabic(label));
    setXlating(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6 space-y-3">
      <p className="text-xs text-zinc-500">Rename section</p>
      <div className="flex gap-2">
        <input value={label} onChange={e => setLabel(e.target.value)}
          placeholder="English name"
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm focus:outline-none focus:border-zinc-400" />
        <button type="button" onClick={handleTranslate} disabled={xlating || !label.trim()}
          className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-colors disabled:opacity-50 whitespace-nowrap">
          {xlating ? '…' : '↕ AR'}
        </button>
      </div>
      <input value={labelAr} onChange={e => setLabelAr(e.target.value)}
        placeholder="Arabic name (عربي)" dir="rtl"
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm focus:outline-none focus:border-zinc-400" />
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !label.trim()}
          className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={() => { setEditing(false); setLabel(initialLabel); setLabelAr(initialLabelAr); }}
          className="px-4 py-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
