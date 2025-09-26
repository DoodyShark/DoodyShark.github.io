import fs from "fs";
import path from "path";
import React from "react";

interface ReadPageProps {
  searchParams: {
    path?: string;
  };
}

export default function BlogReadPage({ searchParams }: ReadPageProps) {
  const filePath = searchParams?.path;

  if (!filePath) return <div>No post selected</div>;

  // Example: read markdown from your blog folder
  const fullPath = path.join(process.cwd(), "src/md/blog", filePath);
  const markdown = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf-8") : "File not found";

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">{filePath}</h1>
      <pre className="whitespace-pre-wrap">{markdown}</pre>
    </div>
  );
}
