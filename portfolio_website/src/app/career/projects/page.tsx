import MarkdownCards from "@/components/MarkdownCards";

export default function ProjectsPage() {
  return (
    <div className="min-w-50 sm:min-w-150 lg:min-w-250">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      
      {/* Short description */}
      
      <MarkdownCards row_width = {3} file="projects.json" href_path="/career/projects/read"/>
    </div>
  );
}
