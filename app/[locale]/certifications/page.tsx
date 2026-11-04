import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/layout/section';
import { PortfolioExtras } from '@/components/sections/portfolio-extras';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { fetchCertificationsList, fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const t = await getTranslations({ locale: typedLocale, namespace: 'sections.certifications' });

  return buildMetadata({
    title: t('title'),
    description: t('eyebrow'),
    path: '/certifications',
    locale: typedLocale,
  });
}

export default async function CertificationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  // Without this next-intl reads the locale from headers, which breaks on-demand static rendering.
  setRequestLocale(locale);
  const query = await searchParams;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';

  const [t, certifications, site] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.certifications' }),
    fetchCertificationsList(typedLocale, query.type),
    fetchSiteData(typedLocale),
  ]);

  // Type filters (codes + labels) come from master data.
  const certTypes = site.filters.certificationTypes;

  return (
    <Section eyebrow={t('eyebrow')} title={t('title')}>
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/certifications"
          className={cn(
            buttonVariants({
              variant: !query.type ? 'default' : 'outline',
              size: 'sm',
            }),
          )}
        >
          {t('all')}
        </Link>
        {certTypes.map((cType) => (
          <Link
            key={cType.code}
            href={`/certifications?type=${cType.code}`}
            className={cn(
              buttonVariants({
                variant: query.type === cType.code ? 'default' : 'outline',
                size: 'sm',
              }),
            )}
          >
            {cType.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.id} className="flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{cert.type.label}</Badge>
                {cert.isExpired ? (
                  <Badge variant="destructive">{t('expired')}</Badge>
                ) : null}
              </div>
              <CardTitle className="text-base md:text-lg">{cert.name}</CardTitle>
              <p className="text-sm font-medium text-muted-foreground">{cert.issuer?.name}</p>
            </CardHeader>

            <CardContent className="text-xs text-muted-foreground">
              {cert.issueDate ? (
                <p>
                  {t('issued')}: {formatMonthYear(cert.issueDate, typedLocale)}
                  {cert.expiryDate
                    ? ` · ${t('expires')}: ${formatMonthYear(cert.expiryDate, typedLocale)}`
                    : ''}
                </p>
              ) : null}
              {cert.credentialId ? <p className="mt-1 font-mono">ID: {cert.credentialId}</p> : null}
            </CardContent>
            <PortfolioExtras
              {...cert}
              trackId={`cert-${cert.id}`}
              title={cert.name}
              cover={cert.image}
              meta={[
                cert.issuer?.name,
                cert.issueDate ? formatMonthYear(cert.issueDate, typedLocale) : null,
                cert.credentialId,
              ]}
            />

            {cert.credentialUrl ? (
              <CardFooter className="border-t border-border pt-3">
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{t('verify')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}

