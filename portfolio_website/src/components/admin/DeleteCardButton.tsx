"use client";

import { useRouter } from "next/navigation";

export default function DeleteCardButton({ id, onDelete }: { id: string; onDelete?: () => void }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/content/${id}`, { method: "DELETE" });
    if (onDelete) {
      onDelete();         // immediate local removal — no refresh needed
    } else {
      router.refresh();   // fallback for standalone usage
    }
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
