import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function ArtReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient md_path='art' />
    </Suspense>
  );
}
