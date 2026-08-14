import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";

export default async function AwardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career.awards" });
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <MarkdownCards collection="awards" href_path="/career/projects/read" row_width={1} />
    </div>
  );
}
