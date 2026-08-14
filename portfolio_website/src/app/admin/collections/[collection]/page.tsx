import { requireAdminSession, getCollectionMeta } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import SortableCardList from "@/components/admin/SortableCardList";
import SectionTitleEditor from "@/components/admin/SectionTitleEditor";

type Params = { params: Promise<{ collection: string }> };

export default async function CollectionPage({ params }: Params) {
  await requireAdminSession();
  const { collection: collectionId } = await params;
  const meta = await getCollectionMeta(collectionId);
  if (!meta) notFound();

  const db = await getDb();
  const docs = await db
    .collection("cards")
    .find({ collection: meta.collection, locale: meta.locale }, { projection: { body: 0 } })
    .sort({ order: 1 })
    .toArray();

  // Check if this collection has an editable section_def (art/food sections)
  const sectionDef = await db.collection('section_defs').findOne({ key: collectionId });
  const sectionDefClean = sectionDef
    ? { key: sectionDef.key as string, label: sectionDef.label as string, labelAr: (sectionDef.labelAr ?? '') as string }
    : null;

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

      {sectionDefClean && (
        <SectionTitleEditor
          sectionKey={sectionDefClean.key}
          initialLabel={sectionDefClean.label}
          initialLabelAr={sectionDefClean.labelAr}
        />
      )}
      <p className="text-zinc-500 text-xs mb-4">Drag ⠿ to reorder items.</p>
      <SortableCardList
        docs={docs.map(d => ({
          _id: d._id.toString(),
          title: d.title,
          slug: d.slug,
          description: d.description,
        }))}
        collectionId={collectionId}
      />
    </div>
  );
}
