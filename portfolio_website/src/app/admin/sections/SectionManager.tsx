'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translateToArabic } from '@/lib/translate-client';

interface SectionDef {
  _id: string;
  key: string;
  label: string;
  labelAr?: string;
  type: string;
}

function SectionGroup({ type, title, initialSections }: {
  type: string; title: string; initialSections: SectionDef[];
}) {
  const [sections, setSections] = useState(initialSections);
  const [label,    setLabel]    = useState('');
  const [labelAr,  setLabelAr]  = useState('');
  const [xlating,  setXlating]  = useState(false);
  const [adding,   setAdding]   = useState(false);
  const router = useRouter();

  const handleTranslate = async () => {
    setXlating(true);
    setLabelAr(await translateToArabic(label));
    setXlating(false);
  };

  const handleAdd = async () => {
    if (!label.trim()) return;
    setAdding(true);
    const res  = await fetch('/api/section-defs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, label: label.trim(), labelAr: labelAr.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setSections(prev => [...prev, { _id: data.key, key: data.key, label: label.trim(), labelAr: labelAr.trim(), type }]);
      setLabel(''); setLabelAr('');
      router.refresh();
    }
    setAdding(false);
  };

  const handleDelete = async (sec: SectionDef) => {
    if (!confirm(`Delete section "${sec.label}"?\n\nThe cards inside are NOT deleted — they stay in the database and can be reassigned later.`)) return;
    await fetch('/api/section-defs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: sec.key }),
    });
    setSections(prev => prev.filter(s => s._id !== sec._id));
    router.refresh();
  };

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="space-y-2 mb-4">
        {sections.map(sec => (
          <div key={sec._id} className="flex items-center justify-between bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3">
            <div>
              <span className="font-medium">{sec.label}</span>
              {sec.labelAr && <span className="text-zinc-500 text-sm ml-3" dir="rtl">{sec.labelAr}</span>}
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/collections/${sec.key}`}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-colors">
                Manage items →
              </Link>
              <button onClick={() => handleDelete(sec)}
                className="px-3 py-1 bg-red-900 hover:bg-red-800 rounded text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new section */}
      <div className="mt-4 space-y-2 p-4 bg-zinc-900 border border-zinc-700 rounded-xl">
        <p className="text-xs text-zinc-500 mb-2">Add new section</p>
        <div className="flex gap-2">
          <input value={label} onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder={type === 'art' ? 'e.g. Digital Art' : 'e.g. Breakfast'}
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm focus:outline-none focus:border-zinc-400" />
          <button type="button" onClick={handleTranslate} disabled={xlating || !label.trim()}
            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-colors disabled:opacity-50 whitespace-nowrap">
            {xlating ? '…' : '↕ AR'}
          </button>
        </div>
        <input value={labelAr} onChange={e => setLabelAr(e.target.value)}
          placeholder="Arabic name (عربي)" dir="rtl"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm focus:outline-none focus:border-zinc-400" />
        <button onClick={handleAdd} disabled={adding || !label.trim()}
          className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors disabled:opacity-50">
          {adding ? 'Adding…' : '+ Add section'}
        </button>
      </div>
    </section>
  );
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialArt:  any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFood: any[];
}

export default function SectionManager({ initialArt, initialFood }: Props) {
  return (
    <>
      <SectionGroup type="art"  title="Art Sections"  initialSections={initialArt  as SectionDef[]} />
      <SectionGroup type="food" title="Food Sections" initialSections={initialFood as SectionDef[]} />
    </>
  );
}
