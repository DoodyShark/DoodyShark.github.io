export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative z-10 w-full min-h-screen px-4 py-8 sm:px-8 md:px-16 lg:px-32 xl:px-48 transition-colors duration-500"
      style={{
        background: 'color-mix(in srgb, var(--m-bg) 82%, transparent)',
        color: 'var(--m-text)',
      }}
    >
      {children}
    </div>
  );
}
