import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, FileText, Video } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { BrowserChrome } from '@/components/project/project-card';
import { TechLogo } from '@/components/project/tech-logo';
import { OrgMark } from '@/components/sections/org-mark';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import type { PublicImage, PublicOrganization, PublicTechChip } from '@/lib/api/types';
import { cn } from '@/lib/utils';

/*
 * Building blocks shared by every detail page (projects, experience, certificates, activities,
 * awards): a dark hero band with the key facts, then one numbered editorial row per block.
 */

export interface DetailFact {
  label: string;
  value: ReactNode;
  mono?: boolean;
  /** Spans two cells (long values like a credential id). */
  wide?: boolean;
}

export interface DetailChip {
  label: string;
  tone?: 'neutral' | 'primary' | 'success' | 'danger';
}

const CHIP_TONE: Record<NonNullable<DetailChip['tone']>, string> = {
  neutral: 'border-border bg-background/90 text-foreground',
  primary: 'border-primary/30 bg-primary/10 text-primary',
  success: 'border-success/30 bg-success/10 text-success',
  danger: 'border-destructive/30 bg-destructive/10 text-destructive',
};

const PILL = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold';

export interface DetailHeaderProps {
  backHref: string;
  backLabel: string;
  /** Kind of entry (e.g. "Bootcamp", "Full-time"), shown as the pill above the title. */
  eyebrow?: (string | null | undefined)[];
  /** Status pills next to the eyebrow (active, expired…). */
  chips?: DetailChip[];
  title: string;
  /** Mono line above the title (period, date). */
  kicker?: string | null;
  lede?: string | null;
  organization?: PublicOrganization | null;
  /** Free-form line under the organization (event name…). */
  byline?: ReactNode;
  actions?: ReactNode;
  /** Key facts as a stat strip under the hero; the first one is accented. Empty values are skipped. */
  facts?: DetailFact[];
  /** Right-hand media (cover, product preview). Pass nothing when there is no image. */
  aside?: ReactNode;
}

