"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();

  // Detect current locale
  const isArabic = pathname.startsWith("/ar");

  const switchLang = () => {
    if (isArabic) {
      // Remove /ar prefix → go back to English
      const newPath = pathname.replace(/^\/ar/, "") || "/";
      router.push(newPath);
    } else {
      // Add /ar prefix
      const newPath = `/ar${pathname}`;
      router.push(newPath);
    }
  };

  return (
    <button
      onClick={switchLang}
      className="px-3 py-1 rounded text-white hover:text-gray-200 transition-colors"
    >
      {isArabic ? "EN" : "AR"}
    </button>
  );
}
