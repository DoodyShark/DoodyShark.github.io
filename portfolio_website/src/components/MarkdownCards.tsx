"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CardData = {
  slug: string;
  title: string;
  image: string;
  description: string;
};

export default function MarkdownCards({ file, href_path }: { file: string , href_path: string}) {
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    async function loadCards() {
      console.log(`fetching from /json/${file}`)
      const res = await fetch(`/json/${file}`);
      console.log(res)
      const data: CardData[] = await res.json();
      setCards(data);
    }
    loadCards();
  }, []);

  if (!cards.length) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Link
          key={card.slug}
          href={`${href_path}?post=${encodeURIComponent(card.slug)}`}
          className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative w-full h-48">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-400 text-sm">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
