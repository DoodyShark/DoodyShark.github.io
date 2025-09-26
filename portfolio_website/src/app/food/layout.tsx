"use client";

import { useEffect } from "react";
import { useNav } from "@/context/NavContext";

const careerNavItems = [
  { href: "/art/about", label: "About" },
  { href: "/art/savory", label: "Savory" },
  { href: "/art/sweet", label: "Sweet" },
];

export default function FoodLayout({ children }: { children: React.ReactNode }) {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems(careerNavItems);
  }, [setNavItems]);

  return <>{children}</>;
}
