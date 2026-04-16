"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PubData = {
  year: number;
  title: string;
  authors: string;
  venue: string;
  image: string;
  link: string;
};

export default function PubForm({
  initial,
  id,
}: {
  initial?: Partial<PubData> & { _id?: string };
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PubData>({
    year:    initial?.year    ?? new Date().getFullYear(),
    title:   initial?.title   ?? "",
    authors: initial?.authors ?? "",
    venue:   initial?.venue   ?? "",
    image:   initial?.image   ?? "",
    link:    initial?.link    ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k: keyof PubData, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url    = id ? `/api/publications/${id}` : "/api/publications";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/publications");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Save failed.");
    }
  };

  const field = (label: string, key: keyof PubData, type = "text") => (
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
      {field("Year", "year", "number")}
      {field("Title", "title")}
      {field("Authors", "authors")}
      {field("Venue / Conference / Journal", "venue")}
      {field("Image URL (optional)", "image")}
      {field("Link URL (optional)", "link")}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2 bg-teal-700 hover:bg-teal-600 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : id ? "Save Changes" : "Create Publication"}
      </button>
    </form>
  );
}
