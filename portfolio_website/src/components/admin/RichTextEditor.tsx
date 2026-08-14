'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { Markdown } from 'tiptap-markdown';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

type Btn = { label: string; title: string; action: () => void; active?: boolean };

function ToolBtn({ label, title, action, active }: Btn) {
  return (
    <button type="button" title={title} onMouseDown={e => { e.preventDefault(); action(); }}
      className="px-2 py-1 rounded text-xs font-medium transition-colors select-none"
      style={{ background: active ? '#52525b' : 'transparent', color: active ? '#f4f4f5' : '#a1a1aa', border: 'none', cursor: 'pointer' }}>
      {label}
    </button>
  );
}
function Sep() {
  return <span style={{ width: 1, height: 18, background: '#3f3f46', display: 'inline-block', margin: '0 4px', verticalAlign: 'middle' }} />;
}

export default function RichTextEditor({ value, onChange }: Props) {
  // Prevent the sync useEffect from overwriting programmatic inserts (e.g. image upload)
  const skipSync     = useRef(false);
  // Suppress onUpdate during programmatic setContent so we control onChange ourselves
  const suppressUpd  = useRef(false);
  const imgInputRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imgError,  setImgError]  = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({ html: true }),
      TextStyle,
      Color,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      if (suppressUpd.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange((editor.storage as any).markdown.getMarkdown());
    },
    editorProps: { attributes: { class: 'rich-editor-content' } },
    immediatelyRender: false,
  });

  // Sync external value changes (auto-translate, form reset) — skipped after image upload
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (skipSync.current) { skipSync.current = false; return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = (editor.storage as any).markdown.getMarkdown();
    if (value !== current) {
      suppressUpd.current = true;
      editor.commands.setContent(value || '');
      suppressUpd.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const addImage = () => { setImgError(''); imgInputRef.current?.click(); };

  const handleImageFile = async (file: File) => {
    setUploading(true);
    setImgError('');
    try {
      const res  = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', body: file });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      if (!data.url) throw new Error('No URL returned from upload');

      // Insert as a proper image node at the cursor — skipping the sync so it doesn't get wiped
      skipSync.current = true;
      editor.chain().focus().insertContent({
        type: 'image',
        attrs: { src: data.url, alt: 'image', title: null },
      }).run();

    } catch (e) {
      setImgError(e instanceof Error ? e.message : 'Upload failed');
      skipSync.current = false;
    } finally {
      setUploading(false);
    }
  };

  const addLink = () => {
    const url = window.prompt('Link URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const btns: (Btn | 'sep')[] = [
    { label: 'H1', title: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { label: 'H2', title: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: 'H3', title: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    'sep',
    { label: 'B',  title: 'Bold',         action: () => editor.chain().focus().toggleBold().run(),         active: editor.isActive('bold')      },
    { label: 'I',  title: 'Italic',        action: () => editor.chain().focus().toggleItalic().run(),       active: editor.isActive('italic')    },
    { label: 'U',  title: 'Underline',     action: () => editor.chain().focus().toggleUnderline().run(),    active: editor.isActive('underline') },
    { label: 'S',  title: 'Strikethrough', action: () => editor.chain().focus().toggleStrike().run(),       active: editor.isActive('strike')    },
    'sep',
    { label: '•—', title: 'Bullet list',   action: () => editor.chain().focus().toggleBulletList().run(),   active: editor.isActive('bulletList')  },
    { label: '1.', title: 'Ordered list',  action: () => editor.chain().focus().toggleOrderedList().run(),  active: editor.isActive('orderedList') },
    { label: '❝',  title: 'Blockquote',    action: () => editor.chain().focus().toggleBlockquote().run(),   active: editor.isActive('blockquote')  },
    { label: '<>', title: 'Inline code',   action: () => editor.chain().focus().toggleCode().run(),          active: editor.isActive('code')        },
    'sep',
    { label: '🔗', title: 'Link',         action: addLink,  active: editor.isActive('link') },
    { label: uploading ? '⏳' : '🖼', title: 'Upload image', action: addImage, active: false },
    'sep',
    { label: '—', title: 'Horizontal rule',  action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
    { label: '✕', title: 'Clear formatting', action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(), active: false },
  ];

  return (
    <div style={{ border: '1px solid #3f3f46', borderRadius: 8, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, padding: '6px 8px', background: '#27272a', borderBottom: '1px solid #3f3f46' }}>
        {btns.map((b, i) => b === 'sep' ? <Sep key={i} /> : <ToolBtn key={i} {...b} />)}
        <Sep />
        <label title="Text colour" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <span style={{ fontSize: 11, color: '#a1a1aa', marginRight: 3 }}>A</span>
          <input type="color" style={{ width: 18, height: 18, padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 3 }}
            value={editor.getAttributes('textStyle').color || '#e4e4e7'}
            onChange={e => editor.chain().focus().setColor(e.target.value).run()} />
        </label>
      </div>

      {/* Upload error */}
      {imgError && (
        <div style={{ background: '#450a0a', color: '#fca5a5', fontSize: 12, padding: '6px 12px', borderBottom: '1px solid #3f3f46' }}>
          ⚠ {imgError}
        </div>
      )}

      {/* Editor */}
      <style>{`
        .rich-editor-content { min-height: 320px; padding: 14px 16px; background: #18181b; color: #e4e4e7; font-size: 14px; line-height: 1.7; outline: none; }
        .rich-editor-content h1 { font-size: 1.6em; font-weight: 700; margin: 1em 0 0.4em; }
        .rich-editor-content h2 { font-size: 1.3em; font-weight: 600; margin: 0.9em 0 0.3em; }
        .rich-editor-content h3 { font-size: 1.1em; font-weight: 600; margin: 0.8em 0 0.3em; }
        .rich-editor-content p   { margin: 0.5em 0; }
        .rich-editor-content strong { font-weight: 700; }
        .rich-editor-content em     { font-style: italic; }
        .rich-editor-content u      { text-decoration: underline; }
        .rich-editor-content s      { text-decoration: line-through; }
        .rich-editor-content ul     { list-style: disc; padding-left: 1.4em; margin: 0.5em 0; }
        .rich-editor-content ol     { list-style: decimal; padding-left: 1.4em; margin: 0.5em 0; }
        .rich-editor-content li     { margin: 0.15em 0; }
        .rich-editor-content blockquote { border-left: 3px solid #52525b; padding-left: 1em; color: #a1a1aa; margin: 0.5em 0; }
        .rich-editor-content code   { background: #27272a; padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.88em; font-family: monospace; }
        .rich-editor-content pre    { background: #27272a; padding: 0.8em 1em; border-radius: 6px; overflow-x: auto; margin: 0.5em 0; }
        .rich-editor-content pre code { background: none; padding: 0; }
        .rich-editor-content hr     { border: none; border-top: 1px solid #3f3f46; margin: 1em 0; }
        .rich-editor-content img    { max-width: 100%; border-radius: 6px; margin: 0.5em 0; display: block; }
        .rich-editor-content a      { color: #818cf8; text-decoration: underline; }
      `}</style>
      <EditorContent editor={editor} />

      <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ''; }} />
    </div>
  );
}
