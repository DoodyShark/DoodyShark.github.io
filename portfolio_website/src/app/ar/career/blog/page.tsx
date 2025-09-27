import MarkdownCards from "@/components/MarkdownCards";

export default function BlogPageAr() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">مدونتي</h1>
      <MarkdownCards row_width = {3} file="blog_ar.json" href_path="/ar/career/blog/read"/>
    </div>
  );
}
