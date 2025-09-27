// app/ar/career/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function CareerAboutPageAr() {
  return (
    <div dir="rtl" className="space-y-12 p-0">
      {/* Intro Section */}
      <section className="flex flex-col md:flex-row items-start">

        {/* النص */}
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">ضياء الجرف</h1>

          {/* صورة للأجهزة الصغيرة */}
          <div className="sm:hidden relative w-48 h-64 mt-6 md:mt-0">
            <Image
              src="/me1_flipped.png"
              alt="صورة شخصية"
              fill
              className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0"
            />
            <Image
              src="/me2_flipped.png"
              alt="صورة بديلة"
              fill
              className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100"
            />
          </div>

          <span className="transition-colors text-gray-600 dark:text-gray-300">
            <p className="text-lg">
              مقدمة مهنية قصيرة — مثل دورك الحالي، مجال بحثك، أو ما أنت شغوف به.
              يمكنك التوسع ببعض الجمل كما في النسخة الإنجليزية.
            </p>
            <p className="mt-5">
              أضف المزيد من التفاصيل حول مجالات عملك/بحثك. ربما نقطتين أو ثلاث
              تلخص تركيزك.
            </p>
          </span>
        </div>

        
        {/* الصورة (على اليسار في الشاشات الكبيرة) */}
        <div className="hidden sm:block relative w-48 h-64 mt-6 md:mt-0">
          <Image
            src="/me1_flipped.png"
            alt="صورة شخصية"
            fill
            className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0"
          />
          <Image
            src="/me2_flipped.png"
            alt="صورة بديلة"
            fill
            className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100"
          />
        </div>
      </section>

      {/* قسم الأخبار */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">الأخبار</h2>
        <ul className="space-y-4">
          <li>
            <span className="font-bold">٢٨ أغسطس ٢٠٢٥ –</span> سأقوم بالتدريس في
            برنامج تعليم تنفيذي في أكسفورد لوفد من كوريا الجنوبية!
          </li>
          <li>
            <span className="font-bold">١٤ يونيو ٢٠٢٥ –</span> دعم برنامج
            المسؤولين التنفيذيين للذكاء الاصطناعي ٢٠٢٥، وهو برنامج تديره حكومة
            الإمارات.
          </li>
        </ul>
      </section>

      {/* قسم الروابط */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">روابط</h2>
        <ul className="flex space-x-reverse space-x-6">
          <li>
            <Link
              href="https://github.com/DoodyShark"
              className="text-blue-400 hover:underline"
            >
              GitHub
            </Link>
          </li>
          <li>
            <Link
              href="https://scholar.google.com/citations?user=XXXX"
              className="text-blue-400 hover:underline"
            >
              Google Scholar
            </Link>
          </li>
          <li>
            <Link
              href="https://linkedin.com/in/dhiyaa-al-jorf"
              className="text-blue-400 hover:underline"
            >
              LinkedIn
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
