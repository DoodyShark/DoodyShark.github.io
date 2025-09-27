"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Slide = {
  title: string;
  img: string;
  logo: string;
  link: string;
};

const slides: Slide[] = [
  { title: "career", img: "/career.jpg", logo: "/DoodyShark.png", link: "/career" },
  { title: "personal", img: "/personal.jpg", logo: "/DoodlyFox.png", link: "/art" },
];

export default function HomeCarousel() {
  const n = slides.length;

  // We use a cloned list: [last, ...slides, first]
  // internalIndex points into that cloned list. start at 1 (first real slide)
  const [internalIndex, setInternalIndex] = useState<number>(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const rowRef = useRef<HTMLDivElement | null>(null);


  // For rendering the "active slide" index for UI (0..n-1)
  const activeIndex = ((internalIndex - 1) % n + n) % n;

  // Transition duration in ms (used for timing manual jump)
  const TRANS_MS = 500;

  // Move to next / prev with animation
  const next = () => {
    setTransitionEnabled(true);
    setInternalIndex((i) => i + 1);
  };
  const prev = () => {
    setTransitionEnabled(true);
    setInternalIndex((i) => i - 1);
  };

  // When user clicks dot
  const goTo = (targetSlideIndex: number) => {
    // targetSlideIndex is 0..n-1; convert to internal index (1..n)
    const targetInternal = targetSlideIndex + 1;
    setTransitionEnabled(true);
    setInternalIndex(targetInternal);
  };

  // After any transition ends, if we're on a clone, jump to real slide without transition
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const handleTransitionEnd = () => {
      // clone at left: internalIndex === 0 -> jump to n
      if (internalIndex === 0) {
        setTransitionEnabled(false); // disable transition for immediate jump
        setInternalIndex(n); // jump to real last slide (internal index n)
        // re-enable transition on next frame so future moves animate
        requestAnimationFrame(() => {
          // small delay to ensure browser applied the no-transition transform first
          requestAnimationFrame(() => setTransitionEnabled(true));
        });
      }

      // clone at right: internalIndex === n + 1 -> jump to 1
      if (internalIndex === n + 1) {
        setTransitionEnabled(false);
        setInternalIndex(1); // real first slide
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setTransitionEnabled(true));
        });
      }
    };

    el.addEventListener("transitionend", handleTransitionEnd);
    return () => el.removeEventListener("transitionend", handleTransitionEnd);
  }, [internalIndex, n]);

  // Build cloned slides for rendering
  const clonedSlides = [
    slides[n - 1], // clone of last
    ...slides,
    slides[0], // clone of first
  ];

  // Touch handling (basic)
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaRef = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
    // pause transitions while dragging (optional)
    setTransitionEnabled(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const x = e.touches[0].clientX;
    touchDeltaRef.current = x - touchStartXRef.current;
    // apply drag transform directly for tactile feel
    if (rowRef.current) {
      const width = rowRef.current.clientWidth / (n + 2); // width of one slide frame
      const baseTranslate = -internalIndex * 100;
      const offsetPercent = (touchDeltaRef.current / width) * 100;
      (rowRef.current.style as any).transform = `translateX(${baseTranslate + offsetPercent}%)`;
    }
  };

  const onTouchEnd = () => {
    const delta = touchDeltaRef.current;
    touchStartXRef.current = null;
    touchDeltaRef.current = 0;
    // threshold ~ 50 px
    const THRESHOLD = 50;
    if (Math.abs(delta) > THRESHOLD) {
      if (delta < 0) next(); // swipe left -> next
      else prev(); // swipe right -> prev
    } else {
      // snap back to current slide
      setTransitionEnabled(true);
      setInternalIndex((i) => i); // trigger transform reset with transition
    }
  };

  // Apply transform style derived from internalIndex
  const transformStyle = { transform: `translateX(-${internalIndex * 100}%)` };
  const transitionClass = transitionEnabled ? "transition-transform duration-500 ease-in-out" : "";

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* header */}
      <div className="text-center mb-8"  onClick={() => (window.location.href = slides[activeIndex].link)}>
        <Image
          src={slides[activeIndex].logo}
          alt={`${slides[activeIndex].title} logo`}
          width={60}
          height={60}
          className="mx-auto mb-3 rounded-full shadow-2xl"
        />
        <h2 className="text-2xl font-semibold">{slides[activeIndex].title}</h2>
      </div>

      {/* slider */}
      <div
        className="relative flex items-center justify-center h-[60vh] w-full max-w-xl overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* left */}
        <button
          onClick={prev}
          className="hidden md:block lg:block absolute left-2 z-10 border rounded-full p-2 text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-900"
          aria-label="Previous slide"
        >
          ←
        </button>

        {/* slides row */}
        <div
          ref={rowRef}
          className={`flex ${transitionClass}`}
          style={transformStyle as React.CSSProperties}
        >
          {clonedSlides.map((slide, idx) => (
            <div
              key={idx}
              className="w-full shrink-0  flex justify-center cursor-pointer"
              onClick={() => (window.location.href = slide.link)}
            >
              <div className="relative w-[180px] h-[320px] sm:w-[282px] sm:h-[500px] lg:w-[281px] lg:h-[500px]">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  className="dark:bg-white object-contain cursor-pointer transition-shadow duration-300 ease-in-out shadow-lg hover:shadow-slate-700 hover:dark:shadow-black rounded-3xl"
                  sizes="(max-width: 500px) 200px, 400px"
                />
              </div>

            </div>
          ))}
        </div>

        {/* right */}
        <button
          onClick={next}
          className="hidden md:block lg:block absolute right-2 z-10 border rounded-full p-2 text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-900"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      {/* dots */}
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
