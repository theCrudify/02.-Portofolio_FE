import { ArrowUpRight, ExternalLink, Lock } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { VideoClip } from '@/components/media/video-clip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import type { PublicProjectCard } from '@/lib/api/types';

export interface ProjectCardProps {
  project: PublicProjectCard;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations('sections.projects');

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/projects/${project.slug}`}
        className="relative aspect-video w-full overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {project.clip ? (
          <VideoClip
            url={project.clip.url}
            sources={project.clip.sources}
            poster={project.cover?.url ?? project.clip.thumbnailUrl}
            className="h-full w-full object-cover"
          />
        ) : project.cover ? (
          <Image
            src={project.cover.url}
            alt={project.cover.alt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <span className="font-heading text-2xl font-bold opacity-30">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {project.type.replace('_', ' ')}
          </Badge>
          {project.projectState !== 'live' ? (
            <Badge variant="outline" className="capitalize">
              {project.projectState.replace('_', ' ')}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="line-clamp-1">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {project.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        {project.technologies.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech.slug} variant="outline" className="text-xs font-normal">
                {tech.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{t('caseStudy')}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        {project.primaryLink ? (
          project.primaryLink.isPrivate || !project.primaryLink.url ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              {t('privateRepo')}
            </span>
          ) : (
            <a
              href={project.primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.primaryLink.label} – ${project.title}`}
              className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{project.primaryLink.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )
        ) : null}
      </CardFooter>
    </Card>
  );
}
