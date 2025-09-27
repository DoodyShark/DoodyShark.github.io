"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CardData = {
  slug: string;
  title: string;
  image: string;
  description: string;
  linked: boolean,
};

export default function MarkdownCards({ file, href_path, row_width }: { file: string , href_path: string, row_width: number}) {
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    async function loadCards() {
      console.log(`fetching from /json/${file}`)
      const res = await fetch(`/json/${file}`);
      const data: CardData[] = await res.json();
      setCards(data);
    }
    loadCards();
  }, [file]); // <-- add file here

  if (!cards.length) return <p>Loading...</p>;

  return (
    <div className={`grid grid-cols-1 ${(row_width < 2)? `sm:grid-cols-${row_width}`: "sm:grid-cols-2"} ${(row_width < 3)? `lg:grid-cols-${row_width}`: "lg:grid-cols-3"} gap-6`}>
      {cards.map((card) => (
        <Link
          key={card.slug}
          href={`${href_path}?post=${encodeURIComponent(card.slug)}`}
          className={`${!card.linked && "pointer-events-none"} transition-colors  bg-gray-800 hover:bg-gray-500 dark:bg-gray-500 hover:dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow`}
        >
            {
              (card.image !== "") &&
              <div className={`relative w-50 h-50 sm:w-60 sm:h-60 ${row_width === 1? "lg:w-120 lg:h-120": "lg:w-70 lg:h-70"}`}>
                  <Image
                    src={card.image}
                    alt={card.title || card.slug}
                    fill
                    className="object-cover"
                  />
              </div>
            }
          {
            (card.title !== "" || card.description !== "") &&
            (<div className="p-4">
              {card.title !== "" && <h2 className="text-gray-200 text-xl font-semibold mb-2">{card.title}</h2>}
              {card.description !== "" && <p className="text-gray-400 dark:text-gray-200 text-sm">{card.description}</p>}
            </div>)
          }
        </Link>
      ))}
    </div>
  );
}
