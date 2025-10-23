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
          <p className="text-lg mb-3">
            I’m a researcher and educator exploring <b>Causal Learning</b> and  
            <b>Uncertainty Quantification</b>, with applications in rehabilitation 
            engineering and trustworthy AI. I’m currently pursuing an <b>MSc in 
            Computer Science</b> at <i>ETH Zürich</i>, specializing in Machine Intelligence, 
            and working as a Teaching Assistant in the <i>MAS in Artificial Intelligence 
            and Digital Technology (MAS AID) program</i>, where I help develop and deliver 
            project-based AI courses.
          </p>
          <p className="text-lg mb-3">
            My research focuses on making machine learning models interpretable, 
            reliable, and human-centered, particularly in assistive and clinical 
            contexts. I’m also deeply interested in education and curriculum design, 
            having co-developed and taught AI executive programs with the <i>Oxford Centre for 
            Artificial Intelligence</i> and the <i>UAE Office of Artificial Intelligence</i>.
          </p>
          <span className="mt-5">
            
            <b>Research & Work Interests</b>
            <ul className="list-disc" suppressHydrationWarning>
              <li>Causal and Uncertainty-Aware Learning: Developing robust models that reason about cause, effect, and confidence, with a focus on safety-critical domains like healthcare and rehabilitation.</li>

              <li>AI for Rehabilitation Engineering: Using multimodal and physiological data (e.g., EMG, vision) to design intuitive, reliable control systems for assistive and prosthetic devices.</li>

              <li>AI Education & Curriculum Design: Creating interdisciplinary programs that empower learners to engage with AI responsibly and creatively.</li>
            </ul>
          </span>
          </span>
        </div>

        {/* Photo with hover swap */}
        <div className="hidden sm:block relative w-48 h-64 p-10 mt-6 md:mt-20">
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
        <div className="space-y-2 mt-57">
            <p>
              <a href="mailto:da2863@nyu.edu" className="text-blue-400 hover:underline">da2863@nyu.edu</a>
            </p>
            <p>
              <a href="mailto:daljorf@ethz.ch" className="text-blue-400 hover:underline">daljorf@ethz.ch</a>
            </p>
        </div>
        </div>
      </section>

      {/* News Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">News</h2>
        <ul className="space-y-4">
          <li>
            <span className="font-bold">Sept 20, 2025 –</span> Joined the MAS in Artificial Intelligence
            and Digitical Technology (MASAID) program as a Teacher Assistant co-developing materials
            for the AI Project course which I will help deliver in the Spring semester
          </li>
          <li>
            <span className="font-bold">Sept 15, 2025 –</span> First day at my MSc in CS program at ETH Zürich
          </li>
          <li>
            <span className="font-bold">Aug 28, 2025 –</span> I will be co-developing
            an executive education program in Oxford to a delegation from
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
              href="https://scholar.google.com/citations?user=IDT0Nj0AAAAJ&hl=en"
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
