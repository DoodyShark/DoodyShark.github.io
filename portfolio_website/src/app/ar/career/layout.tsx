"use client";

import { useEffect } from "react";
import { useNav } from "@/context/NavContext";

const careerNavItemsAr = [
  { href: "/ar/career", label: "نبذة عني" },
  { href: "/ar/career/blog", label: "مدونة" },
  { href: "/ar/career/projects", label: "المشاريع" },
  { href: "/ar/career/positions", label: "المناصب" },
  { href: "/ar/career/publications", label: "المنشورات" },
  { href: "/ar/career/coursework", label: "المقررات" },
  { href: "/ar/career/cv", label: "السيرة الذاتية" },
  { href: "", label: "" },
];

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems(careerNavItemsAr);
  }, [setNavItems]);

  return <div className="p-10 sm:pr-50 sm:pl-50 lg:pr-100 lg:pl-100 text-right" dir="rtl">{children}</div>;
}
