import { Suspense } from 'react';
import BlogReadClient from './BlogReadClient';

export default function BlogReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogReadClient />
    </Suspense>
  );
}
