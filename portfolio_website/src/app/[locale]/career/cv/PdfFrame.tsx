"use client";

import { useState } from "react";

export default function PdfFrame({ src, loadingText }: { src: string; loadingText: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full h-[80vh] rounded overflow-hidden" style={{ border: "1px solid var(--m-border)" }}>
      <iframe src={src} title="CV" className="w-full h-full" onLoad={() => setLoaded(true)} />
      {!loaded && <p className="text-center mt-4" style={{ color: "var(--m-text2)" }}>{loadingText}</p>}
    </div>
  );
}
