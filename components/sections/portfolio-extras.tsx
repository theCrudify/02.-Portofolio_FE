import { CheckCircle2, FileText } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ProjectLinks } from '@/components/project/project-links';
import { TechLogo } from '@/components/project/tech-logo';
import { DetailDialog } from '@/components/sections/detail-dialog';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import type { PublicImage, PublicPortfolioExtras } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface PortfolioExtrasProps extends Partial<PublicPortfolioExtras> {
  /** Dialog title (certificate name, role, award title). */
  title: string;
  /** Used as the analytics target id for link clicks. */
  trackId: string;
  cover?: PublicImage | null;
  /** Short facts under the title: issuer, event, period, credential id… */
  meta?: (string | null | undefined)[];
  description?: string | null;
  className?: string;
}

/**
 * "View details" button on a certificate / activity / award card, opening a dialog with the cover,
 * full description, tasks & achievements, tools/skills, attachments (images + PDFs) and links.
 */
// Extras default to [] so the page survives an API that doesn't send them yet.
export function PortfolioExtras({
  title,
  trackId,
  cover,
  meta = [],
  description,
  achievements = [],
  technologies = [],
  attachments = [],
  links = [],
  className,
}: PortfolioExtrasProps) {
  const t = useTranslations('sections.extras');
  const images = attachments.filter((a) => a.kind === 'image');
  const files = attachments.filter((a) => a.kind !== 'image');
  const facts = meta.filter(Boolean);

  return (
    <div className={cn('border-t border-border/60 px-5 py-3', className)}>
      <DetailDialog title={title} label={t('details')}>
        <div className="space-y-5 text-sm">
          {cover ? (
            <a href={cover.url} target="_blank" rel="noopener noreferrer" className="block">
              <Image
                src={cover.url}
                alt={cover.alt || title}
                width={cover.width ?? 1200}
                height={cover.height ?? 800}
                sizes="(max-width: 768px) 100vw, 640px"
                className="h-auto w-full rounded-lg border border-border/60"
              />
            </a>
          ) : null}

          {facts.length > 0 ? (
            <p className="font-semibold text-primary">{facts.join(' · ')}</p>
          ) : null}

          {description ? (
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{description}</p>
          ) : null}

          {achievements.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">{t('achievements')}</h3>
              <ul className="space-y-2">
                {achievements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {technologies.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">{t('skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech.slug} variant="outline" className="gap-1.5">
                    <TechLogo name={tech.name} icon={tech.icon} className="h-3.5 w-3.5" />
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {attachments.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">{t('attachments')}</h3>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {images.map((img) => (
                    <a
                      key={img.id}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block aspect-4/3 overflow-hidden rounded-lg border border-border/60 bg-muted"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || img.caption || ''}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover"
                      />
                    </a>
                  ))}
                </div>
              ) : null}
              {files.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'min-h-11')}
                    >
                      <FileText className="h-4 w-4" />
                      <span>{file.caption || file.title || t('file')}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {links.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">{t('links')}</h3>
              <ProjectLinks links={links} projectSlug={trackId} privateLabel={t('private')} />
            </div>
          ) : null}
        </div>
      </DetailDialog>
    </div>
  );
}
