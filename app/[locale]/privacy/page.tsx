import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/layout/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SupportedLocale } from '@/lib/api/types';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const t = await getTranslations({ locale: typedLocale, namespace: 'privacy' });

  return buildMetadata({
    title: t('title'),
    description: t('intro'),
    path: '/privacy',
    locale: typedLocale,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const t = await getTranslations({ locale: typedLocale, namespace: 'privacy' });

  const blocks = [
    { title: t('dataCollectedTitle'), body: t('dataCollectedBody') },
    { title: t('cookiesTitle'), body: t('cookiesBody') },
    { title: t('retentionTitle'), body: t('retentionBody') },
    { title: t('contactTitle'), body: t('contactBody') },
  ];

  return (
    <Section eyebrow="PRIVACY" title={t('title')} subtitle={t('intro')}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {blocks.map((block) => (
          <Card key={block.title}>
            <CardHeader className="pb-2">
              <CardTitle>{block.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-[1.7] text-muted-foreground">{block.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

