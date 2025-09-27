import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function CourseworkReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient md_path='coursework' />
    </Suspense>
  );
}
