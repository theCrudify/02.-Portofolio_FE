import { Section } from '@/components/layout/section';
import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const site = await fetchSiteData((locale === 'id' ? 'id' : 'en') as SupportedLocale);

  return (
    <Section
      eyebrow="PORTFOLIO"
      title={site.profile?.name ?? 'Portfolio'}
      subtitle={site.profile?.headline ?? ''}
    />
  );
}
