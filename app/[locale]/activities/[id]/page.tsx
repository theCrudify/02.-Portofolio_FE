import { ExternalLink, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { neighbours, PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { buttonVariants } from '@/components/ui/button';
import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { activityPeriod } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; id: string }>;

// Every published activity is already in the (cached) site payload.
async function loadActivities(locale: SupportedLocale) {
  return (await fetchSiteData(locale)).activities;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const act = (await loadActivities(typedLocale)).find((a) => a.id === id);
  return buildMetadata({
    title: act ? `${act.role} · ${act.organization?.name ?? ''}` : 'Not found',
    description: act?.description ?? act?.eventName ?? '',
    path: `/activities/${id}`,
    locale: typedLocale,
    image: act?.media?.url,
    noIndex: !act,
  });
}

export default async function ActivityDetailPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const [t, tSection, list] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.extras' }),
    getTranslations({ locale: typedLocale, namespace: 'sections.activities' }),
    loadActivities(typedLocale),
  ]);
  const index = list.findIndex((a) => a.id === id);
  const act = list[index];
  if (!act) notFound();

  return (
    <PortfolioDetailPage
      {...act}
      {...neighbours(list, index, (a) => ({ href: `/activities/${a.id}`, title: a.role }))}
      title={act.role}
      subtitle={act.eventName}
      backHref="/#activities"
      backLabel={tSection('title')}
      trackId={`activity-${act.id}`}
      cover={act.media}
      badges={[act.type.label]}
      watermark={Users}
      kicker={activityPeriod(act, typedLocale) || null}
      organization={act.organization}
      facts={[
        {
          label: t('period'),
          value: activityPeriod(act, typedLocale) || null,
        },
        { label: t('type'), value: act.type.label },
      ]}
      actions={
        act.linkUrl ? (
          <a
            href={act.linkUrl}
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
