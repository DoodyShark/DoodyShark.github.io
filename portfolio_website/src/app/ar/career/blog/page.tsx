import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default function BlogPageAr() {
  return (
    <div dir="rtl" className="w-full">
      {/* العنوان */}
      <h1 className="text-3xl font-bold mb-4 text-center">مدونتي</h1>

      {/* صورة بعرض كامل */}
      <div className="relative w-full h-130 mb-4">
        <Image
          src="/blog_banner.jpg" // استبدل بالصورة المطلوبة
          alt="بانر المدونة"
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* وصف قصير */}
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        هنا أحب أن أشارك فيه آرائي المهنية، مراجعات الأوراق العلمية، وأفكار أخرى.
      </p>

      {/* بطاقات Markdown */}
      <MarkdownCards row_width={3} file="blog_ar.json" href_path="/ar/career/blog/read"/>
    </div>
  );
}
