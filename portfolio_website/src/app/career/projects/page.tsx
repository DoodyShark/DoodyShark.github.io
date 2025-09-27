import MarkdownCards from "@/components/MarkdownCards";

export default function ProjectsPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <MarkdownCards row_width = {3} file="projects.json" href_path="/career/projects/read"/>
    </div>
  );
}
