'use client';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import DeleteCardButton from './DeleteCardButton';

interface CardDoc {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
}

function SortableCard({
  doc, collectionId, onDelete,
}: { doc: CardDoc; collectionId: string; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: doc._id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 'auto',
      }}
      className="flex justify-between items-center bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-4 select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          {...attributes}
          {...listeners}
          className="text-zinc-500 hover:text-zinc-200 cursor-grab active:cursor-grabbing flex-shrink-0 px-1 text-xl leading-none"
          title="Drag to reorder"
        >
          ⠿
        </span>
        <div className="min-w-0">
          <p className="font-medium truncate">{doc.title || doc.slug}</p>
          {doc.description && (
            <p className="text-zinc-400 text-sm mt-0.5 truncate max-w-sm">{doc.description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0 ml-3">
        <Link
          href={`/admin/collections/${collectionId}/${doc._id}`}
          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
        >
          Edit
        </Link>
        <DeleteCardButton id={doc._id} onDelete={onDelete} />
      </div>
    </div>
  );
}

interface Props {
  docs: CardDoc[];
  collectionId: string;
}

export default function SortableCardList({ docs: initialDocs, collectionId }: Props) {
  const [docs,   setDocs]   = useState(initialDocs);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const handleDelete = useCallback((id: string) => {
    setDocs(prev => prev.filter(d => d._id !== id));
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = docs.findIndex(d => d._id === active.id);
    const newIndex = docs.findIndex(d => d._id === over.id);
    const newDocs  = arrayMove(docs, oldIndex, newIndex);
    setDocs(newDocs);

    setSaving(true);
    await Promise.all(
      newDocs.map((doc, idx) =>
        fetch(`/api/content/${doc._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: idx }),
        })
      )
    );
    setSaving(false);
  }, [docs]);

  if (!docs.length) {
    return <p className="text-zinc-400">No items yet. Create your first one.</p>;
  }

  return (
    <div>
      {saving && (
        <p className="text-zinc-500 text-xs mb-3">Saving order…</p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={docs.map(d => d._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {docs.map(doc => (
              <SortableCard key={doc._id} doc={doc} collectionId={collectionId} onDelete={() => handleDelete(doc._id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
