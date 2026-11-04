import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { buttonVariants } from '@/components/ui/button';
import { fetchCertificationsList } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; id: string }>;

// shortcut: looks the id up in the full list (small); add a by-id endpoint if the list grows large.
async function findCertification(id: string, locale: SupportedLocale) {
  return (await fetchCertificationsList(locale)).find((c) => c.id === id) ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const cert = await findCertification(id, typedLocale);
  return buildMetadata({
    title: cert?.name ?? 'Not found',
    description: cert?.description ?? cert?.issuer?.name ?? '',
    path: `/certifications/${id}`,
    locale: typedLocale,
    image: cert?.image?.url,
    noIndex: !cert,
  });
}

export default async function CertificationDetailPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const [t, cert] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.certifications' }),
    findCertification(id, typedLocale),
  ]);
  if (!cert) notFound();

  return (
    <PortfolioDetailPage
      {...cert}
      title={cert.name}
      backHref="/certifications"
      trackId={`cert-${cert.id}`}
      cover={cert.image}
      badges={[cert.type.label, cert.isExpired ? t('expired') : null]}
      meta={[
        cert.issuer?.name,
        cert.issueDate
          ? `${t('issued')}: ${formatMonthYear(cert.issueDate, typedLocale)}`
          : null,
        cert.expiryDate ? `${t('expires')}: ${formatMonthYear(cert.expiryDate, typedLocale)}` : null,
        cert.credentialId,
      ]}
      actions={
        cert.credentialUrl ? (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            {t('verify')}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null
      }
    />
  );
}
