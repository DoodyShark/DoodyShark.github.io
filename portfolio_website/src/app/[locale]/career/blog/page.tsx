import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career.blog" });
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("title")}</h1>
      <div className="relative w-full h-48 sm:h-72 lg:h-96 mb-4">
        <Image src="/blog_banner.jpg" alt="Blog banner" fill className="object-cover rounded-md" />
      </div>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-8">{t("description")}</p>
      <MarkdownCards collection="blog" href_path="/career/blog/read" row_width={2} />
    </div>
  );
}
