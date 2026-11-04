import { CheckCircle2, FileText } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ProjectLinks } from '@/components/project/project-links';
import { TechLogo } from '@/components/project/tech-logo';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import type { PublicPortfolioExtras } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface PortfolioExtrasProps extends PublicPortfolioExtras {
  /** Used as the analytics target id for link clicks. */
  trackId: string;
  description?: string | null;
}

/**
 * Long description, achievements, tools/skills, attachments (images + PDFs) and links of a
 * certificate or activity, folded into a native <details> so cards stay compact.
 */
export function PortfolioExtras({
  trackId,
  description,
  achievements,
  technologies,
  attachments,
  links,
}: PortfolioExtrasProps) {
  const t = useTranslations('sections.extras');
  const images = attachments.filter((a) => a.kind === 'image');
  const files = attachments.filter((a) => a.kind !== 'image');
  const hasAny =
    description || achievements.length || technologies.length || attachments.length || links.length;
  if (!hasAny) return null;

  return (
    <details className="group/extras border-t border-border/60 px-5 py-3 text-sm">
      <summary className="min-h-11 cursor-pointer content-center font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {t('details')}
      </summary>
      <div className="space-y-4 pt-2">
        {description ? (
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{description}</p>
        ) : null}

        {achievements.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">{t('achievements')}</h4>
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
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">{t('skills')}</h4>
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
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">{t('attachments')}</h4>
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
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">{t('links')}</h4>
            <ProjectLinks links={links} projectSlug={trackId} privateLabel={t('private')} />
          </div>
        ) : null}
      </div>
    </details>
  );
}
