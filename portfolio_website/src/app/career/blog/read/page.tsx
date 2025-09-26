"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function BlogReadPage() {
  const searchParams = useSearchParams();
  const postSlug = searchParams.get("post");
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!postSlug) return;

    fetch(`/md/blog/${postSlug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Markdown not found");
        return res.text();
      })
      .then(setContent)
      .catch(() => setContent("Markdown file not found."));
  }, [postSlug]);

  if (!postSlug) return <p>No post specified.</p>;
  if (!content) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <MarkdownRenderer content={content} />
    </div>
  );
}
