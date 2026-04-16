import { requireAdminSession, CARD_COLLECTIONS } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function DashboardPage() {
  await requireAdminSession();
  const db = await getDb();

  const collectionCounts = await Promise.all(
    CARD_COLLECTIONS.map(async (c) => ({
      ...c,
      count: await db
        .collection("cards")
        .countDocuments({ collection: c.collection, locale: c.locale }),
    }))
  );

  const pubCount = await db.collection("publications").countDocuments({});

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Publications */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-zinc-300">Publications</h2>
        <Link
          href="/admin/publications"
          className="flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-4 transition-colors"
        >
          <span className="font-medium">Publications</span>
          <span className="text-zinc-400">{pubCount} items →</span>
        </Link>
      </section>

      {/* Card collections */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-300">Content Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {collectionCounts.map((c) => (
            <Link
              key={c.id}
              href={`/admin/collections/${c.id}`}
              className="flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-4 transition-colors"
            >
              <span className="font-medium">{c.label}</span>
              <span className="text-zinc-400">{c.count} items →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
