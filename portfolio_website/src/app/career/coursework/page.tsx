import MarkdownCards from "@/components/MarkdownCards";

export default function CourseworkPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Coursework</h1>
      <h2 className="text-xl font-bold mb-6">Master&apos;s Coursework</h2>
      <MarkdownCards row_width = {3} file="masters-courses.json" href_path="/career/coursework/read"/>
      <h2 className="text-xl font-bold mt-6 mb-6">Bachelor&apos;s Coursework</h2>
      <MarkdownCards row_width = {3} file="bachelors-courses.json" href_path="/career/coursework/read"/>
    </div>
  );
}
