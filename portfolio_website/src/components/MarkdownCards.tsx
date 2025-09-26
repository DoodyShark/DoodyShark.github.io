// src/components/BlogCards.tsx
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";

type CardData = {
  title: string;
  image: string;
  description: string;
  link: string; // relative path to md file
};

export default function MarkdownCards({ folder }: { folder: string }) {
  const postsDir = path.join(process.cwd(), folder);
  const postFolders = fs.readdirSync(postsDir);

  const cards: CardData[] = postFolders
    .map((postFolder) => {
      const cardPath = path.join(postsDir, postFolder, "card.json");
      if (!fs.existsSync(cardPath)) return null;
      const fileContent = fs.readFileSync(cardPath, "utf-8");
      return JSON.parse(fileContent) as CardData;
    })
    .filter(Boolean) as CardData[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <Link
          key={i}
          href={`/career/blog/${encodeURIComponent(card.link.split("/")[0])}`}
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
