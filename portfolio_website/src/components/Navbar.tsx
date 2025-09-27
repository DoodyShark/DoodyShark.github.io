"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useNav } from "@/context/NavContext";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { navItems, setNavItems } = useNav();
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isArabic = pathname.startsWith("/ar");

  const handleHomeClick = () => {
    setNavItems([]); // clear items
    router.push(isArabic ? "/ar" : "/"); // navigate to home in current language
  };

  return (
    <nav className={`bg-gray-600 p-2 dark:bg-gray-500 text-white shadow-2xl w-full transition-colors duration-500 ease-in-out ${isArabic ? "rtl" : "ltr"}`}>
      {/* Top row */}
      <div className={`flex justify-between items-center px-4 py-3 ${isArabic ? "flex-row-reverse" : ""}`}>
        {/* Left/Right side */}
        <div className={`flex items-center ${isArabic ? "space-x-reverse" : ""} space-x-6 ${isArabic ? "flex-row-reverse" : ""}`}>
          <button
            onClick={handleHomeClick}
            className={`rounded font-semibold ${pathname === (isArabic ? "/ar" : "/") ? "text-gray-50" : "hover:text-gray-300"}`}
          >
            <Image
              suppressHydrationWarning
              src={"/white_home.png"}
              alt={"Back to home button"}
              width={25}
              height={25}
              className="mx-auto"
            />
          </button>

          {/* Desktop nav items */}
          <ul className={`hidden md:flex space-x-6 ${isArabic ? "flex-row-reverse" : ""}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`transition-colors duration-100 ease-in-out ${isActive ? "text-blue-400 underline" : "hover:text-gray-300"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right/Left side */}
        <div className={`flex items-center ${isArabic ? "space-x-reverse" : "space-x-3"}   ${isArabic ? "flex-row-reverse" : ""}`}>
          <LanguageToggle />
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown – pushes content down */}
      {mobileOpen && (
        <div className={`flex flex-col items-start px-4 pb-4 space-y-3 md:hidden ${isArabic ? "text-right" : "text-left"}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full transition-colors ${isActive ? "text-blue-400 underline" : "hover:text-gray-300"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
