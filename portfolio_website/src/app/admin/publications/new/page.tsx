import { requireAdminSession } from "@/lib/admin";
import Link from "next/link";
import PubForm from "@/components/admin/PubForm";

export default async function NewPubPage() {
  await requireAdminSession();
  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/admin/publications" className="text-zinc-400 hover:text-white text-sm">← Publications</Link>
      <h1 className="text-2xl font-bold mt-2 mb-8">New Publication</h1>
      <PubForm />
    </div>
  );
}
