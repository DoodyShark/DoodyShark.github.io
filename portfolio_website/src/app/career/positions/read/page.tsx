import { Suspense } from 'react';
import ReadClient from '@/components/BlogReadClient';

export default function PositionsReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient md_path='positions' />
    </Suspense>
  );
}
