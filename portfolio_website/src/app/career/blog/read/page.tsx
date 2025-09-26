import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function BlogReadPage({
  searchParams,
}: {
  searchParams: { path?: string };
}) {
  if (!searchParams.path) {
    return <p>No post specified.</p>;
  }

  const filePath = path.join(process.cwd(), "src/md/blog", searchParams.path);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="p-6">
      <MarkdownRenderer content={fileContent} />
    </div>
  );
}
