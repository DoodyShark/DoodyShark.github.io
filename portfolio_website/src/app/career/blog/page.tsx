import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div className="w-full">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">Blog</h1>

      {/* Full-width image */}
      <div className="relative w-full h-50 sm:h-90 lg:h-130 mb-4">
        <Image
          src="/blog_banner.jpg" // replace with your desired image
          alt="Blog banner"
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Short description */}
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Here is where I like to share my professional opinions, paper reviews, and other thoughts.
      </p>

      {/* Markdown cards */}
      <MarkdownCards row_width={2} file="blog.json" href_path="/career/blog/read"/>
    </div>
  );
}
