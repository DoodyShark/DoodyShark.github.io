import fs from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// No change to generateStaticParams()
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "src/md/blog");

  const folders = fs.readdirSync(postsDir, { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((f) => f.name);

  return folders.map((slug) => ({ slug }));
}

// Mark page as async
export default async function BlogReadPage({ params }: { params: { slug: string } }) {
  // Await params
  const { slug: folderName } = await params;

  const postsDir = path.join(process.cwd(), "src/md/blog", folderName);

  const cardPath = path.join(postsDir, "card.json");
  if (!fs.existsSync(cardPath)) return <p>File not found</p>;

  const card = JSON.parse(fs.readFileSync(cardPath, "utf-8")) as { link: string };
  const mdPath = path.join(process.cwd(), "src/md/blog", card.link);

  if (!fs.existsSync(mdPath)) return <p>Markdown file not found</p>;

  const fileContent = fs.readFileSync(mdPath, "utf-8");

  return <MarkdownRenderer content={fileContent} />;
}
