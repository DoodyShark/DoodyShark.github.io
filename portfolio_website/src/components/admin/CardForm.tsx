"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CardData = {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  linked: boolean;
  link: string;
  body: string;
  order: number;
};

export default function CardForm({
  collectionId,
  collection,
  locale,
  hasBody,
  initial,
  id,
}: {
  collectionId: string;
  collection: string;
  locale: string;
  hasBody: boolean;
  initial?: Partial<CardData>;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<CardData>({
    slug:        initial?.slug        ?? "",
    title:       initial?.title       ?? "",
    description: initial?.description ?? "",
    image:       initial?.image       ?? "",
    linked:      initial?.linked      ?? true,
    link:        initial?.link        ?? "",
    body:        initial?.body        ?? "",
    order:       initial?.order       ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k: keyof CardData, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...form, collection, locale };
    const url  = id ? `/api/content/${id}` : "/api/content";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.ok) {
      router.push(`/admin/collections/${collectionId}`);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Save failed.");
    }
  };

  const field = (label: string, key: keyof CardData, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => set(key, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-zinc-400 text-sm"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {field("Slug (URL identifier)", "slug")}
      {field("Title", "title")}
      {field("Description", "description")}
      {field("Image URL", "image")}
      {field("Custom link (optional)", "link")}
      {field("Order (sort position)", "order", "number")}

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="linked"
          checked={form.linked}
          onChange={(e) => set("linked", e.target.checked)}
          className="w-4 h-4 accent-teal-500"
        />
        <label htmlFor="linked" className="text-sm font-medium text-zinc-400">
          Linked (card is clickable)
        </label>
      </div>

      {hasBody && (
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Body (Markdown)
          </label>
          <textarea
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            rows={18}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg focus:outline-none focus:border-zinc-400 text-sm font-mono resize-y"
            placeholder="Write markdown here…"
          />
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2 bg-teal-700 hover:bg-teal-600 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : id ? "Save Changes" : "Create Item"}
      </button>
    </form>
  );
}
