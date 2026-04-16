import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function CareerAboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "career.about" });
  const isArabic = locale === "ar";

  return (
    <div className="space-y-12" dir={isArabic ? "rtl" : "ltr"}>
      <section className="flex flex-col md:flex-row md:space-x-8 items-start">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{t("title")}</h1>

          {/* Mobile photo */}
          <div className="sm:hidden relative w-48 h-64 mt-6">
            <Image src="/me1.png" alt="Profile photo" fill className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0" />
            <Image src="/me2.png" alt="Profile hover" fill className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
          </div>

          <span className="text-slate-600 dark:text-slate-300 block">
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
        </div>

        {/* Desktop photo + contacts */}
        <div className="hidden sm:flex flex-col items-center mt-6 md:mt-20 gap-4">
          <div className="relative w-48 h-64">
            <Image src="/me1.png" alt="Profile photo" fill className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0" />
            <Image src="/me2.png" alt="Profile hover" fill className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
          </div>
          <div className="space-y-1 text-sm">
            <p><a href="mailto:da2863@nyu.edu" className="text-blue-600 dark:text-blue-400 hover:underline">da2863@nyu.edu</a></p>
            <p><a href="mailto:daljorf@ethz.ch" className="text-blue-600 dark:text-blue-400 hover:underline">daljorf@ethz.ch</a></p>
          </div>
        </div>
      </section>

      {/* News */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("news")}</h2>
        <ul className="space-y-4">
          <li><span className="font-bold">Sept 20, 2025 –</span> Joined the MAS in Artificial Intelligence and Digital Technology (MASAID) program as a Teaching Assistant co-developing materials for the AI Project course.</li>
          <li><span className="font-bold">Sept 15, 2025 –</span> First day at my MSc in CS program at ETH Zürich.</li>
          <li><span className="font-bold">Aug 28, 2025 –</span> Co-developing an executive education program in Oxford for a delegation from South Korea.</li>
          <li><span className="font-bold">Jun 14, 2025 –</span> Supporting the UAE Chief Artificial Intelligence Officers Program 2025.</li>
        </ul>
      </section>

      {/* Links */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("links")}</h2>
        <ul className="flex gap-6 flex-wrap">
          <li><Link href="https://github.com/DoodyShark" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</Link></li>
          <li><Link href="https://scholar.google.com/citations?user=IDT0Nj0AAAAJ&hl=en" className="text-blue-600 dark:text-blue-400 hover:underline">Google Scholar</Link></li>
          <li><Link href="https://linkedin.com/in/dhiyaa-al-jorf" className="text-blue-600 dark:text-blue-400 hover:underline">LinkedIn</Link></li>
        </ul>
      </section>
    </div>
  );
}
