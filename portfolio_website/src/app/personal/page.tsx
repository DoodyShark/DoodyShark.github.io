"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PersonalAboutPage() {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleVideoEnd = () => {
    setShowOverlay(true);
  };

  return (
    <div className="space-y-12">
      {/* Video Intro */}
      <div className="relative w-full h-110">
        <video
          src="/mp4/personal_welcome.mp4" // your converted Live Photo video
          autoPlay
          muted
          onEnded={handleVideoEnd}
          className="w-full h-full rounded-b-xl object-cover"
        />

        {/* Overlay text at the bottom of the last frame */}
        {showOverlay && (
          <div className="absolute inset-0 flex flex-col justify-start items-center text-center text-slate-800 dark:text-slate-800 px-4 pt-7">
            <h1 className="hidden sm:block text-4xl font-bold">
              Hi! I&apos;m Dhiyaa Al Jorf!
            </h1>

            <h1 className="sm:hidden text-4xl font-bold">
              Hi!
            </h1>
          </div>
        )}

      </div>

      {/* Intro Section */}
      <section className="p-10 flex flex-col md:flex-row md:space-x-8 items-start">
        {/* Text */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold">About Me</h2>

          <span className="transition-colors text-gray-600 dark:text-gray-300">
            <p className="text-lg">
              Short personal intro — e.g. hobbies
            </p>
            <p className="mt-5">
              Anything more to add?
            </p>
          </span>
        </div>

        {/* Desktop photo */}
        <div className="hidden sm:block relative w-60 h-60 mt-6 md:mt-0">
          <Image
            src="/img/me_personal1.jpg"
            alt="Profile photo"
            fill
            className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0"
          />
          <Image
            src="/img/me_personal2.jpg"
            alt="Profile hover photo"
            fill
            className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100"
          />
        </div>
      </section>

      {/* Links Section */}
      <section className="p-10 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Personal Links</h2>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="https://instagram.com/doodlyfox"
              className="text-blue-400 hover:underline"
            >
              Instagram
            </Link>
          </li>
          <li>
            <Link
              href="https://scholar.google.com/citations?user=XXXX"
              className="text-blue-400 hover:underline"
            >
              Anything Else?
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
