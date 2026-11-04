import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/layout/section';
import { CertificationCard } from '@/components/sections/certification-card';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { fetchCertificationsList, fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
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
          <CertificationCard key={cert.id} cert={cert} locale={typedLocale} />
        ))}
      </div>
    </Section>
  );
}

