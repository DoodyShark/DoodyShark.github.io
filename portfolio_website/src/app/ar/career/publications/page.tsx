"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Pub = {
  year: number;
  title: string;
  authors: string;
  venue: string;
  image?: string;
  link?: string;
};

export default function PublicationsAr() {
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/json/publications.json")
      .then((res) => res.json())
      .then((data) => setPubs(data));
  }, []);

  // Filter and sort (reverse chronological)
  const filtered = pubs
    .filter((p) =>
      [p.title, p.authors, p.venue]
        .join(" ")
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .sort((a, b) => b.year - a.year);

  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">منشورات</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        المنشورات مرتبة حسب الفئات وبالترتيب الزمني العكسي.
      </p>

      {/* Search box */}
      <input
        type="text"
        placeholder="اكتب للبحث"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-8 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

      <div dir="ltr" className="text-left">
      {/* List */}
        {filtered.map((pub, i) => (
          <div key={i} className="mb-6 flex gap-4">
            {pub.image && (
              <div className="flex-shrink-0 w-20 h-20 relative">
                <Image
                  src={pub.image}
                  alt={pub.title}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            )}
            <div>
              <h2 className="font-semibold text-lg">
                {pub.link ? (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {pub.title}
                  </a>
                ) : (
                  pub.title
                )}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {pub.authors}
              </p>
              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                {pub.venue}, {pub.year}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!filtered.length && <p>لا توجد منشورات مطابقة.</p>}
    </div>
  );
}
