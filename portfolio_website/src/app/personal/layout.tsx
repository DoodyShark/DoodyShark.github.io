"use client";

import { useEffect } from "react";
import { useNav } from "@/context/NavContext";

const careerNavItems = [
  { href: "/personal", label: "About" },
  { href: "/personal/blog", label: "Blog" },
  { href: "/personal/art", label: "Art" },
  { href: "/personal/food", label: "Food" },
];

export default function ArtLayout({ children }: { children: React.ReactNode }) {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems(careerNavItems);
  }, [setNavItems]);

  return <div className="pb-10 sm:pr-50 sm:pl-50 lg:pr-100 lg:pl-100">{children}</div>;

}
