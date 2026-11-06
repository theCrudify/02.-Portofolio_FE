import { ArrowUpRight, ExternalLink, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { OrgMark } from '@/components/sections/org-mark';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import type { PublicCertification, SupportedLocale } from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';
import { cn } from '@/lib/utils';

/** Credential-style card; the whole card links to the detail page (stretched link). */
export function CertificationCard({
  cert,
  locale,
}: {
  cert: PublicCertification;
  locale: SupportedLocale;
}) {
  const t = useTranslations('sections.certifications');
  const status = cert.isExpired
    ? { label: t('expired'), cls: 'border-destructive/30 bg-destructive/10 text-destructive' }
    : cert.expiryDate
      ? { label: t('active'), cls: 'border-success/30 bg-success/10 text-success' }
      : { label: t('lifetime'), cls: 'border-primary/30 bg-primary/10 text-primary' };

  return (
    <SpotlightCard className="group relative flex h-full flex-col transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      {/* Band: the certificate image, or a branded gradient with a shield watermark. */}
      <div className="relative h-28 overflow-hidden border-b border-border/60 bg-linear-to-br from-primary/25 via-primary/10 to-transparent">
        <div className="bg-dot-matrix absolute inset-0 opacity-60" />
        {cert.image ? (
          // The scan reads as a paper certificate pinned to the band; cropping it as a cover made it illegible.
          <div className="absolute -bottom-3 right-5 aspect-[1.414] h-[104px] rotate-[5deg] overflow-hidden rounded-md border border-border bg-background shadow-lg ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[2deg] motion-reduce:transition-none">
            <Image
              src={cert.image.url}
              alt={cert.image.alt || cert.name}
              fill
              sizes="160px"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <ShieldCheck
            aria-hidden="true"
            className="absolute -right-4 -top-6 h-40 w-40 rotate-12 text-primary/15"
          />
        )}
        <div className="absolute left-5 top-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {cert.type.label}
          </Badge>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur',
              status.cls,
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
        <OrgMark
          organization={cert.issuer}
          className="-mt-6 h-12 w-12 shadow-md ring-4 ring-card"
        />
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-foreground">
            <Link
              href={`/certifications/${cert.id}`}
              className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring after:rounded-2xl"
            >
              {cert.name}
            </Link>
          </h3>
          <p className="text-sm font-semibold text-primary">{cert.issuer?.name}</p>
        </div>

        {cert.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{cert.description}</p>
        ) : null}

        <dl className="mt-auto grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 text-xs">
          <div>
            <dt className="text-muted-foreground">{t('issued')}</dt>
            <dd className="mt-0.5 font-semibold text-foreground">
              {cert.issueDate ? formatMonthYear(cert.issueDate, locale) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('expires')}</dt>
            <dd className="mt-0.5 font-semibold text-foreground">
              {cert.expiryDate ? formatMonthYear(cert.expiryDate, locale) : t('lifetime')}
            </dd>
          </div>
          {cert.credentialId ? (
            <div className="col-span-2">
              <dt className="text-muted-foreground">ID</dt>
              <dd className="mt-0.5 truncate font-mono text-foreground">{cert.credentialId}</dd>
            </div>
          ) : null}
        </dl>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            {t('details')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          {cert.credentialUrl ? (
            // Above the stretched link so it stays clickable on its own.
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
            >
              {t('verify')}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </SpotlightCard>
  );
}
