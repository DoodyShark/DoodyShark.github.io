'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FlowerDrawer from './FlowerDrawer';

export default function FloatingGardenButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isCareer   = pathname.includes('/career');
  const isPersonal = pathname.includes('/personal');
  const endpoint   = isCareer ? '/api/drawings' : '/api/flowers';
  const label      = isCareer ? '✏️' : '🌸';
  const title      = isCareer ? 'Add a doodle to the garden' : 'Plant a flower in the garden';

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        title={title}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 active:scale-95 garden-btn-wiggle"
        style={{
          zIndex: 210,
          background: 'var(--m-surface)',
          border: '1.5px solid var(--m-border)',
          color: 'var(--m-text)',
        }}
      >
        {label}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 300 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
            style={{ background: 'var(--m-bg)', border: '1px solid var(--m-border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium" style={{ color: 'var(--m-text)' }}>
                {isCareer ? 'The Studio ✏️' : isPersonal ? 'The Garden 🌸' : 'The Garden 🌸'}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors text-sm"
                style={{ color: 'var(--m-text2)', border: '1px solid var(--m-border)' }}
              >
                ✕
              </button>
            </div>

            <p className="text-sm mb-5" style={{ color: 'var(--m-text2)' }}>
              {isCareer
                ? 'Doodle something career-related — it joins the background of these pages.'
                : 'Draw a flower — it joins the animated background of this page.'}
            </p>

            <FlowerDrawer apiEndpoint={endpoint} />
          </div>
        </div>
      )}
    </>
  );
}
