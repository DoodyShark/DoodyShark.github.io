import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function CourseworkReadPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <ReadClient md_path='coursework/ar' />
    </Suspense>
  );
}
