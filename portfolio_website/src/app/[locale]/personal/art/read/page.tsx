import { Suspense } from "react";
import ReadClient from "@/components/ReadClient";

export default function ArtReadPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <ReadClient collection="art_illustration" locale_override="en" />
      </Suspense>
    </div>
  );
}
