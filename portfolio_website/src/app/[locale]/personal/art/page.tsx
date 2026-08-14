import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";
import { getDb } from "@/lib/mongodb";

export default async function ArtPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "personal.art" });

  const db = await getDb();
  const sections = await db.collection('section_defs').find({ type: 'art' }).sort({ order: 1 }).toArray();

  return (
    <div className="w-full pt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("title")}</h1>
      <div className="relative w-full h-48 sm:h-72 lg:h-96 mb-4">
        <Image src="/img/art_banner.png" alt="Art banner" fill className="object-cover rounded-2xl" />
      </div>
      <p className="text-center mb-8" style={{ color: 'var(--m-text2)' }}>{t("description")}</p>

      {sections.map(s => (
        <div key={String(s._id)} className="mb-10">
          <h2 className="text-xl font-bold mb-6">
            {locale === 'ar' && s.labelAr ? s.labelAr : s.label}
          </h2>
          <MarkdownCards
            collection={s.key as string}
            locale_override="en"
            href_path="/personal/art/read"
            row_width={3}
          />
        </div>
      ))}
    </div>
  );
}