/** Hero band in the page theme: tinted surface, primary glow and grid, with the key facts as a strip. */
export function DetailHeader({
  backHref,
  backLabel,
  eyebrow = [],
  chips = [],
  title,
  kicker,
  lede,
  organization,
  byline,
  actions,
  facts = [],
  aside,
}: DetailHeaderProps) {
  const kinds = eyebrow.filter(Boolean);
  const shown = facts.filter((f) => f.value !== null && f.value !== undefined && f.value !== '');
  const orgDetail = organization
    ? [organization.type?.label, organization.location].filter(Boolean).join(' · ')
    : '';
  return (
    <header className="relative isolate overflow-hidden border-b border-border bg-primary/[0.04] text-foreground dark:bg-transparent">
      <div
        aria-hidden="true"
        className="bg-architectural-grid pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_80%_90%_at_85%_0%,black,transparent_75%)]"
      />
      {/* Gradients only (no blur filter): cheap to paint on phones. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 90% -10%, color-mix(in oklab, var(--primary) 42%, transparent), transparent 70%), radial-gradient(ellipse 45% 60% at 0% 110%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)',
        }}
      />

      <Container className="pb-10 pt-6 md:pb-14 md:pt-8">
        <Link
          href={backHref}
          className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div
          className={cn(
            'mt-6 grid grid-cols-1 items-center gap-10 md:mt-10',
            aside && 'lg:grid-cols-[minmax(0,1fr)_440px] xl:gap-16',
          )}
        >
          <div className="min-w-0">
            {kinds.length > 0 || chips.length > 0 || kicker ? (
              <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                {kinds.length > 0 ? (
                  <span className={cn(PILL, 'border-primary/40 bg-primary/15 uppercase tracking-[0.12em] text-primary')}>
                    {kinds.join(' · ')}
                  </span>
                ) : null}
                {chips.map((c) => (
                  <span key={c.label} className={cn(PILL, CHIP_TONE[c.tone ?? 'neutral'])}>
                    {c.tone && c.tone !== 'neutral' ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
                    {c.label}
                  </span>
                ))}
                {kicker ? <p className="font-mono text-sm text-muted-foreground">{kicker}</p> : null}
              </div>
            ) : null}
            <h1
              className={cn(
                'text-balance font-heading text-[32px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[44px]',
                !aside && 'max-w-5xl lg:text-[56px]',
              )}
            >
              {title}
            </h1>

            {organization ? (
              <div className="mt-6 flex items-center gap-3">
                <OrgMark organization={organization} className="h-12 w-12 shadow-sm" />
                <div className="flex min-w-0 flex-col leading-snug">
                  {organization.websiteUrl ? (
                    <a
                      href={organization.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-lg font-semibold text-primary hover:underline"
                    >
                      {organization.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-lg font-semibold text-primary">{organization.name}</span>
                  )}
                  {orgDetail ? <span className="text-sm text-muted-foreground">{orgDetail}</span> : null}
                </div>
              </div>
            ) : null}
            {byline ? <p className="mt-3 text-base font-medium text-foreground/80">{byline}</p> : null}

            {lede ? (
              <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-foreground/75">{lede}</p>
            ) : null}
            {actions ? <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div> : null}
          </div>

          {aside ? <div className="min-w-0">{aside}</div> : null}
        </div>

        {/* A single fact is not a strip, and the kicker usually says it already. */}
        {shown.length > 1 ? (
          // gap-px over a border-coloured box draws the hairlines between cells.
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-12 md:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
            {shown.map((f, i) => (
              <div
                key={f.label}
                className={cn(
                  'min-w-0 bg-card px-5 py-4 md:px-6 md:py-5',
                  (f.wide || (i === shown.length - 1 && i % 2 === 0)) && 'col-span-2 md:col-span-1',
                )}
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {f.label}
                </dt>
                <dd
                  className={cn(
                    'mt-1.5 font-heading text-xl font-bold leading-tight md:text-2xl',
                    i === 0 && 'text-primary',
                    f.mono && 'truncate font-mono text-sm font-medium md:text-sm',
                  )}
                >
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </header>
  );
}

/** Hero cover image; opens the full file. Render only when there is an image. */
export function DetailCover({
  image,
  imageFit = 'cover',
  imageAlt,
}: {
  image: PublicImage;
  imageFit?: 'cover' | 'contain';
  imageAlt: string;
}) {
  return (
    <a
      href={image.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-4/3 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      <Image
        src={image.url}
        alt={image.alt || imageAlt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 440px"
        className={imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'}
      />
    </a>
  );
}

/** Product preview in the same window chrome as the project cards. Render only when there is a cover. */
export function DetailBrowserFrame({ path, image, title }: { path: string; image: PublicImage; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <BrowserChrome path={path} />
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={image.url}
          alt={image.alt || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/**
 * One body block. Editorial row: numbered label on the left (sticky on desktop), content on the
 * right. `wide` stacks them so grids, galleries and video get the full width.
 */
export function DetailSection({
  title,
  children,
  index,
  wide,
  id,
}: {
  title: string;
  children: ReactNode;
  /** Zero-based position, shown as 01, 02… */
  index: number;
  wide?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className="border-b border-border/70">
      <Container
        className={cn(
          'grid grid-cols-1 gap-x-12 gap-y-6 py-10 md:py-14',
          !wide && 'lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]',
        )}
      >
        <div className={cn('flex items-baseline gap-3', !wide && 'lg:sticky lg:top-24 lg:flex-col lg:gap-2 lg:self-start')}>
          <span aria-hidden="true" className="font-mono text-sm font-bold text-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground">{title}</h2>
        </div>
        <div className="min-w-0">{children}</div>
      </Container>
    </section>
  );
}

export function DetailProse({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[70ch] whitespace-pre-line text-pretty text-base leading-[1.75] text-foreground/85 md:text-[17px]">
      {children}
    </p>
  );
}

/** Check items in two columns, same marks as the career timeline. */
export function DetailBulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-12 gap-y-5 lg:grid-cols-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3.5 text-base leading-relaxed text-foreground">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Outcomes as bento cards: big faint number, accent rule on top. */
export function DetailNumberedList({ items }: { items: string[] }) {
  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => {
        const n = String(i + 1).padStart(2, '0');
        return (
          <li
            key={i}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 pt-7 shadow-xs transition-colors hover:border-primary/50"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary/60 to-transparent"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 -top-3 font-heading text-7xl font-bold text-primary/10"
            >
              {n}
            </span>
            <span className="relative font-mono text-xs font-bold text-primary">{n}</span>
            <p className="relative mt-3 text-[15px] leading-relaxed text-foreground">{item}</p>
          </li>
        );
      })}
    </ol>
  );
}

export interface DetailRow {
  key: string;
  href: string;
  title: string;
  meta?: string | null;
  /** Internal links use the locale-aware router; external ones open a new tab. */
  external?: boolean;
  icon?: 'file' | 'video';
}

/** Link tiles (positions, documents). */
export function DetailRowList({ rows }: { rows: DetailRow[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => {
        const Icon = row.icon === 'video' ? Video : row.icon === 'file' ? FileText : null;
        const className =
          'group flex h-full min-h-16 items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
        const content = (
          <>
            {Icon ? (
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-snug text-foreground group-hover:text-primary">
                {row.title}
              </span>
              {row.meta ? <span className="mt-0.5 block text-xs text-muted-foreground">{row.meta}</span> : null}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:text-primary motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </>
        );
        return (
          <li key={row.key}>
            {row.external ? (
              <a href={row.href} target="_blank" rel="noopener noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <Link href={row.href} className={className}>
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Tools and skills as logo chips. */
export function DetailTechList({ technologies }: { technologies: PublicTechChip[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {technologies.map((tech) => (
        <Badge key={tech.slug} variant="outline" className="gap-2 bg-card px-3.5 py-1.5 text-sm shadow-xs">
          <TechLogo name={tech.name} icon={tech.icon} className="h-4 w-4" />
          {tech.name}
        </Badge>
      ))}
    </div>
  );
}

export interface DetailNavItem {
  href: string;
  title: string;
}

export function DetailPager({
  prev,
  next,
  prevLabel,
  nextLabel,
  label,
}: {
  prev?: DetailNavItem | null;
  next?: DetailNavItem | null;
  prevLabel: string;
  nextLabel: string;
  label: string;
}) {
  if (!prev && !next) return null;
  const item = (nav: DetailNavItem, dir: 'prev' | 'next') => (
    <Link
      href={nav.href}
      className={cn(
        'group flex min-h-11 flex-col gap-1.5 rounded-2xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        dir === 'next' && 'sm:items-end sm:text-right',
      )}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-primary">
        {dir === 'prev' ? <ArrowLeft className="h-3.5 w-3.5" /> : null}
        {dir === 'prev' ? prevLabel : nextLabel}
        {dir === 'next' ? <ArrowRight className="h-3.5 w-3.5" /> : null}
      </span>
      <span className="font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary">
        {nav.title}
      </span>
    </Link>
  );
  return (
    <Container className="py-12 md:py-16">
      <nav aria-label={label} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {prev ? item(prev, 'prev') : <span className="hidden sm:block" />}
        {next ? item(next, 'next') : null}
      </nav>
    </Container>
  );
}
