import { Suspense } from "react";
import ReadClient from "@/components/ReadClient";

export default function FoodReadPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <ReadClient locale_override="en" />
      </Suspense>
    </div>
  );
}
