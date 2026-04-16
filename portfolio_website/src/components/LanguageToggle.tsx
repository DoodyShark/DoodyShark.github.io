"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" });
  };

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
    >
      {locale === "ar" ? "EN" : "AR"}
    </button>
  );
}
