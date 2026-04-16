import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";

export default async function CourseworkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career.coursework" });
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <h2 className="text-xl font-bold mb-6">{t("masters")}</h2>
      <MarkdownCards collection="coursework_masters" locale_override="en" href_path="/career/coursework/read" row_width={3} />
      <h2 className="text-xl font-bold mt-6 mb-6">{t("bachelors")}</h2>
      <MarkdownCards collection="coursework_bachelors" locale_override="en" href_path="/career/coursework/read" row_width={3} />
    </div>
  );
}
