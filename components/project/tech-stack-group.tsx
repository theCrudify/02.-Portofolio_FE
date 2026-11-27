import { TechLogo } from '@/components/project/tech-logo';
import { Badge } from '@/components/ui/badge';
import type { PublicTechGroup } from '@/lib/api/types';

export interface TechStackGroupProps {
  /** Grouped by the tech_group lookup; labels and order come from master data. */
  technologies: PublicTechGroup[];
}

export function TechStackGroup({ technologies }: TechStackGroupProps) {
  const nonEmpty = technologies.filter((g) => g.items.length > 0);
  if (nonEmpty.length === 0) {
    return null;
  }

  return (
    // One row per group: label on the left, chips on the right, hairlines between.
    <dl className="divide-y divide-border/70 border-y border-border/70">
      {nonEmpty.map(({ group, items }) => (
        <div key={group.code} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-6">
          <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {group.label}
          </dt>
          <dd className="flex flex-wrap gap-2">
            {items.map((tech) => (
              <Badge key={tech.slug} variant="outline" className="gap-2 bg-card px-3 py-1.5 text-sm shadow-xs">
                <TechLogo name={tech.name} icon={tech.icon} className="h-4 w-4" />
                {tech.name}
              </Badge>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
