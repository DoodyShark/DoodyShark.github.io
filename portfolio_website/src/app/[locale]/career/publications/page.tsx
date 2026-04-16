"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Pub = {
  _id: string;
  year: number;
  title: string;
  authors: string;
  venue: string;
  image?: string;
  link?: string;
};

export default function PublicationsPage() {
  const t = useTranslations("career.publications");
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/publications")
      .then((r) => r.json())
      .then((data: Pub[]) => setPubs(data))
      .catch(console.error);
  }, []);

  const filtered = pubs.filter((p) =>
    [p.title, p.authors, p.venue].join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-300">{t("description")}</p>

      <input
        type="text"
        placeholder={t("filterPlaceholder")}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-8 p-2 border rounded-md bg-white dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-600"
      />

      {filtered.map((pub) => (
        <div key={pub._id} className="mb-6 flex gap-4">
          {pub.image && (
            <div className="flex-shrink-0 w-20 h-20 relative">
              <Image src={pub.image} alt={pub.title} fill className="object-contain rounded-md" />
            </div>
          )}
          <div>
            <h2 className="font-semibold text-lg">
              {pub.link ? (
                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {pub.title}
                </a>
              ) : pub.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{pub.authors}</p>
            <p className="text-sm italic text-slate-500 dark:text-slate-400">{pub.venue}, {pub.year}</p>
          </div>
        </div>
      ))}

      {!filtered.length && pubs.length > 0 && <p>{t("noResults")}</p>}
    </div>
  );
}
