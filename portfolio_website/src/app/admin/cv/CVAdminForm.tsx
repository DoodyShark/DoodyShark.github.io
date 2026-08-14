'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CVAdminForm({ currentUrl }: { currentUrl: string }) {
  const [url,       setUrl]       = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const res  = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/page-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'cv-url', locale: 'en', body: url }),
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Current CV URL</label>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="/pdf/cv.pdf"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm focus:outline-none focus:border-zinc-400"
        />
        <p className="text-xs text-zinc-500 mt-1">
          You can paste a URL directly or upload a file below.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Upload new PDF</label>
        <label className="inline-flex cursor-pointer px-3 py-2 bg-zinc-700 hover:bg-zinc-600 border border-zinc-500 rounded text-sm transition-colors">
          {uploading ? 'Uploading…' : '📎 Choose PDF file'}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={uploading}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.currentTarget.value = '';
            }}
          />
        </label>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200">
          ← Dashboard
        </Link>
        {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
      </div>
    </div>
  );
}
