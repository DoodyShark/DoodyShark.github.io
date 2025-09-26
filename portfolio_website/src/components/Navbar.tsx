"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useNav } from "@/context/NavContext";
import Image from "next/image";
import { useTheme } from "next-themes";



export default function Navbar() {
  const { navItems, setNavItems } = useNav();
  const pathname = usePathname();
  const router = useRouter();
  const {theme} = useTheme();

  const handleHomeClick = () => {
    setNavItems([]); // clear items
    router.push("/"); // navigate to home
  };

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-gray-600 dark:bg-gray-500 text-white shadow-2xl w-full transition-colors duration-500 ease-in-out;">
      {/* Left side: Home + nav items */}
      <div className="flex items-center space-x-6">
        {/* Home button */}
        <button
          onClick={handleHomeClick}
          className={`rounded transition-colors font-semibold transition-colors ${
            pathname === "/" ? "text-gray-50" : "hover:text-gray-300"
          }`}
        >
          <Image
            suppressHydrationWarning
            src={'/white_home.png'} 
            // src={theme === "dark"? '/black_home.png': '/white_home.png'} 
            alt={'Back to home button'}
            width={30}
            height={30}
            className="mx-auto mb-3"
          />
        </button>

        {/* Section nav items */}
        <ul className="flex space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors duration-100 ease-in-out; ${
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
