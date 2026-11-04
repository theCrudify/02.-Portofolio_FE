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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {nonEmpty.map(({ group, items }) => (
        <div key={group.code} className="rounded-md border border-border bg-card p-5">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {group.label}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((tech) => (
              <Badge key={tech.slug} variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
                <TechLogo name={tech.name} icon={tech.icon} className="h-4 w-4" />
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
