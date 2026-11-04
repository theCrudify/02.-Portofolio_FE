import { ProjectCard } from '@/components/project/project-card';
import type { PublicProjectCard } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface ProjectGridProps {
  projects: PublicProjectCard[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6',
        projects.length === 1
          ? 'lg:grid-cols-1'
          : projects.length === 2
            ? 'md:grid-cols-2'
            : 'md:grid-cols-2 lg:grid-cols-3',
      )}
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
