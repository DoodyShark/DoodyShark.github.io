import { getTranslations, setRequestLocale } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";
import { getSectionDefs } from "@/lib/data";

export default async function FoodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "personal.food" });

  const sections = await getSectionDefs('food');

  return (
    <div className="w-full pt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("title")}</h1>
      <div className="relative w-full h-48 sm:h-72 lg:h-96 mb-4">
        <Image src="/img/food_banner.jpg" alt="Food banner" fill className="object-cover rounded-2xl" />
      </div>
      <p className="text-center mb-8" style={{ color: 'var(--m-text2)' }}>{t("description")}</p>

      {sections.map(s => (
        <div key={s._id} className="mb-10">
          <h2 className="text-xl font-bold mb-6">
            {locale === 'ar' && s.labelAr ? s.labelAr : s.label}
          </h2>
          <MarkdownCards
            collection={s.key}
            href_path="/personal/food/read"
            row_width={3}
          />
        </div>
      ))}
    </div>
  );
}
