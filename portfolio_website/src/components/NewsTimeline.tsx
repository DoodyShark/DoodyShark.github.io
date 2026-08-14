type NewsItem = { date: string; text: string };

export default function NewsTimeline({ items }: { items: NewsItem[] }) {
  if (!items.length) return null;

  return (
    <div className="relative" style={{ paddingInlineStart: '28px' }}>
      <div
        className="absolute top-1.5 bottom-1.5"
        style={{ insetInlineStart: '5px', width: '2px', background: 'var(--m-border)' }}
        aria-hidden
      />
      <ul className="space-y-5">
        {items.map((item, i) => (
          <li key={i} className="relative">
            <span
              className="absolute top-1 rounded-full"
              style={{
                insetInlineStart: '-28px',
                width: '10px',
                height: '10px',
                background: i === 0 ? 'var(--m-teal)' : 'var(--m-bg)',
                border: '2px solid var(--m-teal)',
              }}
              aria-hidden
            />
            <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--m-teal)' }}>
              {item.date}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text)' }}>
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
