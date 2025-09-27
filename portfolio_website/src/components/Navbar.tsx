"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useNav } from "@/context/NavContext";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { navItems, setNavItems } = useNav();
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleHomeClick = () => {
    setNavItems([]); // clear items
    router.push("/"); // navigate to home
  };

  return (
    <nav className="bg-gray-600 p-2 dark:bg-gray-500 text-white shadow-2xl w-full transition-colors duration-500 ease-in-out">
      {/* Top row */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          {/* Home button */}
          <button
            onClick={handleHomeClick}
            className={`rounded font-semibold ${
              pathname === "/" ? "text-gray-50" : "hover:text-gray-300"
            }`}
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
          <ul className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`transition-colors duration-100 ease-in-out ${
                      isActive
                        ? "text-blue-400 underline"
                        : "hover:text-gray-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
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
        <div className="flex flex-col items-start px-4 pb-4 space-y-3 md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full text-left transition-colors ${
                  isActive ? "text-blue-400 underline" : "hover:text-gray-300"
                }`}
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
