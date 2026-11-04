import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { DetailLink } from '@/components/sections/portfolio-detail';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import type { PublicCertification, SupportedLocale } from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface CertificationsSectionProps {
  certifications: PublicCertification[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function CertificationsSection({
  certifications,
  locale,
  muted,
}: CertificationsSectionProps) {
  const t = useTranslations('sections.certifications');
  if (!certifications || certifications.length === 0) return null;

  return (
    <Section
      id="certifications"
      eyebrow={t('eyebrow')}
      title={t('title')}
      muted={muted}
      actions={
        <Link href="/certifications" className={buttonVariants({ variant: 'outline' })}>
          <span>{t('viewAll')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          certifications.length === 1
            ? 'lg:grid-cols-1'
            : certifications.length === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {certifications.map((cert) => {
          const previewUrl = cert.image?.url ?? cert.issuer?.logo?.url ?? null;

          return (
            <SpotlightCard
              key={cert.id}
              className="group flex flex-col justify-between overflow-hidden"
            >
              <div>
                {previewUrl ? (
                  <div className="relative aspect-16/8 w-full overflow-hidden border-b border-border/60 bg-muted">
                    <Image
                      src={previewUrl}
                      alt={cert.image?.alt || cert.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <CardHeader className="bg-dot-matrix space-y-2.5 border-b border-border/60 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                      <Badge variant="secondary">{cert.type.label}</Badge>
                    </div>
                    {cert.isExpired ? (
                      <Badge variant="destructive">{t('expired')}</Badge>
                    ) : null}
                  </div>
                  <CardTitle className="pt-1 text-base sm:text-lg">{cert.name}</CardTitle>
                  <p className="text-sm font-semibold text-primary">{cert.issuer?.name}</p>
                </CardHeader>

                <CardContent className="space-y-1.5 pt-4 text-xs text-muted-foreground">
                  {cert.issueDate ? (
                    <p>
                      {t('issued')}: {formatMonthYear(cert.issueDate, locale)}
                      {cert.expiryDate
                        ? ` · ${t('expires')}: ${formatMonthYear(cert.expiryDate, locale)}`
                        : ''}
                    </p>
                  ) : null}
                  {cert.credentialId ? (
                    <p className="font-mono text-foreground">{cert.credentialId}</p>
                  ) : null}
                </CardContent>
                <DetailLink href={`/certifications/${cert.id}`} />
              </div>

              {cert.credentialUrl ? (
                <CardFooter className="border-t border-border/70 pt-3">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{t('verify')}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </CardFooter>
              ) : null}
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
