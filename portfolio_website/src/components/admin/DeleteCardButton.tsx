"use client";

import { useRouter } from "next/navigation";

export default function DeleteCardButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/content/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1.5 bg-red-900 hover:bg-red-800 rounded-lg text-sm transition-colors"
    >
      Delete
    </button>
  );
}
