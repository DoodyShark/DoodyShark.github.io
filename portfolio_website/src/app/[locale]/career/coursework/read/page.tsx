import { Suspense } from "react";
import ReadClient from "@/components/ReadClient";

export default function CourseworkReadPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <ReadClient collection="coursework_masters" locale_override="en" />
      </Suspense>
    </div>
  );
}
