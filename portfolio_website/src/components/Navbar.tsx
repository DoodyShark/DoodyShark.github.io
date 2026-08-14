"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname(); // no locale prefix, e.g. /career
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isArabic = locale === "ar";
  const isCareer = pathname.startsWith("/career");
  const isPersonal = pathname.startsWith("/personal");

  // Same warm brown navbar across all sections — consistent with home page
  const navBg = "bg-[#685850]/92 dark:bg-[#524438]/96 backdrop-blur-md border-b border-white/10";

  const navItems = isCareer
    ? [
        { href: "/career" as const,              label: t("career.nav.about")        },
        { href: "/career/blog" as const,         label: t("career.nav.blog")         },
        { href: "/career/projects" as const,     label: t("career.nav.projects")     },
        { href: "/career/positions" as const,    label: t("career.nav.positions")    },
        { href: "/career/publications" as const, label: t("career.nav.publications") },
        { href: "/career/awards" as const,       label: t("career.nav.awards")       },
        { href: "/career/coursework" as const,   label: t("career.nav.coursework")   },
        { href: "/career/cv" as const,           label: t("career.nav.cv")           },
      ]
    : isPersonal
    ? [
        { href: "/personal" as const,       label: t("personal.nav.about") },
        { href: "/personal/blog" as const,  label: t("personal.nav.blog")  },
        { href: "/personal/art" as const,   label: t("personal.nav.art")   },
        { href: "/personal/food" as const,  label: t("personal.nav.food")  },
      ]
    : [];

  const activeClass =
    "bg-white/20 text-white rounded-lg px-3 py-1.5 font-medium";
  const inactiveClass =
    "text-white/75 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1.5 transition-colors duration-150";

  return (
    <nav
      className={`${navBg} text-white shadow-lg w-full transition-colors duration-500 ease-in-out`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex justify-between items-center px-4 sm:px-6 py-2">
        {/* Home + nav items */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => { router.push("/"); }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Home"
          >
            <Image
              suppressHydrationWarning
              src="/white_home.png"
              alt="Back to home"
              width={22}
              height={22}
            />
          </button>

          {navItems.length > 0 && (
            <span className="w-px h-5 bg-white/25 mx-1" aria-hidden />
          )}

          <ul className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? activeClass : inactiveClass}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          {navItems.length > 0 && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={`px-4 pb-4 pt-2 flex flex-col gap-1 md:hidden border-t border-white/10 ${
            isArabic ? "items-end" : "items-start"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`w-full ${pathname === item.href ? activeClass : inactiveClass}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
