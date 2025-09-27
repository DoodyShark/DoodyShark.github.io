"use client";

import { useState } from "react";

export default function CVPage() {
  const [pdfLoaded, setPdfLoaded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">My CV</h1>

      {/* Download button */}
      <a
        href="/pdf/cv.pdf"
        download
        className="mb-6 px-4 py-2 bg-purple-700 dark:bg-yellow-600 text-white rounded hover:bg-purple-400 hover:dark:bg-yellow-500 transition-colors"
      >
        Download CV
      </a>

      {/* PDF viewer */}
      <div className="w-full lg:w-200 h-[80vh] border rounded overflow-hidden">
        <iframe
          src="/pdf/cv.pdf"
          title="My CV"
          className="w-full h-full"
          onLoad={() => setPdfLoaded(true)}
        />
        {!pdfLoaded && <p className="text-center mt-4">Loading PDF...</p>}
      </div>
    </div>
  );
}
