'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/events';

export function PageViewTracker({ locale }: { locale: 'en' | 'id' }) {
  const pathname = usePathname();

  React.useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    track('page_view', {
      path: pathname,
      locale,
    });
  }, [pathname, locale]);

  return null;
}
