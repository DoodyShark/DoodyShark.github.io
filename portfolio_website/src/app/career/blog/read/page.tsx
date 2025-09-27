import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function BlogReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient md_path='blog' />
    </Suspense>
  );
}
