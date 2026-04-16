import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career.projects" });
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <MarkdownCards collection="projects" href_path="/career/projects/read" row_width={3} />
    </div>
  );
}
