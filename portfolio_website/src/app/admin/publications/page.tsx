import { requireAdminSession } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";
import Link from "next/link";
import DeletePubButton from "@/components/admin/DeletePubButton";

export default async function PublicationsAdminPage() {
  await requireAdminSession();
  const db = await getDb();
  const pubs = await db.collection("publications").find({}).sort({ year: -1 }).toArray();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/dashboard" className="text-zinc-400 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-2xl font-bold mt-1">Publications</h1>
        </div>
        <Link
          href="/admin/publications/new"
          className="px-4 py-2 bg-teal-700 hover:bg-teal-600 rounded-lg font-medium transition-colors"
        >
          + New Publication
        </Link>
      </div>

      {pubs.length === 0 ? (
        <p className="text-zinc-400">No publications yet.</p>
      ) : (
        <div className="space-y-3">
          {pubs.map((pub) => (
            <div
              key={pub._id.toString()}
              className="flex justify-between items-start bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4"
            >
              <div>
                <p className="font-medium">{pub.title}</p>
                <p className="text-zinc-400 text-sm mt-0.5">{pub.authors} · {pub.year}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <Link
                  href={`/admin/publications/${pub._id.toString()}`}
                  className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
                >
                  Edit
                </Link>
                <DeletePubButton id={pub._id.toString()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
