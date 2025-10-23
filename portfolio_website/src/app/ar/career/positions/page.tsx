import MarkdownCards from "@/components/MarkdownCards";

export default function PositionsPage() {
  return (
    <div className="min-w-50 sm:min-w-150 lg:min-w-250">
      <h1 className="text-3xl font-bold mb-6">المناصب</h1>
      <MarkdownCards row_width = {1} file="positions_ar.json" href_path="/ar/career/positions/read"/>
    </div>
  );
}
