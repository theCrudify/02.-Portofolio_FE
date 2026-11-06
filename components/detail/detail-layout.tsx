import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Video } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/container';
import { TechLogo } from '@/components/project/tech-logo';
import { Link } from '@/i18n/routing';
import type { PublicImage, PublicOrganization, PublicTechChip } from '@/lib/api/types';
import { cn } from '@/lib/utils';

/*
 * Shared editorial layout for every detail page (projects, experience, certificates, activities,
 * awards): one reading column, hairline rules instead of boxed cards, section labels in a left rail.
 */

export function DetailArticle({ children }: { children: ReactNode }) {
  return (
    <article className="pb-16 pt-8 md:pb-24 md:pt-12">
      <Container>
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </Container>
    </article>
  );
}

export interface DetailHeaderProps {
  backHref: string;
  backLabel: string;
  /** Kind of entry (e.g. "Bootcamp", "Full-time"), shown small above the title. */
  eyebrow?: (string | null | undefined)[];
  title: string;
  /** One-paragraph summary under the title. */
  lede?: string | null;
  organization?: PublicOrganization | null;
  /** Free-form line under the organization (e.g. "Role at Company"). */
  byline?: ReactNode;
  actions?: ReactNode;
}

export function DetailHeader({
  backHref,
  backLabel,
  eyebrow = [],
  title,
  lede,
  organization,
  byline,
  actions,
}: DetailHeaderProps) {
  const kinds = eyebrow.filter(Boolean);
  return (
    <header className="pb-10 md:pb-14">
      <Link
        href={backHref}
        className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-sm px-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      {kinds.length > 0 ? (
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-primary md:mt-12">
          {kinds.join(' / ')}
        </p>
      ) : null}
      <h1
        className={cn(
          'max-w-[24ch] text-balance font-heading text-[34px] font-semibold leading-[1.08] tracking-tight text-foreground md:text-[56px]',
          kinds.length > 0 ? 'mt-4' : 'mt-8 md:mt-12',
        )}
      >
        {title}
      </h1>

      {organization ? <OrganizationLine organization={organization} /> : null}
      {byline ? <div className="mt-3 text-base text-muted-foreground">{byline}</div> : null}

      {lede ? (
        <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          {lede}
        </p>
      ) : null}
      {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}

function OrganizationLine({ organization }: { organization: PublicOrganization }) {
  const name = organization.websiteUrl ? (
    <a
      href={organization.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
    >
      {organization.name}
      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
    </a>
  ) : (
    <span className="font-medium text-foreground">{organization.name}</span>
  );
  const detail = [organization.type?.label, organization.location].filter(Boolean).join(' · ');
  return (
    <div className="mt-6 flex items-center gap-3">
      {organization.logo ? (
        <Image
          src={organization.logo.url}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-md border border-border bg-background object-contain p-1"
        />
      ) : null}
      <div className="min-w-0 leading-snug">
        <p className="text-base">{name}</p>
        {detail ? <p className="text-sm text-muted-foreground">{detail}</p> : null}
      </div>
    </div>
  );
}

export interface DetailFact {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

/** Key facts as a ruled strip; empty values are skipped. */
export function DetailFacts({ facts }: { facts: DetailFact[] }) {
  const shown = facts.filter((f) => f.value !== null && f.value !== undefined && f.value !== '');
  if (shown.length === 0) return null;
  return (
    <dl className="flex flex-wrap gap-x-14 gap-y-5 border-y border-border py-6">
      {shown.map((f) => (
        <div key={f.label} className="min-w-[8rem]">
          <dt className="text-xs text-muted-foreground">{f.label}</dt>
          <dd className={cn('mt-1.5 text-[15px] font-medium text-foreground', f.mono && 'font-mono text-sm')}>
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Wide figure under the header (cover, certificate scan, demo still). */
export function DetailFigure({ image, alt, contain }: { image: PublicImage; alt: string; contain?: boolean }) {
  const ratio = image.width && image.height ? image.width / image.height : 16 / 9;
  return (
    <figure className="mt-10 overflow-hidden rounded-lg border border-border bg-muted md:mt-14">
      <div className="relative w-full" style={{ aspectRatio: Math.min(Math.max(ratio, 4 / 3), 21 / 9) }}>
        <Image
          src={image.url}
          alt={image.alt || alt}
          fill
          priority
          sizes="(max-width: 1180px) 100vw, 1120px"
          className={contain ? 'object-contain p-4' : 'object-cover'}
        />
      </div>
    </figure>
  );
}

/** One section: label in the left rail, content on the right, hairline above. */
export function DetailSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className="grid grid-cols-1 gap-x-12 gap-y-5 border-t border-border py-10 md:grid-cols-[200px_minmax(0,1fr)] md:py-14"
    >
      <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground md:pt-1">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function DetailSections({ children }: { children: ReactNode }) {
  return <div className="[&>*:first-child]:border-t-0 [&>*:first-child]:pt-10 md:[&>*:first-child]:pt-14">{children}</div>;
}

export function DetailProse({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[68ch] whitespace-pre-line text-pretty text-[17px] leading-[1.8] text-foreground/85">
      {children}
    </p>
  );
}

/** Plain list with en-dash markers (duties, responsibilities). */
export function DetailBulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[68ch] space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="relative pl-6 text-[17px] leading-[1.7] text-foreground/85 before:absolute before:left-0 before:text-muted-foreground before:content-['–']"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Numbered list for outcomes and highlights: the numbers carry the rhythm, not icons. */
export function DetailNumberedList({ items }: { items: string[] }) {
  return (
    <ol className="max-w-[72ch] divide-y divide-border">
      {items.map((item, i) => (
        <li key={i} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 py-4 first:pt-0 last:pb-0">
          <span className="pt-0.5 font-mono text-sm tabular-nums text-primary">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-[17px] leading-[1.7] text-foreground">{item}</span>
        </li>
      ))}
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

/** Ruled list of links (projects in a role, documents). */
export function DetailRowList({ rows }: { rows: DetailRow[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {rows.map((row) => {
        const Icon = row.icon === 'video' ? Video : row.icon === 'file' ? FileText : null;
        const content = (
          <>
            {Icon ? <Icon className="h-4 w-4 shrink-0 text-muted-foreground" /> : null}
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-foreground transition-colors group-hover:text-primary">
                {row.title}
              </span>
              {row.meta ? <span className="block text-sm text-muted-foreground">{row.meta}</span> : null}
            </span>
            {row.external ? (
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5 group-hover:text-primary" />
            ) : (
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-0.5 group-hover:text-primary" />
            )}
          </>
        );
        const className =
          'group flex min-h-14 items-center gap-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
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

/** Tools and skills as a quiet inline list with logos. */
export function DetailTechList({ technologies }: { technologies: PublicTechChip[] }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {technologies.map((tech) => (
        <li key={tech.slug} className="inline-flex items-center gap-2 text-[15px] text-foreground">
          <TechLogo name={tech.name} icon={tech.icon} className="h-4 w-4" />
          {tech.name}
        </li>
      ))}
    </ul>
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
        'group flex min-h-11 flex-col gap-2 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        dir === 'next' && 'sm:items-end sm:text-right',
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        {dir === 'prev' ? <ArrowLeft className="h-4 w-4" /> : null}
        {dir === 'prev' ? prevLabel : nextLabel}
        {dir === 'next' ? <ArrowRight className="h-4 w-4" /> : null}
      </span>
      <span className="text-balance font-heading text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
        {nav.title}
      </span>
    </Link>
  );
  return (
    <nav
      aria-label={label}
      className="mt-6 grid grid-cols-1 border-t border-border sm:grid-cols-2 sm:gap-12 md:mt-10"
    >
      {prev ? item(prev, 'prev') : <span className="hidden sm:block" />}
      {next ? item(next, 'next') : null}
    </nav>
  );
}
