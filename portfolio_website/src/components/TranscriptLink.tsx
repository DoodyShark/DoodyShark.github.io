"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import type { TranscriptKey } from "@/lib/transcripts";

// Renders a "Transcript" pill linking to the PDF stored under `pageKey`,
// or nothing if no transcript has been set in the admin.
export default function TranscriptLink({ pageKey, label }: { pageKey: TranscriptKey; label: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch(`/api/page-content?page=${pageKey}&locale=en`)
      .then((r) => r.json())
      .then((data) => setUrl(data?.body?.trim() ?? ""))
      .catch(() => {});
  }, [pageKey]);

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-opacity hover:opacity-85"
      style={{ background: "var(--m-teal)", color: "white" }}
    >
      <FileText size={14} aria-hidden />
      {label}
    </a>
  );
}
