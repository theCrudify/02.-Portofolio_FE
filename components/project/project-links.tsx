'use client';

import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { LookupIcon } from '@/components/ui/lookup-icon';
import type { PublicProjectLink } from '@/lib/api/types';
import { track } from '@/lib/events';
import { cn } from '@/lib/utils';

export interface ProjectLinksProps {
  links: PublicProjectLink[];
  projectSlug: string;
  privateLabel?: string;
}

export function ProjectLinks({
  links,
  projectSlug,
  privateLabel = 'Private repo',
}: ProjectLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {links.map((link, idx) => {
        if (link.isPrivate || !link.url) {
          return (
            <Badge
              key={`${link.type.code}-${idx}`}
              variant="secondary"
              className="gap-1.5 px-3 py-1.5 text-xs"
            >
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{link.label || link.type.label}</span>
              <span className="text-muted-foreground">({privateLabel})</span>
            </Badge>
          );
        }

        return (
          <a
            key={`${link.type.code}-${idx}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('link_click', {
                projectSlug,
                target: link.type.code,
              })
            }
            title={link.type.label}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'min-h-11')}
          >
            <LookupIcon name={link.type.icon} className="h-4 w-4" />
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}

