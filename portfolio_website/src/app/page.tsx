"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";

type Slide = {
  title: string;
  img: string;
  logo: string;
  link: string;
};


const slides: Slide[] = [
  {
    title: "art",
    img: "/art.png",
    logo: "/DoodlyFox.png",
    link: "/art",
  },
  {
    title: "career",
    img: "/career.png",
    logo: "/DoodyShark.png",
    link: "/career",
  },
  {
    title: "food",
    img: "/food.png",
    logo: "/FoodieFrog.png",
    link: "/food",
  },
];

export default function Home() {
  const [active, setActive] = useState(1);

  return (
    <>
      {/* Section header */}
      <div className="text-center mb-8">
        <Image
          src={slides[active].logo}
          alt={`${slides[active].title} logo`}
          width={60}
          height={60}
          className="mx-auto mb-3"
        />
        <h2 className="text-2xl font-semibold">{slides[active].title}</h2>
      </div>

      {/* Slider */}
      <div className="flex items-center justify-center gap-6 h-[60vh]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`transition-all duration-500 cursor-pointer ${
              i === active
                ? "opacity-100 blur-0 scale-100"
                : "opacity-50 blur-sm scale-95"
            }`}
            onClick={() =>
              i === active ? (window.location.href = slide.link) : setActive(i)
            }
          >
            <Image
              src={slide.img}
              alt={slide.title}
              width={300}
              height={400}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              i === active ? "bg-gray-800" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </>
  );
}
