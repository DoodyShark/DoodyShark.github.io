'use client';
import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (url: string, blurDataURL?: string) => void;
  label?: string;
}

export default function ImageUploadField({ value, onChange, label = 'Image' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      onChange(data.url, data.blurDataURL);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>

      {value && (
        <div className="mb-2 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-16 w-16 object-cover rounded border border-zinc-600" />
          <button
            type="button"
            onClick={() => onChange('', undefined)}
            className="text-xs text-zinc-500 hover:text-red-400"
          >
            ✕ Remove
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 border border-zinc-500 rounded text-sm transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : '📎 Upload image'}
        </button>
        {!value && !uploading && (
          <span className="text-xs text-zinc-600">or drag and drop onto the button</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = '';
        }}
      />

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
