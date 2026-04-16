import { requireAdminSession, CARD_COLLECTIONS } from "@/lib/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import CardForm from "@/components/admin/CardForm";

type Params = { params: Promise<{ collection: string }> };

export default async function NewCardPage({ params }: Params) {
  await requireAdminSession();
  const { collection: collectionId } = await params;
  const meta = CARD_COLLECTIONS.find((c) => c.id === collectionId);
  if (!meta) notFound();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href={`/admin/collections/${collectionId}`} className="text-zinc-400 hover:text-white text-sm">
        ← Back to {meta.label}
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-8">New Item</h1>
      <CardForm
        collectionId={collectionId}
        collection={meta.collection}
        locale={meta.locale}
        hasBody={meta.hasBody}
      />
    </div>
  );
}
