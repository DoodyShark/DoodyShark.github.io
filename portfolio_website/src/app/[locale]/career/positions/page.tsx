import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";

export default async function PositionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career.positions" });
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <MarkdownCards collection="positions" href_path="/career/positions/read" row_width={1} />
    </div>
  );
}
