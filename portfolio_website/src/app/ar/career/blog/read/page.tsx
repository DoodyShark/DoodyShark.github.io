import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function BlogReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div dir="rtl" className="text-right">
        <ReadClient md_path='blog/ar' />
      </div>
    </Suspense>
  );
}
