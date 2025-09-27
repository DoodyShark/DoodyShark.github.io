import { Suspense } from 'react';
import ReadClient from '@/components/ReadClient';

export default function FoodReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient md_path='food' />
    </Suspense>
  );
}
