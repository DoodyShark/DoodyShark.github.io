import { getTranslations } from "next-intl/server";
import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default async function PersonalBlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "personal.blog" });
  return (
    <div className="w-full pt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("title")}</h1>
      <div className="relative w-full h-48 sm:h-72 lg:h-96 mb-4">
        <Image src="/img/personal_blog_banner.jpg" alt="Blog banner" fill className="object-cover rounded-2xl" />
      </div>
      <p className="text-center text-stone-600 dark:text-stone-300 mb-8">{t("description")}</p>
      <MarkdownCards collection="blog_personal" locale_override="en" href_path="/personal/blog/read" row_width={3} />
    </div>
  );
}
