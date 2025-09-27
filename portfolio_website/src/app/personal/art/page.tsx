import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default function ArtPage() {
  return (
    <div className="w-full pt-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">Arts??</h1>

      {/* Full-width image */}
      <div className="relative h-50 w-full sm:h-130 mb-4">
        <Image
          src="/img/art_banner.png" // replace with your desired image
          alt="Art banner"
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      {/* Short description */}
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        I love to do art art. Yeah that's pretty much it
      </p>

      {/* Markdown cards */}
      <h2 className="text-xl font-bold mb-6">Illustration</h2>
      <MarkdownCards row_width={3} file="art/illustration.json" href_path="/personal/art/read"/>
      <h2 className="text-xl font-bold mb-6 mt-6">Sewing</h2>
      <MarkdownCards row_width={3} file="art/sewing.json" href_path="/personal/art/read"/>
      <h2 className="text-xl font-bold mb-6 mt-6">Painting</h2>
      <MarkdownCards row_width={3} file="art/painting.json" href_path="/personal/art/read"/>
    </div>
  );
}
