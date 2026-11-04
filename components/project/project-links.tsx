'use client';

import {
  BookOpen,
  Code2,
  ExternalLink,
  Figma,
  FileCode2,
  Globe,
  Lock,
  PlayCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import type { PublicProjectLink } from '@/lib/api/types';
import { track } from '@/lib/events';
import { cn } from '@/lib/utils';

export interface ProjectLinksProps {
  links: PublicProjectLink[];
  projectSlug: string;
  privateLabel?: string;
}

function getLinkIcon(type: PublicProjectLink['type']) {
  switch (type) {
    case 'demo':
      return Globe;
    case 'repo':
    case 'repo_frontend':
    case 'repo_backend':
      return Code2;
    case 'api_docs':
    case 'postman':
      return FileCode2;
    case 'design':
      return Figma;
    case 'video':
      return PlayCircle;
    case 'article':
      return BookOpen;
    default:
      return ExternalLink;
  }
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
        const Icon = getLinkIcon(link.type);

        if (link.isPrivate || !link.url) {
          return (
            <Badge
              key={`${link.type}-${idx}`}
              variant="secondary"
              className="gap-1.5 px-3 py-1.5 text-xs"
            >
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{link.label || privateLabel}</span>
              <span className="text-muted-foreground">({privateLabel})</span>
            </Badge>
          );
        }

        return (
          <a
            key={`${link.type}-${idx}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('link_click', {
                projectSlug,
                target: link.type,
              })
            }
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'min-h-11')}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
