import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, FileText, Layers, Video } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { Section, SectionEyebrow } from '@/components/layout/section';
import { BrowserChrome } from '@/components/project/project-card';
import { TechLogo } from '@/components/project/tech-logo';
import { OrgMark } from '@/components/sections/org-mark';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import type { PublicImage, PublicOrganization, PublicTechChip } from '@/lib/api/types';
import { cn } from '@/lib/utils';

/*
 * Building blocks shared by every detail page (projects, experience, certificates, activities,
 * awards). The page reads like the home page: a hero Section, then one full-width Section per
 * block with the pill eyebrow, alternating the muted background.
 */

export interface DetailHeaderProps {
  backHref: string;
  backLabel: string;
  /** Kind of entry (e.g. "Bootcamp", "Full-time"), shown as the pill above the title. */
  eyebrow?: (string | null | undefined)[];
  title: string;
  /** Mono line above the title (period, date). */
  kicker?: string | null;
  lede?: string | null;
  organization?: PublicOrganization | null;
  /** Free-form line under the organization (event name…). */
  byline?: ReactNode;
  actions?: ReactNode;
  /** Right-hand panel: stat tiles or product preview. */
  aside?: ReactNode;
}

export function DetailHeader({
  backHref,
  backLabel,
  eyebrow = [],
  title,
  kicker,
  lede,
  organization,
  byline,
  actions,
  aside,
}: DetailHeaderProps) {
  const kinds = eyebrow.filter(Boolean);
  const orgDetail = organization
    ? [organization.type?.label, organization.location].filter(Boolean).join(' · ')
    : '';
  return (
    <Section className="pt-6 md:pt-8 lg:pt-10">
      <Link
        href={backHref}
        className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div
        className={cn(
          'mt-6 grid grid-cols-1 items-center gap-10 md:mt-8',
          aside && 'lg:grid-cols-[minmax(0,1fr)_460px] xl:gap-16',
        )}
      >
        <div className="min-w-0">
          {kinds.length > 0 ? <SectionEyebrow className="mb-5">{kinds.join(' · ')}</SectionEyebrow> : null}
          {kicker ? <p className="font-mono text-sm font-medium text-primary">{kicker}</p> : null}
          <h1
            className={cn(
              'text-balance font-heading text-[34px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[52px]',
              kicker && 'mt-3',
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
            <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">{lede}</p>
          ) : null}
          {actions ? <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>

        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </Section>
  );
}

export interface DetailFact {
  label: string;
  value: ReactNode;
  mono?: boolean;
  /** Spans both columns (long values like a credential id). */
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

/**
 * Hero side panel: optional image, status chips and the key facts as stat tiles. The first tile
 * carries the accent so the panel has one focal point. Empty values are skipped.
 */
export function DetailStatPanel({
  image,
  imageFit = 'cover',
  imageAlt,
  chips = [],
  facts = [],
}: {
  image?: PublicImage | null;
  imageFit?: 'cover' | 'contain';
  imageAlt: string;
  chips?: DetailChip[];
  facts?: DetailFact[];
}) {
  const shown = facts.filter((f) => f.value !== null && f.value !== undefined && f.value !== '');
  if (!image && shown.length === 0 && chips.length === 0) return null;
  return (
    <div className="space-y-3">
      {image ? (
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
            sizes="(max-width: 1024px) 100vw, 460px"
            className={imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'}
          />
        </a>
      ) : null}
      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c.label}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                CHIP_TONE[c.tone ?? 'neutral'],
              )}
            >
              {c.tone && c.tone !== 'neutral' ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
              {c.label}
            </span>
          ))}
        </div>
      ) : null}
      {shown.length > 0 ? (
        <dl className="grid grid-cols-2 gap-3">
          {shown.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                'relative min-w-0 overflow-hidden rounded-2xl border p-5 shadow-sm',
                (f.wide || shown.length === 1) && 'col-span-2',
                i === 0
                  ? 'border-primary/40 bg-linear-to-br from-primary to-primary/80 text-primary-foreground'
                  : 'border-border bg-card/90 backdrop-blur',
              )}
            >
              {i === 0 ? <div aria-hidden="true" className="bg-dot-matrix absolute inset-0 opacity-25" /> : null}
              <dt
                className={cn(
                  'relative text-[11px] font-semibold uppercase tracking-[0.14em]',
                  i === 0 ? 'text-primary-foreground/80' : 'text-muted-foreground',
                )}
              >
                {f.label}
              </dt>
              <dd
                className={cn(
                  'relative mt-2 font-heading text-xl font-bold leading-tight md:text-2xl',
                  f.mono && 'truncate font-mono text-sm md:text-base',
                )}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/** Product preview in the same window chrome as the project cards. */
export function DetailBrowserFrame({
  path,
  image,
  title,
}: {
  path: string;
  image?: PublicImage | null;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <BrowserChrome path={path} />
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover"
          />
        ) : (
          <div className="bg-architectural-grid relative flex h-full w-full items-center justify-center bg-muted/60">
            <div
              aria-hidden="true"
              className="absolute h-44 w-44 rounded-full opacity-30 blur-2xl"
              style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
            />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/35 bg-background/90 shadow-md">
              <Layers className="h-6 w-6 text-primary" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** One body block: a full-width home-page Section with its big title; alternate `muted`. */
export function DetailSection({
  title,
  children,
  muted,
  id,
}: {
  title: string;
  children: ReactNode;
  muted?: boolean;
  id?: string;
}) {
  return (
    <Section id={id} title={title} muted={muted}>
      {children}
    </Section>
  );
}

export function DetailProse({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[75ch] whitespace-pre-line text-pretty text-lg leading-[1.8] text-foreground/80">
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
