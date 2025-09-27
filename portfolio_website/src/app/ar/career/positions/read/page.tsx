import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function PositionsReadPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <ReadClient md_path='positions/ar' />
    </Suspense>
  );
}
