import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default async function FoodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "personal.food" });
  return (
    <div className="w-full pt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("title")}</h1>
      <div className="relative w-full h-48 sm:h-72 lg:h-96 mb-4">
        <Image src="/img/food_banner.jpg" alt="Food banner" fill className="object-cover rounded-2xl" />
      </div>
      <p className="text-center text-stone-600 dark:text-stone-300 mb-8">{t("description")}</p>
      <h2 className="text-xl font-bold mb-6">{t("arabic")}</h2>
      <MarkdownCards collection="food_arabic" locale_override="en" href_path="/personal/food/read" row_width={3} />
      <h2 className="text-xl font-bold mb-6 mt-6">{t("desserts")}</h2>
      <MarkdownCards collection="food_dessert" locale_override="en" href_path="/personal/food/read" row_width={3} />
    </div>
  );
}
