"use client";

import { useEffect } from "react";
import { useNav } from "@/context/NavContext";

const careerNavItems = [
  { href: "/career/", label: "About" },
  { href: "/career/blog", label: "Blog" },
  { href: "/career/projects", label: "Projects" },
  { href: "/career/positions", label: "Positions" },
  { href: "/career/publications", label: "Publications" },
  { href: "/career/coursework", label: "Coursework" },
];

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems(careerNavItems);
  }, [setNavItems]);

  return <>{children}</>;
}
