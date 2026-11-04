'use client';

import { Circle } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { IconName } from 'lucide-react/dynamic';

// lucide's dynamic module carries the name→import map of every icon (~40 kB), so it is itself
// loaded lazily instead of shipping in the first page load; each icon is then its own chunk.
const DynamicIcon = dynamic(
  () =>
    import('lucide-react/dynamic').then(({ DynamicIcon: Icon, iconNames }) => {
      const known = new Set<string>(iconNames);
      function SafeIcon({ name, className }: { name: string; className?: string }) {
        if (!known.has(name)) return <Circle aria-hidden="true" className={className} />;
        return (
          <Icon
            aria-hidden="true"
            name={name as IconName}
            className={className}
            fallback={() => <Circle aria-hidden="true" className={className} />}
          />
        );
      }
      return SafeIcon;
    }),
  { ssr: false, loading: () => <span aria-hidden="true" className="inline-block h-4 w-4" /> },
);

export interface LookupIconProps {
  /** Lucide icon name stored on a master-data value (lookups.icon). */
  name: string | null | undefined;
  className?: string;
}

/** Icon named in master data; unknown names fall back to a dot. */
export function LookupIcon({ name, className }: LookupIconProps) {
  if (!name) return <Circle aria-hidden="true" className={className} />;
  return <DynamicIcon name={name} className={className} />;
}
