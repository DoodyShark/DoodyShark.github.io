"use client";

import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  return (
    <div className="absolute top-4 right-6 flex items-center space-x-3">
      {/* Language toggle */}
      <LanguageToggle />

      {/* Theme toggle */}
      <ThemeToggle />
    </div>
  );
}
