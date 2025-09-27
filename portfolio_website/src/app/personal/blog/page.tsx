import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div className="w-full pt-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">Personal Blog</h1>

      {/* Full-width image */}
      <div className="relative h-50 w-full sm:h-130 mb-4">
        <Image
          src="/img/personal_blog_banner.jpg" // replace with your desired image
          alt="Blog banner"
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      {/* Short description */}
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Maybe a diary? Or a field log? Idk :P
      </p>

      {/* Markdown cards */}
      <MarkdownCards row_width={3} file="blog_personal.json" href_path="/personal/blog/read"/>
    </div>
  );
}
