import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Layers,
  Video,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Section, SectionEyebrow } from "@/components/layout/section";
import { BrowserChrome } from "@/components/project/project-card";
import { TechLogo } from "@/components/project/tech-logo";
import { OrgMark } from "@/components/sections/org-mark";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import type {
  PublicImage,
  PublicOrganization,
  PublicTechChip,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

/*
 * Building blocks shared by every detail page (projects, experience, certificates, activities,
 * awards). They reuse the home page's visual language: Section glow, pill eyebrow, card bands with
 * a dot matrix and watermark icon, OrgMark tiles, logo chips and check-circle lists.
 */

export function DetailArticle({ children }: { children: ReactNode }) {
  return <article>{children}</article>;
}

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
  /** Right-hand card: summary card or product preview. */
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
    ? [organization.type?.label, organization.location]
        .filter(Boolean)
        .join(" · ")
    : "";
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
          "mt-6 grid grid-cols-1 items-start gap-10 md:mt-8",
          aside && "lg:grid-cols-[minmax(0,1fr)_420px] xl:gap-14",
        )}
      >
        <div className="min-w-0">
          {kinds.length > 0 ? (
            <SectionEyebrow className="mb-5">
              {kinds.join(" · ")}
            </SectionEyebrow>
          ) : null}
          {kicker ? (
            <p className="font-mono text-sm font-medium text-primary">
              {kicker}
            </p>
          ) : null}
          <h1
            className={cn(
              "text-balance font-heading text-[32px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[46px]",
              kicker && "mt-2",
            )}
          >
            {title}
          </h1>

          {organization ? (
            <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 leading-snug">
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
                <span className="text-lg font-semibold text-primary">
                  {organization.name}
                </span>
              )}
              {orgDetail ? (
                <span className="text-sm text-muted-foreground">
                  {orgDetail}
                </span>
              ) : null}
            </p>
          ) : null}
          {byline ? (
            <p className="mt-3 text-base font-medium text-primary">{byline}</p>
          ) : null}

          {lede ? (
            <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              {lede}
            </p>
          ) : null}
          {actions ? (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}
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

/** Facts in the muted box used by the home page cards; empty values are skipped. */
export function DetailFacts({
  facts,
  className,
}: {
  facts: DetailFact[];
  className?: string;
}) {
  const shown = facts.filter(
    (f) => f.value !== null && f.value !== undefined && f.value !== "",
  );
  if (shown.length === 0) return null;
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-border/70 bg-muted/40 p-4 text-sm",
        className,
      )}
    >
      {shown.map((f) => (
        <div key={f.label} className={cn("min-w-0", f.wide && "col-span-2")}>
          <dt className="text-xs text-muted-foreground">{f.label}</dt>
          <dd
            className={cn(
              "mt-0.5 font-semibold text-foreground",
              f.mono && "truncate font-mono text-xs",
            )}
          >
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export interface DetailChip {
  label: string;
  tone?: "neutral" | "primary" | "success" | "danger";
}

const CHIP_TONE: Record<NonNullable<DetailChip["tone"]>, string> = {
  neutral: "border-border bg-background/90 text-foreground",
  primary: "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
};

/** Summary card beside the title: band (image or dot matrix + watermark), OrgMark, facts. */
export function DetailSummaryCard({
  watermark: Watermark,
  image,
  imageFit = "cover",
  organization,
  fallbackName,
  chips = [],
  facts = [],
  footer,
}: {
  watermark: LucideIcon;
  image?: PublicImage | null;
  imageFit?: "cover" | "contain";
  organization?: PublicOrganization | null;
  fallbackName: string;
  chips?: DetailChip[];
  facts?: DetailFact[];
  footer?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div
        className={cn(
          "relative overflow-hidden border-b border-border/60 bg-linear-to-br from-primary/25 via-primary/10 to-transparent",
          image ? "aspect-4/3" : "h-32",
        )}
      >
        {image ? (
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          >
            <Image
              src={image.url}
              alt={image.alt || fallbackName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 420px"
              className={
                imageFit === "contain"
                  ? "bg-background object-contain p-3"
                  : "object-cover"
              }
            />
          </a>
        ) : (
          <>
            <div className="bg-dot-matrix absolute inset-0 opacity-60" />
            <Watermark
              aria-hidden="true"
              className="absolute -right-5 -top-7 h-44 w-44 rotate-12 text-primary/15"
            />
          </>
        )}
        {chips.length > 0 ? (
          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur",
                  CHIP_TONE[c.tone ?? "neutral"],
                )}
              >
                {c.tone && c.tone !== "neutral" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                ) : null}
                {c.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-4 p-5 pt-0">
        <OrgMark
          organization={organization}
          fallback={fallbackName}
          className="relative -mt-6 h-12 w-12 shadow-md ring-4 ring-card"
        />
        <DetailFacts facts={facts} />
        {footer}
      </div>
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
              style={{
                background:
                  "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
              }}
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

/** Body of the page: section cards, with an optional sticky side column aligned to the hero card. */
export function DetailSections({
  children,
  aside,
}: {
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Container className="py-10 md:py-14">
      <div
        className={cn(
          "grid grid-cols-1 items-start gap-6",
          aside && "lg:grid-cols-[minmax(0,1fr)_420px] xl:gap-x-14",
        )}
      >
        <div className="min-w-0 space-y-6">{children}</div>
        {aside ? (
          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24">
            {aside}
          </aside>
        ) : null}
      </div>
    </Container>
  );
}

/** A card with an icon heading, like the labelled blocks on the career timeline. */
export function DetailSection({
  title,
  icon: Icon,
  children,
  id,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-7"
    >
      <h2 className="mb-5 flex items-center gap-2.5 font-heading text-lg font-bold text-foreground sm:text-xl">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DetailProse({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[72ch] whitespace-pre-line text-pretty text-base leading-[1.8] text-muted-foreground">
      {children}
    </p>
  );
}

/** Check-circle list, same as the responsibilities on the career timeline. */
export function DetailBulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[78ch] space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Outcomes: numbered tiles so each result reads as its own point. */
export function DetailNumberedList({ items }: { items: string[] }) {
  return (
    <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3.5 rounded-xl border border-border/70 bg-muted/30 p-4 text-[15px] leading-relaxed text-foreground"
        >
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="pt-1">{item}</span>
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
  icon?: "file" | "video";
}

/** Link tiles (projects in a role, positions, documents). */
export function DetailRowList({
  rows,
  columns = 2,
}: {
  rows: DetailRow[];
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-3",
        columns === 2 && "sm:grid-cols-2",
      )}
    >
      {rows.map((row) => {
        const Icon =
          row.icon === "video" ? Video : row.icon === "file" ? FileText : null;
        const className =
          "group flex h-full min-h-14 items-center gap-3 rounded-xl border border-border bg-background/80 p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
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
              {row.meta ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {row.meta}
                </span>
              ) : null}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:text-primary motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </>
        );
        return (
          <li key={row.key}>
            {row.external ? (
              <a
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
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
export function DetailTechList({
  technologies,
}: {
  technologies: PublicTechChip[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <Badge
          key={tech.slug}
          variant="secondary"
          className="gap-1.5 px-3 py-1 text-xs"
        >
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
  const item = (nav: DetailNavItem, dir: "prev" | "next") => (
    <Link
      href={nav.href}
      className={cn(
        "group flex min-h-11 flex-col gap-1.5 rounded-2xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        dir === "next" && "sm:items-end sm:text-right",
      )}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-primary">
        {dir === "prev" ? <ArrowLeft className="h-3.5 w-3.5" /> : null}
        {dir === "prev" ? prevLabel : nextLabel}
        {dir === "next" ? <ArrowRight className="h-3.5 w-3.5" /> : null}
      </span>
      <span className="font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary">
        {nav.title}
      </span>
    </Link>
  );
  return (
    <Container className="pb-16 md:pb-20">
      <nav aria-label={label} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {prev ? item(prev, "prev") : <span className="hidden sm:block" />}
        {next ? item(next, "next") : null}
      </nav>
    </Container>
  );
}
