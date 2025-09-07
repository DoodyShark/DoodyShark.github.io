"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeDebug() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    console.log("🎨 Current theme:", theme);
    console.log("🖥️ System theme:", systemTheme);
  }, [theme, systemTheme]);

  return <p>Debugger On</p>;
}
