import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import NewsTimeline from "@/components/NewsTimeline";

// Splits the "## {newsHeading}" section (if present) out of the About page markdown so its
// entries can render as a timeline instead of plain bullets; everything else stays as markdown.
function splitNewsSection(markdown: string, newsHeading: string) {
  const marker = `## ${newsHeading}`;
  const idx = markdown.indexOf(marker);
  if (idx === -1) return { mainBody: markdown, newsItems: null as { date: string; text: string }[] | null };

  const mainBody = markdown.slice(0, idx).trimEnd();
  const afterHeading = markdown.slice(idx + marker.length);
  const nextHeadingIdx = afterHeading.search(/\n##\s/);
  const newsSection = (nextHeadingIdx === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIdx)).trim();

  const items = newsSection
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const match = p.match(/^\*\*(.+?)\*\*\s*[–—-]\s*([\s\S]+)$/);
      return match ? { date: match[1].trim(), text: match[2].trim() } : null;
    })
    .filter((x): x is { date: string; text: string } => x !== null);

  return { mainBody, newsItems: items.length ? items : null };
}

export default async function CareerAboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career.about" });
  const isArabic = locale === "ar";

  const db = await getDb();
  const pageContent = await db.collection('page_content').findOne({ page: 'career-about', locale });
  const customBody = pageContent?.body ?? null;
  const { mainBody, newsItems } = customBody
    ? splitNewsSection(customBody, t("news"))
    : { mainBody: null as string | null, newsItems: null };

  const linkCls = "text-[#5898a0] hover:underline";

  return (
    <div className="space-y-12" dir={isArabic ? "rtl" : "ltr"}>
      <section className="flex flex-col md:flex-row md:space-x-8 items-start">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{t("title")}</h1>

          <div className="sm:hidden relative w-48 h-64 mt-6">
            <Image src="/me1.png" alt="Profile photo" fill className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0" />
            <Image src="/me2.png" alt="Profile hover"  fill className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
          </div>

          {mainBody ? (
            <MarkdownRenderer content={mainBody} />
          ) : (
            <span style={{ color: 'var(--m-text2)' }} className="block">
              <p className="text-lg mb-3">{t("bio1")}</p>
              <p className="text-lg mb-3">{t("bio2")}</p>
              <div className="mt-5">
                <p className="font-bold mb-2">{t("interests")}</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>{t("interest1")}</li>
                  <li>{t("interest2")}</li>
                  <li>{t("interest3")}</li>
                </ul>
              </div>
            </span>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-center mt-6 md:mt-20 gap-4">
          <div className="relative w-48 h-64">
            <Image src="/me1.png" alt="Profile photo" fill className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0" />
            <Image src="/me2.png" alt="Profile hover"  fill className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
          </div>
          <div className="space-y-1 text-sm">
            <p><a href="mailto:da2863@nyu.edu"  className={linkCls}>da2863@nyu.edu</a></p>
            <p><a href="mailto:daljorf@ethz.ch" className={linkCls}>daljorf@ethz.ch</a></p>
          </div>
        </div>
      </section>

      {newsItems ? (
        <section>
          <h2 className="text-2xl font-semibold mb-6">{t("news")}</h2>
          <NewsTimeline items={newsItems} />
        </section>
      ) : !customBody && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("news")}</h2>
          <ul className="space-y-4" style={{ color: 'var(--m-text2)' }}>
            <li><span className="font-bold" style={{ color: 'var(--m-text)' }}>Sept 20, 2025 –</span> Joined the MASAID program as a Teaching Assistant co-developing materials for the AI Project course.</li>
            <li><span className="font-bold" style={{ color: 'var(--m-text)' }}>Sept 15, 2025 –</span> First day at my MSc in CS program at ETH Zürich.</li>
            <li><span className="font-bold" style={{ color: 'var(--m-text)' }}>Aug 28, 2025 –</span> Co-developing an executive education program in Oxford for a delegation from South Korea.</li>
            <li><span className="font-bold" style={{ color: 'var(--m-text)' }}>Jun 14, 2025 –</span> Supporting the UAE Chief Artificial Intelligence Officers Program 2025.</li>
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("links")}</h2>
        <ul className="flex gap-6 flex-wrap">
          <li><Link href="https://github.com/DoodyShark"                                  className={linkCls}>GitHub</Link></li>
          <li><Link href="https://scholar.google.com/citations?user=IDT0Nj0AAAAJ&hl=en" className={linkCls}>Google Scholar</Link></li>
          <li><Link href="https://linkedin.com/in/dhiyaa-al-jorf"                         className={linkCls}>LinkedIn</Link></li>
        </ul>
      </section>
    </div>
  );
}
