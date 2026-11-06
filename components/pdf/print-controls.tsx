'use client';

import { Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/** Opens the browser's print dialog ("Save as PDF") once fonts are ready. */
function printWhenReady() {
  void document.fonts.ready.then(() => window.print());
}

/** `/cv?print=1` (where the PDF links point) opens the print dialog on arrival. */
export function AutoPrint() {
  const params = useSearchParams();
  useEffect(() => {
    if (params.get('print') === '1') printWhenReady();
  }, [params]);
  return null;
}

export function PrintCvButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={printWhenReady}
      className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  );
}
