import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { neighbours, PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { buttonVariants } from '@/components/ui/button';
import { fetchCertificationsList } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; id: string }>;

// shortcut: looks the id up in the full list (small); add a by-id endpoint if the list grows large.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const cert = (await fetchCertificationsList(typedLocale)).find((c) => c.id === id);
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
  const [t, tCert, list] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.extras' }),
    getTranslations({ locale: typedLocale, namespace: 'sections.certifications' }),
    fetchCertificationsList(typedLocale),
  ]);
  const index = list.findIndex((c) => c.id === id);
  const cert = list[index];
  if (!cert) notFound();

  return (
    <PortfolioDetailPage
      {...cert}
      {...neighbours(list, index, (c) => ({ href: `/certifications/${c.id}`, title: c.name }))}
      title={cert.name}
      backHref="/certifications"
      backLabel={tCert('title')}
      trackId={`cert-${cert.id}`}
      cover={cert.image}
      badges={[cert.type.label]}
      chips={[
        cert.isExpired
          ? { label: tCert('expired'), tone: 'danger' }
          : cert.expiryDate
            ? { label: tCert('active'), tone: 'success' }
            : { label: tCert('lifetime'), tone: 'primary' },
      ]}
      organization={cert.issuer}
      coverFit="contain"
      facts={[
        {
          label: tCert('issued'),
          value: cert.issueDate ? formatMonthYear(cert.issueDate, typedLocale) : null,
        },
        {
          label: tCert('expires'),
          value: cert.expiryDate ? formatMonthYear(cert.expiryDate, typedLocale) : t('noExpiry'),
        },
        { label: t('credentialId'), value: cert.credentialId, mono: true, wide: true },
      ]}
      actions={
        cert.credentialUrl ? (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'default' })}
          >
            {tCert('verify')}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null
      }
    />
  );
}
