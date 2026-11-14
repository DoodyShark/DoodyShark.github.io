'use client';
import { useState } from 'react';

// Stores a PDF URL in page_content under `pageKey` (locale 'en').
// Used by the CV and transcript admin pages.
export default function PdfUrlForm({
  pageKey,
  currentUrl,
  label = 'Current URL',
  placeholder = '',
  allowClear = false,
}: {
  pageKey: string;
  currentUrl: string;
  label?: string;
  placeholder?: string;
  allowClear?: boolean;
}) {
  const [url,       setUrl]       = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    setSaved(false);
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

  const save = async (value: string) => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pageKey, locale: 'en', body: value }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Save failed');
      setUrl(value);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">{label}</label>
        <input
          type="text"
          value={url}
          onChange={e => { setUrl(e.target.value); setSaved(false); }}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm focus:outline-none focus:border-zinc-400"
        />
        <p className="text-xs text-zinc-500 mt-1">
          You can paste a URL directly or upload a file below.
          {url.trim() && (
            <> <a href={url.trim()} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-300">Preview ↗</a></>
          )}
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
          onClick={() => save(url.trim())}
          disabled={saving || uploading}
          className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {allowClear && (
          <button
            onClick={() => save('')}
            disabled={saving || uploading || !currentUrl && !url}
            className="px-4 py-2 text-sm text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-40"
          >
            Remove
          </button>
        )}
        {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
      </div>
    </div>
  );
}
