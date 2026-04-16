export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 px-4 py-8 sm:px-8 md:px-16 lg:px-32 xl:px-48 transition-colors duration-500">
      {children}
    </div>
  );
}
