"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { spawnConfetti, type ConfettiPiece } from "@/lib/confetti";
import careerImg from "../../../public/career.jpg";
import career2Img from "../../../public/career2.jpg";
import personalImg from "../../../public/personal.jpg";
import personal2Img from "../../../public/personal2.jpg";

type Slide = {
  titleKey: "home.career" | "home.personal";
  img: StaticImageData;
  img2: StaticImageData;
  logo: string;
  href: "/career" | "/personal";
};

const slides: Slide[] = [
  { titleKey: "home.career",   img: careerImg,  img2: career2Img,  logo: "/DoodyShark.png", href: "/career"   },
  { titleKey: "home.personal", img: personalImg, img2: personal2Img, logo: "/DoodlyFox.png",  href: "/personal" },
];

const SLIDE_LABELS: Record<string, string> = {
  "home.career":   "Career",
  "home.personal": "Personal",
};

export default function HomeCarousel() {
  const t = useTranslations();
  const router = useRouter();
  const n = slides.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [confettiMap, setConfettiMap] = useState<Record<number, ConfettiPiece[]>>({});

  const triggerConfetti = useCallback((idx: number) => {
    const pieces = spawnConfetti();
    setConfettiMap(m => ({ ...m, [idx]: [...(m[idx] ?? []), ...pieces] }));
    setTimeout(() => {
      const ids = new Set(pieces.map(p => p.id));
      setConfettiMap(m => ({ ...m, [idx]: (m[idx] ?? []).filter(p => !ids.has(p.id)) }));
    }, 1500);
  }, []);

  const next = () => { setTransitionEnabled(true); setActiveIndex(i => (i + 1) % n); };
  const prev = () => { setTransitionEnabled(true); setActiveIndex(i => (i - 1 + n) % n); };
  const goTo = (idx: number) => { setTransitionEnabled(true); setActiveIndex(idx); };

  // Lock body scroll on home page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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
      const width = rowRef.current.clientWidth / n;
      const base = -activeIndex * 100;
      const offset = (touchDeltaRef.current / width) * 100;
      rowRef.current.style.transform = `translateX(${base + offset}%)`;
    }
  };
  const onTouchEnd = () => {
    const delta = touchDeltaRef.current;
    touchStartXRef.current = null;
    touchDeltaRef.current = 0;
    setTransitionEnabled(true);
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    } else if (rowRef.current) {
      rowRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
  };

  const transformStyle = { transform: `translateX(-${activeIndex * 100}%)` };
  const transitionClass = transitionEnabled ? "transition-transform duration-500 ease-in-out" : "";

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden w-full" style={{ minHeight: 'calc(100dvh - 52px)' }}>
      {/* Active slide label */}
      <div
        className="text-center mb-8 cursor-pointer select-none"
        onClick={() => router.push(slides[activeIndex].href)}
      >
        <h2
          className="text-3xl font-light tracking-widest uppercase"
          style={{ color: 'var(--m-text2)', letterSpacing: '0.25em' }}
        >
          {SLIDE_LABELS[slides[activeIndex].titleKey]}
        </h2>
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
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="w-full shrink-0 flex justify-center cursor-pointer"
              onClick={() => router.push(slide.href)}
            >
              <div className="flex flex-col items-center gap-4">
                {/* Circular card with confetti */}
                <div
                  className="relative overflow-visible"
                  onMouseEnter={() => triggerConfetti(idx)}
                >
                  {/* Confetti layer */}
                  <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
                    {(confettiMap[idx] ?? []).map(p => (
                      <div
                        key={p.id}
                        className="absolute"
                        style={{
                          left: `${p.x}%`,
                          top: '50%',
                          width: p.size,
                          height: p.round ? p.size : p.size * 0.55,
                          borderRadius: p.round ? '50%' : '2px',
                          background: p.color,
                          '--cdx': p.cdx,
                          '--cdy': p.cdy,
                          '--crot': p.crot,
                          animation: `confetti-fly ${p.duration}s ease-out forwards`,
                        } as React.CSSProperties}
                      />
                    ))}
                  </div>

                  {/* Circle image */}
                  <div className="relative w-[160px] h-[160px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden shadow-xl">
                    <Image
                      src={slide.img}
                      alt={SLIDE_LABELS[slide.titleKey]}
                      fill
                      placeholder="blur"
                      className="object-cover transition-opacity duration-300 hover:opacity-0"
                      sizes="(max-width: 500px) 160px, 280px"
                    />
                    <Image
                      src={slide.img2}
                      alt={SLIDE_LABELS[slide.titleKey]}
                      fill
                      placeholder="blur"
                      className="object-cover opacity-0 transition-opacity duration-300 hover:opacity-100"
                      sizes="(max-width: 500px) 160px, 280px"
                    />
                  </div>
                </div>

                <span
                  className="text-sm tracking-widest uppercase"
                  style={{ color: 'var(--m-text2)' }}
                >
                  {SLIDE_LABELS[slide.titleKey]}
                </span>
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
