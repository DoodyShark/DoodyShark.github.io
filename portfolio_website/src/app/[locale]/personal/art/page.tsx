import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default async function ArtPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "personal.art" });
  return (
    <div className="w-full pt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("title")}</h1>
      <div className="relative w-full h-48 sm:h-72 lg:h-96 mb-4">
        <Image src="/img/art_banner.png" alt="Art banner" fill className="object-cover rounded-2xl" />
      </div>
      <p className="text-center text-stone-600 dark:text-stone-300 mb-8">{t("description")}</p>
      <h2 className="text-xl font-bold mb-6">{t("illustration")}</h2>
      <MarkdownCards collection="art_illustration" locale_override="en" href_path="/personal/art/read" row_width={3} />
      <h2 className="text-xl font-bold mb-6 mt-6">{t("sewing")}</h2>
      <MarkdownCards collection="art_sewing" locale_override="en" href_path="/personal/art/read" row_width={3} />
      <h2 className="text-xl font-bold mb-6 mt-6">{t("painting")}</h2>
      <MarkdownCards collection="art_painting" locale_override="en" href_path="/personal/art/read" row_width={3} />
    </div>
  );
}
