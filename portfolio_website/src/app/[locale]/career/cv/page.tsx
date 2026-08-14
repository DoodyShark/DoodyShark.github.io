"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function CVPage() {
  const t = useTranslations("career.cv");
  const [cvUrl,    setCvUrl]    = useState("/pdf/cv.pdf");
  const [pdfLoaded,setPdfLoaded]= useState(false);

  useEffect(() => {
    fetch('/api/page-content?page=cv-url&locale=en')
      .then(r => r.json())
      .then(data => { if (data?.body?.trim()) setCvUrl(data.body.trim()); })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <a
        href={cvUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 px-4 py-2 rounded transition-colors font-medium"
        style={{ background: 'var(--m-teal)', color: 'white' }}
      >
        {t("download")}
      </a>
      <div className="w-full h-[80vh] rounded overflow-hidden" style={{ border: '1px solid var(--m-border)' }}>
        <iframe key={cvUrl} src={cvUrl} title="CV" className="w-full h-full" onLoad={() => setPdfLoaded(true)} />
        {!pdfLoaded && <p className="text-center mt-4" style={{ color: 'var(--m-text2)' }}>{t("loading")}</p>}
      </div>
    </div>
  );
}
