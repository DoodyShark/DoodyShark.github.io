"use client";

import { useParams, useRouter } from "next/navigation";

export default function LanguageToggle() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();

  const switchLang = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.push(`/${newLocale}`);
  };

  return (
    <button
      onClick={switchLang}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
    >
      {locale === "en" ? "AR" : "EN"}
    </button>
  );
}
