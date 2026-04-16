import { requireAdminSession, CARD_COLLECTIONS } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteCardButton from "@/components/admin/DeleteCardButton";

type Params = { params: Promise<{ collection: string }> };

export default async function CollectionPage({ params }: Params) {
  await requireAdminSession();
  const { collection: collectionId } = await params;
  const meta = CARD_COLLECTIONS.find((c) => c.id === collectionId);
  if (!meta) notFound();

  const db = await getDb();
  const docs = await db
    .collection("cards")
    .find({ collection: meta.collection, locale: meta.locale }, { projection: { body: 0 } })
    .sort({ order: 1 })
    .toArray();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/dashboard" className="text-zinc-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-2xl font-bold mt-1">{meta.label}</h1>
        </div>
        <Link
          href={`/admin/collections/${collectionId}/new`}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-600 rounded-lg font-medium transition-colors"
        >
          + New Item
        </Link>
      </div>

      {docs.length === 0 ? (
        <p className="text-zinc-400">No items yet. Create your first one.</p>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div
              key={doc._id.toString()}
              className="flex justify-between items-center bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4"
            >
              <div>
                <p className="font-medium">{doc.title || doc.slug}</p>
                {doc.description && (
                  <p className="text-zinc-400 text-sm mt-0.5 truncate max-w-md">{doc.description}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/collections/${collectionId}/${doc._id.toString()}`}
                  className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
                >
                  Edit
                </Link>
                <DeleteCardButton id={doc._id.toString()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
