import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { buttonVariants } from '@/components/ui/button';
import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatDate } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; id: string }>;

// Every published award is already in the (cached) site payload.
async function findAchievement(id: string, locale: SupportedLocale) {
  return (await fetchSiteData(locale)).achievements.find((a) => a.id === id) ?? null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const ach = await findAchievement(id, typedLocale);
  return buildMetadata({
    title: ach?.title ?? 'Not found',
    description: ach?.description ?? '',
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
  const ach = await findAchievement(id, typedLocale);
  if (!ach) notFound();

  return (
    <PortfolioDetailPage
      {...ach}
      backHref="/#achievements"
      trackId={`achievement-${ach.id}`}
      cover={ach.certificate}
      badges={[ach.rank]}
      meta={[ach.issuer?.name, ach.eventName, ach.date ? formatDate(ach.date, typedLocale) : null]}
      actions={
        ach.linkUrl ? (
          <a
            href={ach.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            {ach.linkUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null
      }
    />
  );
}
