import { requireAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import PubForm from "@/components/admin/PubForm";

export default async function EditPubPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const db = await getDb();
  const doc = await db.collection("publications").findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/admin/publications" className="text-zinc-400 hover:text-white text-sm">← Publications</Link>
      <h1 className="text-2xl font-bold mt-2 mb-8">Edit Publication</h1>
      <PubForm initial={{ ...doc, _id: doc._id.toString() }} id={id} />
    </div>
  );
}
