import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { MultiImageShowcase } from '@/components/media/multi-image-showcase';
import { ProjectLinks } from '@/components/project/project-links';
import { TechLogo } from '@/components/project/tech-logo';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type {
  PublicImage,
  PublicOrganization,
  PublicPortfolioExtras,
  PublicProjectRef,
} from '@/lib/api/types';
import { cn } from '@/lib/utils';

/** "View details" link on a certificate / activity / award card. */
export function DetailLink({ href }: { href: string }) {
  const t = useTranslations('sections.extras');
  return (
    <div className="border-t border-border/60 px-5 py-3">
      <Link href={href} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'min-h-11')}>
        {t('details')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export interface DetailFact {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}

export interface DetailNavItem {
  href: string;
  title: string;
}

export interface PortfolioDetailPageProps extends Partial<PublicPortfolioExtras> {
  title: string;
  /** Line under the title: organization · event. */
  subtitle?: string | null;
  badges?: (string | null | undefined)[];
  backHref: string;
  backLabel: string;
  /** Used as the analytics target id for link clicks. */
  trackId: string;
  cover?: PublicImage | null;
  /** Key facts strip (period, event, credential id…); empty values are skipped. */
  facts?: DetailFact[];
  organization?: PublicOrganization | null;
  /** Heading of the organization card: Organization / Issuer / Organizer. */
  organizationLabel?: string;
  description?: string | null;
  /** Work experience only: job description bullets, shown before achievements. */
  responsibilities?: string[];
  responsibilitiesTitle?: string;
  achievementsTitle?: string;
  /** Work experience only: projects delivered in this role (links to their case studies). */
  projects?: PublicProjectRef[];
  projectsTitle?: string;
  /** Extra actions (verify credential, external link…). */
  actions?: ReactNode;
  prev?: DetailNavItem | null;
  next?: DetailNavItem | null;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-heading text-2xl font-bold text-foreground">{children}</h2>;
}

/**
 * Detail page of a certificate, activity or award, laid out like a project case study:
 * hero with cover, facts strip, then description, tasks & achievements, gallery and documents,
 * with the organization, tools/skills and links in a sidebar.
 */
// Extras default to [] so the page survives an API that doesn't send them yet.
export function PortfolioDetailPage({
  title,
  subtitle,
  badges = [],
  backHref,
  backLabel,
  trackId,
  cover,
  facts = [],
  organization,
  organizationLabel,
  description,
  responsibilities = [],
  responsibilitiesTitle,
  achievements = [],
  achievementsTitle,
  projects = [],
  projectsTitle,
  technologies = [],
  attachments = [],
  links = [],
  actions,
  prev,
  next,
}: PortfolioDetailPageProps) {
  const t = useTranslations('sections.extras');
  const images = attachments.filter((a) => a.kind === 'image');
  const documents = attachments.filter((a) => a.kind !== 'image');
  const shownFacts = facts.filter((f) => f.value);
  const hasSidebar = Boolean(organization || technologies.length || links.length);
  const isEmpty =
    !description && !responsibilities.length && !achievements.length && !projects.length && !attachments.length;

  return (
    <article className="py-10 md:py-16">
      <Container className="space-y-10 md:space-y-14">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        {/* Hero */}
        <header className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {badges.filter(Boolean).map((b) => (
                <Badge key={b} variant="secondary">
                  {b}
                </Badge>
              ))}
            </div>
            <h1 className="font-heading text-[32px] font-bold leading-tight tracking-tight text-foreground md:text-[44px]">
              {title}
            </h1>
            {subtitle ? <p className="text-lg font-semibold text-primary">{subtitle}</p> : null}
            {actions ? <div className="flex flex-wrap gap-3 pt-1">{actions}</div> : null}
          </div>

          {cover ? (
            <a
              href={cover.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm"
            >
              <Image
                src={cover.url}
                alt={cover.alt || title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </a>
          ) : (
            // No cover yet: a branded panel keeps the hero balanced.
            <div className="bg-dot-matrix relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-border bg-linear-to-br from-primary/15 via-card to-card">
              {organization?.logo ? (
                <Image
                  src={organization.logo.url}
                  alt={organization.logo.alt || organization.name}
                  width={160}
                  height={160}
                  className="h-32 w-32 rounded-2xl object-contain"
                />
              ) : (
                <span className="px-8 text-center font-heading text-3xl font-bold text-primary/80">
                  {organization?.name ?? title}
                </span>
              )}
            </div>
          )}
        </header>

        {/* Facts */}
        {shownFacts.length > 0 ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-border bg-muted/40 p-5 text-sm md:grid-cols-4">
            {shownFacts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-medium uppercase text-muted-foreground">{f.label}</dt>
                <dd className={cn('mt-1 font-medium text-foreground', f.mono && 'font-mono text-xs')}>
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className={cn('grid grid-cols-1 gap-10', hasSidebar && 'lg:grid-cols-[1fr_320px]')}>
          <div className="min-w-0 space-y-12">
            {description ? (
              <section className="space-y-4">
                <SectionTitle>{t('description')}</SectionTitle>
                <p className="max-w-[70ch] whitespace-pre-line text-base leading-[1.8] text-muted-foreground">
                  {description}
                </p>
              </section>
            ) : null}

            {responsibilities.length > 0 ? (
              <section className="space-y-4">
                <SectionTitle>{responsibilitiesTitle ?? t('responsibilities')}</SectionTitle>
                <ul className="max-w-[70ch] list-disc space-y-2 pl-5 text-base leading-[1.8] text-muted-foreground marker:text-primary">
                  {responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {achievements.length > 0 ? (
              <section className="space-y-4">
                <SectionTitle>{achievementsTitle ?? t('achievements')}</SectionTitle>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {achievements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {projects.length > 0 ? (
              <section className="space-y-4">
                <SectionTitle>{projectsTitle ?? t('projects')}</SectionTitle>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 font-medium text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="min-w-0 truncate">{p.title}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {images.length > 0 ? (
              <section className="space-y-4">
                <SectionTitle>{t('gallery')}</SectionTitle>
                <MultiImageShowcase
                  defaultLayout={images.length > 2 ? 'bento' : 'grid'}
                  items={images.map((img, i) => ({
                    id: img.id,
                    url: img.url,
                    alt: img.alt || img.caption || `${title} ${i + 1}`,
                    title: img.caption ?? img.title,
                    caption: img.caption,
                    width: img.width,
                    height: img.height,
                  }))}
                />
              </section>
            ) : null}

            {documents.length > 0 ? (
              <section className="space-y-4">
                <SectionTitle>{t('documents')}</SectionTitle>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {documents.map((doc) => {
                    const Icon = doc.kind === 'video' ? Video : FileText;
                    return (
                      <li key={doc.id}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium text-foreground">
                              {doc.caption || doc.title || t('file')}
                            </span>
                            <span className="text-xs uppercase text-muted-foreground">{doc.kind}</span>
                          </span>
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {isEmpty ? <p className="text-sm text-muted-foreground">{t('empty')}</p> : null}
          </div>

          {hasSidebar ? (
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {organization ? (
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {organizationLabel ?? t('organization')}
                  </p>
                  <div className="flex items-center gap-3">
                    {organization.logo ? (
                      <Image
                        src={organization.logo.url}
                        alt={organization.logo.alt || organization.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 shrink-0 rounded-lg border border-border bg-background object-contain"
                      />
                    ) : (
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-bold text-primary">
                        {organization.name.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-foreground">{organization.name}</p>
                      {organization.type ? (
                        <p className="text-xs text-muted-foreground">{organization.type.label}</p>
                      ) : null}
                    </div>
                  </div>
                  {organization.location ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {organization.location}
                    </p>
                  ) : null}
                  {organization.websiteUrl ? (
                    <a
                      href={organization.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      {t('website')}
                    </a>
                  ) : null}
                </div>
              ) : null}

              {technologies.length > 0 ? (
                <div className="space-y-3 rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{t('skills')}</p>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Badge key={tech.slug} variant="outline" className="gap-1.5 py-1">
                        <TechLogo name={tech.name} icon={tech.icon} className="h-3.5 w-3.5" />
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {links.length > 0 ? (
                <div className="space-y-3 rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{t('links')}</p>
                  <ProjectLinks links={links} projectSlug={trackId} privateLabel={t('private')} />
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>

        {prev || next ? (
          <nav
            aria-label={t('more')}
            className="grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={prev.href}
                className="group flex min-h-11 flex-col gap-1 rounded-xl border border-border p-4 transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t('prev')}
                </span>
                <span className="font-semibold text-foreground group-hover:text-primary">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={next.href}
                className="group flex min-h-11 flex-col items-end gap-1 rounded-xl border border-border p-4 text-right transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {t('next')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-foreground group-hover:text-primary">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Container>
    </article>
  );
}

/** Previous / next entries around `index` in a list, for the bottom navigation. */
export function neighbours<T>(
  list: T[],
  index: number,
  toItem: (item: T) => DetailNavItem,
): { prev: DetailNavItem | null; next: DetailNavItem | null } {
  return {
    prev: index > 0 ? toItem(list[index - 1]!) : null,
    next: index >= 0 && index < list.length - 1 ? toItem(list[index + 1]!) : null,
  };
}
