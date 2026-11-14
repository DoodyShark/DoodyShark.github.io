import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { getCard } from "@/lib/data";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ post?: string | string[] }>;
};

/**
 * Builds a server-rendered "read a post" page (`?post=<slug>`).
 *
 * @param collections  restrict lookup to these card collections (null = any, used by art/food)
 * @param fixedLocale  always read this locale's posts (e.g. English-only sections);
 *                     otherwise the visitor's locale is used
 */
export function makeReadPage({ collections, fixedLocale }: { collections: string[] | null; fixedLocale?: string }) {
  async function load({ params, searchParams }: PageProps) {
    const { locale } = await params;
    const { post } = await searchParams;
    const slug = Array.isArray(post) ? post[0] : post;
    const card = slug ? await getCard(slug, fixedLocale ?? locale, collections) : null;
    return { locale, slug, card };
  }

  async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { card } = await load(props);
    if (!card?.title) return {};
    return {
      title: `${card.title} · Dhiyaa Al Jorf`,
      description: card.description || undefined,
    };
  }

  async function ReadPage(props: PageProps) {
    const { locale, slug, card } = await load(props);
    setRequestLocale(locale);

    return (
      <div className="w-full max-w-3xl mx-auto">
        {!slug ? (
          <p>No post specified.</p>
        ) : !card?.body ? (
          <p>Content not found.</p>
        ) : (
          <div>
            {card.title && <h1 className="text-3xl font-bold mb-6">{card.title}</h1>}
            <MarkdownRenderer content={card.body} />
          </div>
        )}
      </div>
    );
  }

  return { ReadPage, generateMetadata };
}
