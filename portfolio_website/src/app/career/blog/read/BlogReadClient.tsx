"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function BlogReadClient() {
  const searchParams = useSearchParams();
  const postSlug = searchParams.get("post");

  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postSlug) return;

    fetch(`/md/blog/${postSlug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Markdown not found");
        return res.text();
      })
      .then((text) => setContent(text))
      .catch(() => setContent("Markdown file not found."))
      .finally(() => setLoading(false));
  }, [postSlug]);

  if (!postSlug) return <p>No post specified.</p>;
  if (loading) return <p>Loading...</p>;

  return <MarkdownRenderer content={content!} />;
}
