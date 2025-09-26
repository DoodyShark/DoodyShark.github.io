import fs from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "src/md/blog");

  // Get all folder names
  const folders = fs.readdirSync(postsDir, { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((f) => f.name);

  return folders.map((slug) => ({ slug }));
}

// Synchronous page for static export
export default function BlogReadPage({ params }: { params: { slug: string } }) {
  const folderName = params.slug; // no await

  const postsDir = path.join(process.cwd(), "src/md/blog", folderName);

  const cardPath = path.join(postsDir, "card.json");
  if (!fs.existsSync(cardPath)) return <p>File not found</p>;

  const card = JSON.parse(fs.readFileSync(cardPath, "utf-8")) as { link: string };
  const mdPath = path.join(process.cwd(), "src/md/blog", card.link);

  if (!fs.existsSync(mdPath)) return <p>Markdown file not found</p>;

  const fileContent = fs.readFileSync(mdPath, "utf-8");

  return <MarkdownRenderer content={fileContent} />;
}
