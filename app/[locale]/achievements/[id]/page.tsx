import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { neighbours, PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { buttonVariants } from '@/components/ui/button';
import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatDate } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; id: string }>;

// Every published award is already in the (cached) site payload.
async function loadAchievements(locale: SupportedLocale) {
  return (await fetchSiteData(locale)).achievements;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const ach = (await loadAchievements(typedLocale)).find((a) => a.id === id);
  return buildMetadata({
    title: ach?.title ?? 'Not found',
    description: ach?.description ?? ach?.eventName ?? '',
    path: `/achievements/${id}`,
    locale: typedLocale,
    image: ach?.certificate?.url,
    noIndex: !ach,
  });
}

export default async function AchievementDetailPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const [t, tSection, list] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.extras' }),
    getTranslations({ locale: typedLocale, namespace: 'sections.achievements' }),
    loadAchievements(typedLocale),
  ]);
  const index = list.findIndex((a) => a.id === id);
  const ach = list[index];
  if (!ach) notFound();

  return (
    <PortfolioDetailPage
      {...ach}
      {...neighbours(list, index, (a) => ({ href: `/achievements/${a.id}`, title: a.title }))}
      subtitle={ach.eventName}
      backHref="/#achievements"
      backLabel={tSection('title')}
      trackId={`achievement-${ach.id}`}
      cover={ach.certificate}
      badges={[ach.rank]}
      organization={ach.issuer}
      coverFit="contain"
      facts={[
        { label: t('rank'), value: ach.rank },
        { label: t('date'), value: ach.date ? formatDate(ach.date, typedLocale) : null },
      ]}
      actions={
        ach.linkUrl ? (
          <a
            href={ach.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'default' })}
          >
            {t('openLink')}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null
      }
    />
  );
}
