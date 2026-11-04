import { ProjectCard } from '@/components/project/project-card';
import type { PublicProjectCard } from '@/lib/api/types';

export interface ProjectGridProps {
  projects: PublicProjectCard[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
