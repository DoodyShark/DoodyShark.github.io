// app/career/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function CareerAboutPage() {
  return (
    <div className="space-y-12">
      {/* Intro Section */}
      <section className="flex flex-col md:flex-row md:space-x-8 items-start">
        {/* Text */}

        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">Dhiyaa Al Jorf</h1>

          {/* Photo with hover swap */}
        <div className="sm:hidden items-center relative w-48 h-64 mt-6 md:mt-0">
          <Image
            src="/me1.png" // first image
            alt="Profile photo"
            fill
            className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0"
          />
          <Image
            src="/me2.png" // second image
            alt="Profile hover photo"
            fill
            className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100"
          />
        </div>
          <span className="transition-colors text-gray-600 dark:text-gray-300">
          <p className="text-lg">
            Short professional intro — e.g. your current role, research focus, or
            what you’re passionate about. Expand with a couple of sentences like
            in your screenshot.
          </p>
          <p className="mt-5">
            Add more detail about your research/work areas. Maybe 2–3 bullet
            points or short paragraphs summarizing your focus.
          </p>
          </span>
        </div>

        {/* Photo with hover swap */}
        <div className="hidden sm:block relative w-48 h-64 mt-6 md:mt-0">
          <Image
            src="/me1.png" // first image
            alt="Profile photo"
            fill
            className="object-cover rounded-lg transition-opacity duration-300 hover:opacity-0"
          />
          <Image
            src="/me2.png" // second image
            alt="Profile hover photo"
            fill
            className="object-cover rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100"
          />
        </div>
      </section>

      {/* News Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">News</h2>
        <ul className="space-y-4">
          <li>
            <span className="font-bold">Aug 28, 2025 –</span> I will be teaching
            on an executive education program in Oxford to a delegation from
            South Korea!
          </li>
          <li>
            <span className="font-bold">Jun 14, 2025 –</span> Supporting the UAE
            Chief Artificial Intelligence Officers Program 2025, an executive
            education program managed by the UAE Government.
          </li>
        </ul>
      </section>

      {/* Links Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Links</h2>
        <ul className="flex space-x-6">
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
