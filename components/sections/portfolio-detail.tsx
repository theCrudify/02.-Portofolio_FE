import { ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ProjectLinks } from '@/components/project/project-links';
import { TechLogo } from '@/components/project/tech-logo';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import type { PublicImage, PublicPortfolioExtras } from '@/lib/api/types';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/** "View details" link on a certificate / activity / award card. */
export function DetailLink({ href }: { href: string }) {
  const t = useTranslations('sections.extras');
  return (
    <div className="border-t border-border/60 px-5 py-3">
      <Link href={href} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'min-h-11')}>
        {t('details')}
      </Link>
    </div>
  );
}

export interface PortfolioDetailPageProps extends Partial<PublicPortfolioExtras> {
  title: string;
  /** Type label shown as a badge (certificate type, activity type, rank…). */
  badges?: (string | null | undefined)[];
  backHref: string;
  /** Used as the analytics target id for link clicks. */
  trackId: string;
  cover?: PublicImage | null;
  /** Short facts under the title: issuer, event, period, credential id… */
  meta?: (string | null | undefined)[];
  description?: string | null;
  /** Extra actions (verify credential, external link…). */
  actions?: ReactNode;
}

/**
 * Detail page of a certificate, activity or award: cover, full description, tasks & achievements,
 * tools/skills, attachments (images + PDFs) and links.
 */
// Extras default to [] so the page survives an API that doesn't send them yet.
export function PortfolioDetailPage({
  title,
  badges = [],
  backHref,
  trackId,
  cover,
  meta = [],
  description,
  achievements = [],
  technologies = [],
  attachments = [],
  links = [],
  actions,
}: PortfolioDetailPageProps) {
  const t = useTranslations('sections.extras');
  const images = attachments.filter((a) => a.kind === 'image');
  const files = attachments.filter((a) => a.kind !== 'image');
  const facts = meta.filter(Boolean);

  return (
    <article className="py-12 md:py-20">
      <Container className="max-w-3xl space-y-8">
        <Link href={backHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>

        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {badges.filter(Boolean).map((b) => (
              <Badge key={b} variant="secondary">{b}</Badge>
            ))}
          </div>
          <h1 className="font-heading text-[28px] font-bold leading-tight tracking-tight md:text-[40px]">{title}</h1>
          {facts.length > 0 ? <p className="font-semibold text-primary">{facts.join(' · ')}</p> : null}
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </header>

        {cover ? (
          <a href={cover.url} target="_blank" rel="noopener noreferrer" className="block">
            <Image
              src={cover.url}
              alt={cover.alt || title}
              width={cover.width ?? 1200}
              height={cover.height ?? 800}
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="h-auto w-full rounded-lg border border-border/60"
            />
          </a>
        ) : null}

        <div className="space-y-8 text-base">
          {description ? (
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{description}</p>
          ) : null}

          {achievements.length > 0 ? (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">{t('achievements')}</h2>
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
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">{t('skills')}</h2>
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
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">{t('attachments')}</h2>
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
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">{t('links')}</h2>
              <ProjectLinks links={links} projectSlug={trackId} privateLabel={t('private')} />
            </div>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
