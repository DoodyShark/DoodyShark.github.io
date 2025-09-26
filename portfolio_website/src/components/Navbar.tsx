"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useNav } from "@/context/NavContext";

export default function Navbar() {
  const { navItems, setNavItems } = useNav();
  const pathname = usePathname();
  const router = useRouter();

  const handleHomeClick = () => {
    setNavItems([]); // clear items
    router.push("/"); // navigate to home
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md w-full">
      {/* Left side: Home + nav items */}
      <div className="flex items-center space-x-6">
        {/* Home button */}
        <button
          onClick={handleHomeClick}
          className={`ml-4 p-2 rounded transition-colors bg-gray-200 dark:bg-blue-700 font-semibold transition-colors ${
            pathname === "/" ? "text-gray-50" : "hover:text-gray-300"
          }`}
        >
          Home
        </button>

        {/* Section nav items */}
        <ul className="flex space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors ${
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

      {/* Right side: toggles */}
      <div className="flex items-center space-x-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </nav>
  );
}
