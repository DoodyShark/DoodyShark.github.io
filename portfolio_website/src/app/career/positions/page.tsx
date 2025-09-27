import MarkdownCards from "@/components/MarkdownCards";

export default function PositionsPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Positions</h1>
      <MarkdownCards row_width = {1} file="positions.json" href_path="/career/positions/read"/>
    </div>
  );
}
