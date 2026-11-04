import { Badge } from '@/components/ui/badge';
import type { PublicTechChip } from '@/lib/api/types';

export interface TechStackGroupProps {
  technologies: {
    frontend: PublicTechChip[];
    backend: PublicTechChip[];
    database: PublicTechChip[];
    devops: PublicTechChip[];
    other: PublicTechChip[];
  };
  labels?: Partial<Record<keyof TechStackGroupProps['technologies'], string>>;
}

export function TechStackGroup({ technologies, labels = {} }: TechStackGroupProps) {
  const groups: Array<{
    key: keyof TechStackGroupProps['technologies'];
    defaultLabel: string;
  }> = [
    { key: 'frontend', defaultLabel: 'Frontend' },
    { key: 'backend', defaultLabel: 'Backend' },
    { key: 'database', defaultLabel: 'Database' },
    { key: 'devops', defaultLabel: 'DevOps & Cloud' },
    { key: 'other', defaultLabel: 'Other' },
  ];

  const nonEmpty = groups.filter((g) => (technologies[g.key]?.length ?? 0) > 0);
  if (nonEmpty.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {nonEmpty.map((group) => (
        <div
          key={group.key}
          className="rounded-md border border-border bg-card p-5"
        >
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {labels[group.key] ?? group.defaultLabel}
          </h4>
          <div className="flex flex-wrap gap-2">
            {technologies[group.key].map((tech) => (
              <Badge key={tech.slug} variant="secondary" className="px-3 py-1 text-xs">
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

