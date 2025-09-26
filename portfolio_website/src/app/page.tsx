"use client";

import { useState } from "react";
import Image from "next/image";

type Slide = {
  title: string;
  img: string;
  logo: string;
  link: string;
};

const slides: Slide[] = [
  {
    title: "personal",
    img: "/personal.jpg",
    logo: "/DoodlyFox.png",
    link: "/art",
  },
  {
    title: "career",
    img: "/career.jpg",
    logo: "/DoodyShark.png",
    link: "/career",
  },
  // {
  //   title: "food",
  //   img: "/food.png",
  //   logo: "/FoodieFrog.png",
  //   link: "/food",
  // },
];

export default function Home() {
  const [active, setActive] = useState(1);

  const prevSlide = () => setActive((p) => (p === 0 ? slides.length - 1 : p - 1));
  const nextSlide = () => setActive((p) => (p === slides.length - 1 ? 0 : p + 1));

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      nextSlide(); // swipe left
    }
    if (touchEndX - touchStartX > 50) {
      prevSlide(); // swipe right
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Section header */}
      <div className="text-center mb-8">
        <Image
          src={slides[active].logo}
          alt={`${slides[active].title} logo`}
          width={60}
          height={60}
          className="mx-auto mb-3 rounded-full shadow-2xl"
        />
        <h2 className="text-2xl font-semibold">{slides[active].title}</h2>
      </div>

      {/* Slider with arrows beside */}
      <div
        className="flex items-center justify-center gap-4 h-[60vh] w-full max-w-xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left arrow */}
        <button
          onClick={prevSlide}
          className="items-center border solid rounded-full p-2 text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-900"
        >
          ←
        </button>

        {/* Active slide */}
        <div
          className="cursor-pointer"
          onClick={() => (window.location.href = slides[active].link)}
        >
          <Image
            src={slides[active].img}
            alt={slides[active].title}
            width={300}
            height={400}
            className="p-3 bg-black dark:bg-white object-contain cursor-pointer transition-shadow duration-300 ease-in-out shadow-l hover:shadow-slate-700 hover:shadow-2xl rounded-full"
          />
        </div>

        {/* Right arrow */}
        <button
          onClick={nextSlide}
          className="items-center border solid rounded-full p-2 text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-900"
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              i === active ? "bg-gray-800 dark:bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
