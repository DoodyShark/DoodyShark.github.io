import FlowerDrawer from '@/components/FlowerDrawer';

export default function StudioPage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 max-w-lg mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-light tracking-wide" style={{ color: 'var(--m-text)' }}>
          The Studio ✏️
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text2)' }}>
          Doodle something — a book, a circuit, an equation, anything career-related.
          Your drawing joins the background of the career pages.
        </p>
      </div>
      <FlowerDrawer apiEndpoint="/api/drawings" />
    </div>
  );
}
