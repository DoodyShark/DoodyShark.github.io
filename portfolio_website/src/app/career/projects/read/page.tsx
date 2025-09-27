import { Suspense } from 'react';
import ReadClient from '@/components/BlogReadClient';

export default function ProjectsReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient md_path='projects' />
    </Suspense>
  );
}
