"use client";

import { useEffect } from "react";
import { useNav } from "@/context/NavContext";

const careerNavItems = [
  { href: "/art/about", label: "About" },
  { href: "/art/sewing", label: "Sewing" },
  { href: "/art/digital", label: "Digital Arts" },
  { href: "/art/paintings", label: "Paintings" },
];

export default function ArtLayout({ children }: { children: React.ReactNode }) {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems(careerNavItems);
  }, [setNavItems]);

  return <>{children}</>;
}
