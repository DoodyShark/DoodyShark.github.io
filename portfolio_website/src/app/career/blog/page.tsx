import MarkdownCards from "@/components/MarkdownCards";

export default function BlogPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <MarkdownCards row_width = {3} file="blog.json" href_path="/career/blog/read"/>
    </div>
  );
}
