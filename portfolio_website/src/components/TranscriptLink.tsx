import { FileText } from "lucide-react";
import { getPageUrl } from "@/lib/data";
import type { TranscriptKey } from "@/lib/transcripts";

// Server component: a "Transcript" pill linking to the PDF stored under `pageKey`,
// or nothing if no transcript has been set in the admin.
export default async function TranscriptLink({ pageKey, label }: { pageKey: TranscriptKey; label: string }) {
  const url = await getPageUrl(pageKey);
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
