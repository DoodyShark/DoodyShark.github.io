"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CardData = {
  slug: string;
  title: string;
  image: string;
  description: string;
  linked: boolean;
  link?: string; // <-- optional custom external or internal link
};

export default function MarkdownCards({
  file,
  href_path,
  row_width,
}: {
  file: string;
  href_path: string;
  row_width: number;
}) {
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    async function loadCards() {
      console.log(`fetching from /json/${file}`);
      const res = await fetch(`/json/${file}`);
      const data: CardData[] = await res.json();
      setCards(data);
    }
    loadCards();
  }, [file]);

  if (!cards.length) return <p>Loading...</p>;

  return (
    <div
      className={`grid grid-cols-1 ${
        row_width < 2 ? `sm:grid-cols-${row_width}` : "sm:grid-cols-2"
      } ${row_width < 3 ? `lg:grid-cols-${row_width}` : "lg:grid-cols-3"} gap-6`}
    >
      {cards.map((card) => {
        const hasImage = card.image && card.image.trim() !== "";

        const isExternal =
          card.link &&
          /^(https?:\/\/|mailto:|tel:)/.test(card.link);

        const href = card.link
          ? card.link
          : `${href_path}?post=${encodeURIComponent(card.slug)}`;

        const linkProps = isExternal
          ? { href, target: "_blank", rel: "noopener noreferrer" }
          : { href };

        const LinkComponent: React.ElementType  = isExternal ? "a" : Link;

        return (
          <LinkComponent
            key={card.slug}
            {...linkProps}
            className={`${
              !card.linked && "pointer-events-none"
            } group relative rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] bg-gray-800 dark:bg-gray-700`}
          >
            {hasImage ? (
              <>
                {/* Full image background */}
                <div className="relative w-full h-64 sm:h-72 lg:h-80">
                  <Image
                    src={card.image}
                    alt={card.title || card.slug}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Gradient overlay text */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                  {card.title && (
                    <h2 className="text-gray-50 text-xl font-semibold mb-2">
                      {card.title}
                    </h2>
                  )}
                  {card.description && (
                    <p className="text-gray-200 text-sm">{card.description}</p>
                  )}
                </div>
              </>
            ) : (
              /* No image fallback card */
              <div className="bg-gray-700 dark:bg-gray-600 p-4 h-full flex flex-col justify-center hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors">
                {card.title && (
                  <h2 className="text-gray-100 text-xl font-semibold mb-2">
                    {card.title}
                  </h2>
                )}
                {card.description && (
                  <p className="text-gray-300 text-sm">{card.description}</p>
                )}
              </div>
            )}
          </LinkComponent>
        );
      })}
    </div>
  );
}


