import MarkdownCards from "@/components/MarkdownCards";

export default function CourseworkPageAr() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">المقررات الدراسية</h1>
      <h2 className="text-xl font-bold mb-6">مقررات الماجستير</h2>
      <MarkdownCards row_width={3} file="masters-courses.json" href_path="/ar/career/coursework/read"/>
      <h2 className="text-xl font-bold mt-6 mb-6">مقررات البكالوريوس</h2>
      <MarkdownCards row_width={3} file="bachelors-courses.json" href_path="/ar/career/coursework/read"/>
    </div>
  );
}
