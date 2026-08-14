"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type CardData = {
  slug: string;
  title?: string;
  body?: string;
};

export default function ReadClient({
  collection,
  locale_override,
}: {
  collection?: string;
  locale_override?: string;
}) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("post");
  const locale = useLocale();
  const effectiveLocale = locale_override ?? locale;

  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const collectionParam = collection ? `&collection=${collection}` : '';
    fetch(
      `/api/content?locale=${effectiveLocale}&slug=${encodeURIComponent(slug)}&body=true${collectionParam}`
    )
      .then((r) => r.json())
      .then((data: CardData[]) => setCard(data[0] ?? null))
      .catch(() => setCard(null))
      .finally(() => setLoading(false));
  }, [slug, collection, effectiveLocale]);

  if (!slug) return <p>No post specified.</p>;
  if (loading) return <p>Loading...</p>;
  if (!card || !card.body) return <p>Content not found.</p>;

  return (
    <div>
      {card.title && <h1 className="text-3xl font-bold mb-6">{card.title}</h1>}
      <MarkdownRenderer content={card.body} />
    </div>
  );
}
