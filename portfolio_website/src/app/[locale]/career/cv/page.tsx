"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CVPage() {
  const t = useTranslations("career.cv");
  const [pdfLoaded, setPdfLoaded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <a
        href="/pdf/cv.pdf"
        download
        className="mb-6 px-4 py-2 bg-purple-700 dark:bg-yellow-600 text-white rounded hover:bg-purple-500 dark:hover:bg-yellow-500 transition-colors"
      >
        {t("download")}
      </a>
      <div className="w-full h-[80vh] border rounded overflow-hidden border-slate-300 dark:border-slate-600">
        <iframe
          src="/pdf/cv.pdf"
          title="CV"
          className="w-full h-full"
          onLoad={() => setPdfLoaded(true)}
        />
        {!pdfLoaded && <p className="text-center mt-4">{t("loading")}</p>}
      </div>
    </div>
  );
}
