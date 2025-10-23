import MarkdownCards from "@/components/MarkdownCards";
import Image from "next/image";

export default function FoodPage() {
  return (
    <div className="w-full pt-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">Food</h1>

      {/* Full-width image */}
      <div className="relative h-50 w-80 sm:w-200 lg:w-200 sm:h-180  mb-4">
        <Image
          src="/img/food_banner.jpg" // replace with your desired image
          alt="Food banner"
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      {/* Short description */}
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        A little digital recipe book of sorts :{")"}
      </p>

      {/* Markdown cards */}
      <h2 className="text-xl font-bold mb-6">Arabic</h2>
      <MarkdownCards row_width={3} file="food/arabic.json" href_path="/personal/food/read"/>
      <h2 className="text-xl font-bold mb-6 mt-6">Desserts</h2>
      <MarkdownCards row_width={3} file="food/dessert.json" href_path="/personal/food/read"/>
    </div>
  );
}
