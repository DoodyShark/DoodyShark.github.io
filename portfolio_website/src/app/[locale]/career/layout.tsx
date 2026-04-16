export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-4 py-8 sm:px-8 md:px-16 lg:px-32 xl:px-48 transition-colors duration-500">
      {children}
    </div>
  );
}
