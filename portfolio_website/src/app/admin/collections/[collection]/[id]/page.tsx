import { requireAdminSession, CARD_COLLECTIONS } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import Link from "next/link";
import CardForm from "@/components/admin/CardForm";

type Params = { params: Promise<{ collection: string; id: string }> };

export default async function EditCardPage({ params }: Params) {
  await requireAdminSession();
  const { collection: collectionId, id } = await params;
  const meta = CARD_COLLECTIONS.find((c) => c.id === collectionId);
  if (!meta) notFound();

  const db = await getDb();
  const doc = await db.collection("cards").findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  const initial = { ...doc, _id: doc._id.toString() };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href={`/admin/collections/${collectionId}`} className="text-zinc-400 hover:text-white text-sm">
        ← Back to {meta.label}
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-8">Edit Item</h1>
      <CardForm
        collectionId={collectionId}
        collection={meta.collection}
        locale={meta.locale}
        hasBody={meta.hasBody}
        initial={initial}
        id={id}
      />
    </div>
  );
}
