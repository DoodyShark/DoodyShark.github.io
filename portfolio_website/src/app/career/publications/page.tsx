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

export default function Publications() {
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
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Publications</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Publications by categories in reversed chronological order.
      </p>

      {/* Search box */}
      <input
        type="text"
        placeholder="Type to filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-8 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

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


      {!filtered.length && <p>No matching publications found.</p>}
    </div>
  );
}
