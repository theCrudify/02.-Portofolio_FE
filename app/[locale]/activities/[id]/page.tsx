import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { buttonVariants } from '@/components/ui/button';
import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; id: string }>;

// Every published activity is already in the (cached) site payload.
async function findActivity(id: string, locale: SupportedLocale) {
  return (await fetchSiteData(locale)).activities.find((a) => a.id === id) ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const act = await findActivity(id, typedLocale);
  return buildMetadata({
    title: act ? `${act.role} · ${act.organization?.name ?? ''}` : 'Not found',
    description: act?.description ?? '',
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
  const act = await findActivity(id, typedLocale);
  if (!act) notFound();

  return (
    <PortfolioDetailPage
      {...act}
      title={act.role}
      backHref="/#activities"
      trackId={`activity-${act.id}`}
      cover={act.media}
      badges={[act.type.label]}
      meta={[
        act.organization?.name,
        act.eventName,
        act.startDate ? formatPeriod(act.startDate, act.endDate, typedLocale) : null,
      ]}
      actions={
        act.linkUrl ? (
          <a
            href={act.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            {act.linkUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null
      }
    />
  );
}
