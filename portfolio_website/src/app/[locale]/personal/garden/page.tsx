import FlowerDrawer from '@/components/FlowerDrawer';

export default function GardenPage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 max-w-lg mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-light tracking-wide">The Garden 🌸</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Draw a flower and plant it here. It will join everyone else&apos;s flowers as the
          animated background of this page — your little mark on this space.
        </p>
      </div>
      <FlowerDrawer />
    </div>
  );
}
