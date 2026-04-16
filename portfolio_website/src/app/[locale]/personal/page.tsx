"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function PersonalAboutPage() {
  const t = useTranslations("personal.about");
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="space-y-12">
      {/* Video Intro */}
      <div className="relative w-full h-110">
        <video
          src="/mp4/personal_welcome.mp4"
          autoPlay
          muted
          onEnded={() => setShowOverlay(true)}
          className="w-full h-full rounded-b-xl object-cover"
        />
        {showOverlay && (
          <div className="absolute inset-0 flex flex-col justify-start items-center text-center text-slate-800 dark:text-slate-800 px-4 pt-7">
            <h1 className="hidden sm:block text-4xl font-bold">Hi! I&apos;m Dhiyaa Al Jorf!</h1>
            <h1 className="sm:hidden text-4xl font-bold">Hi!</h1>
          </div>
        )}
      </div>

      {/* About */}
      <section className="flex flex-col md:flex-row md:space-x-8 items-start">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <span className="text-stone-600 dark:text-stone-300 block">
            <p className="text-lg">Short personal intro — e.g. hobbies</p>
            <p className="mt-5">Anything more to add?</p>
          </span>
        </div>
        <div className="hidden sm:block relative w-60 h-60 mt-6 md:mt-0">
          <Image src="/img/me_personal1.jpg" alt="Profile photo" fill className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0" />
          <Image src="/img/me_personal2.jpg" alt="Profile hover" fill className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
        </div>
      </section>

      {/* Links */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t("linksTitle")}</h2>
        <ul className="flex gap-6">
          <li>
            <Link href="https://instagram.com/doodlyfox" className="text-teal-600 dark:text-teal-400 hover:underline">
              Instagram
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
