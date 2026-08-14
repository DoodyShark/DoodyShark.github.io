"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import ImageUploadField from "./ImageUploadField";

type CardData = {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageBlur?: string;
  linked: boolean;
  link: string;
  body: string;
};

const EMPTY: CardData = { slug: "", title: "", description: "", image: "", imageBlur: "", linked: true, link: "", body: "" };

import { translateToArabic } from '@/lib/translate-client';

export default function CardForm({
  collectionId,
  collection,
  locale,
  hasBody,
  initial,
  id,
  arInitial,
  arId,
  showAr = false,
}: {
  collectionId: string;
  collection: string;
  locale: string;
  hasBody: boolean;
  initial?: Partial<CardData>;
  id?: string;
  arInitial?: Partial<CardData>;
  arId?: string;
  showAr?: boolean;
}) {
  const router = useRouter();
  const [tab,      setTab]      = useState<'en' | 'ar'>('en');
  const [form,     setForm]     = useState<CardData>({ ...EMPTY, ...initial });
  const [arForm,   setArForm]   = useState<CardData>({ ...EMPTY, ...arInitial });
  const [saving,   setSaving]   = useState(false);
  const [xlating,  setXlating]  = useState(false);
  const [error,    setError]    = useState("");

  const set   = (k: keyof CardData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const setAr = (k: keyof CardData, v: string | boolean) => setArForm(f => ({ ...f, [k]: v }));

  // ── Auto-translate EN → AR ─────────────────────────────────────
  const handleTranslate = async () => {
    setXlating(true);
    const [title, description, body] = await Promise.all([
      translateToArabic(form.title),
      translateToArabic(form.description),
      hasBody ? translateToArabic(form.body) : Promise.resolve(''),
    ]);
    setArForm(f => ({ ...f, title, description, body: hasBody ? body : f.body }));
    setTab('ar');
    setXlating(false);
  };

  // ── Save ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {

    // Save EN
    const enPayload  = { ...form, collection, locale };
    const enUrl      = id ? `/api/content/${id}` : "/api/content";
    const enMethod   = id ? "PUT" : "POST";
    const enRes      = await fetch(enUrl, { method: enMethod, headers: { "Content-Type": "application/json" }, body: JSON.stringify(enPayload) });

    if (!enRes.ok) {
      const d = await enRes.json();
      setError(d.error ?? "Save failed.");
      setSaving(false);
      return;
    }

    // Save AR if applicable
    if (showAr) {
      // Always sync shared fields (image, link, linked) from EN → AR
      const arPayload = {
        ...arForm,
        slug:      form.slug,
        collection,
        locale:    'ar',
        image:     form.image,      // same image for both languages
        imageBlur: form.imageBlur,  // same blur placeholder
        link:      form.link,       // same external link
        linked:    form.linked,     // same clickability
      };
      const arUrl     = arId ? `/api/content/${arId}` : "/api/content";
      const arMethod  = arId ? "PUT" : "POST";
      await fetch(arUrl, { method: arMethod, headers: { "Content-Type": "application/json" }, body: JSON.stringify(arPayload) });
    }

      router.push(`/admin/collections/${collectionId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  // ── Field renderers ───────────────────────────────────────────────
  const field = (label: string, key: keyof CardData, isAr = false, type = "text") => {
    const val     = isAr ? String(arForm[key]) : String(form[key]);
    const handler = (v: string) => {
      const val = type === "number" ? Number(v) : v;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isAr) setAr(key, val as any); else set(key, val as any);
    };
    return (
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>
        <input
          type={type}
          value={val}
          dir={isAr ? "rtl" : "ltr"}
          onChange={e => handler(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-zinc-400 text-sm"
        />
      </div>
    );
  };

  const isAr = showAr && tab === 'ar';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Language tabs */}
      {showAr && (
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
          <button type="button" onClick={handleTranslate} disabled={xlating}
            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-colors disabled:opacity-50 whitespace-nowrap">
            {xlating ? 'Translating…' : '↕ Auto-translate EN → AR'}
          </button>
        </div>
      )}

      {/* Slug (shared, always EN) */}
      {field("Slug (URL identifier)", "slug", false)}

      {/* Tab-specific fields */}
      {field("Title", "title", isAr)}
      {field("Description", "description", isAr)}

      {/* Image — shared (same image for EN/AR) */}
      {!isAr && (
        <ImageUploadField
          label="Image"
          value={form.image}
          onChange={(url, blurDataURL) => setForm(f => ({ ...f, image: url, imageBlur: blurDataURL ?? '' }))}
        />
      )}

      {/* Link — shared */}
      {!isAr && field("Custom link (optional)", "link", false)}

      {/* Linked checkbox — shared */}
      {!isAr && (
        <div className="flex items-center gap-3">
          <input type="checkbox" id="linked" checked={form.linked} onChange={e => set("linked", e.target.checked)} className="w-4 h-4 accent-teal-500" />
          <label htmlFor="linked" className="text-sm font-medium text-zinc-400">Linked (card is clickable)</label>
        </div>
      )}

      {/* Body / rich text */}
      {hasBody && (
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Content {isAr ? '(Arabic)' : '(English)'}</label>
          {isAr
            ? <RichTextEditor value={arForm.body} onChange={v => setAr("body", v)} />
            : <RichTextEditor value={form.body}   onChange={v => set("body", v)}   />
          }
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={saving}
        className="w-full py-2 bg-teal-700 hover:bg-teal-600 rounded-lg font-medium transition-colors disabled:opacity-50">
        {saving ? "Saving…" : id ? "Save Changes" : "Create Item"}
      </button>
    </form>
  );
}
