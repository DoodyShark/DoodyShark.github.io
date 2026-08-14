'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Point  { x: number; y: number }
interface Stroke { points: Point[]; color: string; width: number }
interface Drawing { _id: string; createdAt: string; strokes: Stroke[] }

function DrawingThumb({ strokes }: { strokes: Stroke[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, 80, 80);
    for (const st of strokes) {
      if (st.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = st.color;
      ctx.lineWidth   = Math.max(0.5, st.width * (80 / 400));
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.moveTo(st.points[0].x * 80, st.points[0].y * 80);
      for (let i = 1; i < st.points.length; i++) {
        ctx.lineTo(st.points[i].x * 80, st.points[i].y * 80);
      }
      ctx.stroke();
    }
  }, [strokes]);
  return (
    <canvas
      ref={ref} width={80} height={80}
      className="rounded-lg border"
      style={{ background: '#f5f2ee', borderColor: '#cec7bb' }}
    />
  );
}

function DrawingGrid({
  title, items, apiBase, onDelete,
}: {
  title: string;
  items: Drawing[];
  apiBase: string;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this drawing?')) return;
    setDeleting(id);
    await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    onDelete(id);
    setDeleting(null);
  };

  if (!items.length) return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <p className="text-sm text-gray-500">No drawings yet.</p>
    </section>
  );

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title} <span className="text-sm font-normal text-gray-500">({items.length})</span></h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
        {items.map(d => (
          <div key={d._id} className="flex flex-col gap-1 items-center">
            <DrawingThumb strokes={d.strokes} />
            <span className="text-[10px] text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</span>
            <button
              onClick={() => handleDelete(d._id)}
              disabled={deleting === d._id}
              className="text-[11px] text-red-500 hover:text-red-700 disabled:opacity-40"
            >
              {deleting === d._id ? '…' : 'Remove'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function GardenAdminPage() {
  const router = useRouter();
  const [flowers,  setFlowers]  = useState<Drawing[]>([]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/flowers').then(r => r.json()),
      fetch('/api/drawings').then(r => r.json()),
    ]).then(([f, d]) => {
      setFlowers(f);
      setDrawings(d);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Garden Moderation</h1>
        <button onClick={() => router.push('/admin/dashboard')} className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <>
          <DrawingGrid
            title="🌸 Flowers (Personal Garden)"
            items={flowers}
            apiBase="/api/flowers"
            onDelete={id => setFlowers(f => f.filter(x => x._id !== id))}
          />
          <DrawingGrid
            title="✏️ Doodles (Career Studio)"
            items={drawings}
            apiBase="/api/drawings"
            onDelete={id => setDrawings(d => d.filter(x => x._id !== id))}
          />
        </>
      )}
    </div>
  );
}
