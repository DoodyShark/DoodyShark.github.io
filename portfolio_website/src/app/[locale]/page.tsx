"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type Slide = {
  titleKey: "home.career" | "home.personal";
  img: string;
  img2: string;
  logo: string;
  href: "/career" | "/personal";
};

const slides: Slide[] = [
  { titleKey: "home.career",   img: "/career.jpg",   img2: "/career2.jpg",   logo: "/DoodyShark.png", href: "/career"   },
  { titleKey: "home.personal", img: "/personal.jpg", img2: "/personal2.jpg", logo: "/DoodlyFox.png",  href: "/personal" },
];

export default function HomeCarousel() {
  const t = useTranslations();
  const router = useRouter();
  const n = slides.length;

  const [internalIndex, setInternalIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const rowRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = ((internalIndex - 1) % n + n) % n;

  const next = () => { setTransitionEnabled(true); setInternalIndex((i) => i + 1); };
  const prev = () => { setTransitionEnabled(true); setInternalIndex((i) => i - 1); };
  const goTo = (idx: number) => { setTransitionEnabled(true); setInternalIndex(idx + 1); };

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const handleTransitionEnd = () => {
      if (internalIndex === 0) {
        setTransitionEnabled(false);
        setInternalIndex(n);
        requestAnimationFrame(() => requestAnimationFrame(() => setTransitionEnabled(true)));
      }
      if (internalIndex === n + 1) {
        setTransitionEnabled(false);
        setInternalIndex(1);
        requestAnimationFrame(() => requestAnimationFrame(() => setTransitionEnabled(true)));
      }
    };
    el.addEventListener("transitionend", handleTransitionEnd);
    return () => el.removeEventListener("transitionend", handleTransitionEnd);
  }, [internalIndex, n]);

  const clonedSlides = [slides[n - 1], ...slides, slides[0]];

  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaRef = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
    setTransitionEnabled(false);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const x = e.touches[0].clientX;
    touchDeltaRef.current = x - touchStartXRef.current;
    if (rowRef.current) {
      const width = rowRef.current.clientWidth / (n + 2);
      const base = -internalIndex * 100;
      const offset = (touchDeltaRef.current / width) * 100;
      rowRef.current.style.transform = `translateX(${base + offset}%)`;
    }
  };
  const onTouchEnd = () => {
    const delta = touchDeltaRef.current;
    touchStartXRef.current = null;
    touchDeltaRef.current = 0;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    } else {
      setTransitionEnabled(true);
      setInternalIndex((i) => i + 0); // snap back (force re-render)
    }
  };

  const transformStyle = { transform: `translateX(-${internalIndex * 100}%)` };
  const transitionClass = transitionEnabled ? "transition-transform duration-500 ease-in-out" : "";

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* Active slide header */}
      <div
        className="text-center mb-8 cursor-pointer"
        onClick={() => router.push(slides[activeIndex].href)}
      >
        <Image
          src={slides[activeIndex].logo}
          alt={t(slides[activeIndex].titleKey)}
          width={60}
          height={60}
          className="mx-auto mb-3 rounded-full shadow-2xl"
        />
        <h2 className="text-2xl font-semibold">{t(slides[activeIndex].titleKey)}</h2>
      </div>

      {/* Slider */}
      <div
        className="relative flex items-center justify-center h-[60vh] w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={prev}
          className="hidden md:block absolute left-2 z-10 border rounded-full p-2 text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900"
          aria-label="Previous"
        >←</button>

        <div
          ref={rowRef}
          className={`flex ${transitionClass}`}
          style={transformStyle as React.CSSProperties}
        >
          {clonedSlides.map((slide, idx) => (
            <div
              key={idx}
              className="w-full shrink-0 flex justify-center cursor-pointer"
              onClick={() => router.push(slide.href)}
            >
              <div className="relative w-[160px] h-[280px] sm:w-[240px] sm:h-[420px] md:w-[280px] md:h-[490px]">
                <Image
                  src={slide.img}
                  alt={t(slide.titleKey)}
                  fill
                  className="object-contain dark:bg-white transition-opacity duration-300 hover:opacity-0 shadow-lg hover:shadow-slate-700 dark:hover:shadow-black rounded-3xl"
                  sizes="(max-width: 500px) 200px, 400px"
                />
                <Image
                  src={slide.img2}
                  alt={t(slide.titleKey)}
                  fill
                  className="object-contain dark:bg-white opacity-0 transition-opacity duration-300 hover:opacity-100 shadow-lg hover:shadow-slate-700 dark:hover:shadow-black rounded-3xl"
                  sizes="(max-width: 500px) 200px, 400px"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={next}
          className="hidden md:block absolute right-2 z-10 border rounded-full p-2 text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900"
          aria-label="Next"
        >→</button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === activeIndex ? "bg-gray-800 dark:bg-white" : "bg-gray-400 dark:bg-gray-600"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
