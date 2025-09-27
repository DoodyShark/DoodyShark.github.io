import MarkdownCards from "@/components/MarkdownCards";

export default function ProjectsPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">مشاريعي</h1>
      <MarkdownCards row_width = {3} file="projects_ar.json" href_path="/ar/career/projects/read"/>
    </div>
  );
}
