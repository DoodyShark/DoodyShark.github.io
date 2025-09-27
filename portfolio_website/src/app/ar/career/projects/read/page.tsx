import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function ProjectsReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient md_path='projects/ar' />
    </Suspense>
  );
}
