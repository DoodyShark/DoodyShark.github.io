"use client";

import { useState } from "react";

export default function WelcomeVideo() {
  const [showOverlay, setShowOverlay] = useState(false);
  return (
    <div className="relative w-full h-110">
      <video
        src="/mp4/personal_welcome.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setShowOverlay(true)}
        className="w-full h-full rounded-b-xl object-cover"
      />
      {showOverlay && (
        <div className="absolute inset-0 flex flex-col justify-start items-center text-center px-4 pt-7">
          <h1 className="hidden sm:block text-4xl font-bold">Hi! I&apos;m Dhiyaa Al Jorf!</h1>
          <h1 className="sm:hidden text-4xl font-bold">Hi!</h1>
        </div>
      )}
    </div>
  );
}
