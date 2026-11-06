import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { neighbours, PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; id: string }>;

// Every published experience is already in the (cached) site payload.
async function loadExperiences(locale: SupportedLocale) {
  return (await fetchSiteData(locale)).experiences;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const exp = (await loadExperiences(typedLocale)).find((e) => e.id === id);
  return buildMetadata({
    title: exp ? `${exp.role} · ${exp.organization?.name ?? ''}` : 'Not found',
    description: exp?.description ?? '',
    path: `/experience/${id}`,
    locale: typedLocale,
    image: exp?.attachments.find((a) => a.kind === 'image')?.url,
    noIndex: !exp,
  });
}

export default async function ExperienceDetailPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const [t, tSection, list] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.extras' }),
    getTranslations({ locale: typedLocale, namespace: 'sections.experience' }),
    loadExperiences(typedLocale),
  ]);
  const index = list.findIndex((e) => e.id === id);
  const exp = list[index];
  if (!exp) notFound();

  return (
    <PortfolioDetailPage
      {...exp}
      {...neighbours(list, index, (e) => ({ href: `/experience/${e.id}`, title: e.role }))}
      title={exp.role}
      subtitle={exp.organization?.name}
      backHref="/#experience"
      backLabel={tSection('title')}
      trackId={`experience-${exp.id}`}
      badges={[exp.employmentType.label, exp.workMode?.label]}
      organization={exp.organization}
      responsibilitiesTitle={tSection('responsibilities')}
      achievementsTitle={tSection('achievements')}
      projectsTitle={tSection('projectsInRole')}
      facts={[
        { label: t('period'), value: formatPeriod(exp.startDate, exp.endDate, typedLocale) },
        { label: t('type'), value: exp.employmentType.label },
        { label: t('workMode'), value: exp.workMode?.label },
        { label: t('location'), value: exp.location },
      ]}
    />
  );
}
