import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPageUrl } from "@/lib/data";
import PdfFrame from "./PdfFrame";

export default async function CVPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "career.cv" });
  const cvUrl = (await getPageUrl("cv-url")) || "/pdf/cv.pdf";

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <a
        href={cvUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 px-4 py-2 rounded transition-colors font-medium"
        style={{ background: "var(--m-teal)", color: "white" }}
      >
        {t("download")}
      </a>
      <PdfFrame src={cvUrl} loadingText={t("loading")} />
    </div>
  );
}
