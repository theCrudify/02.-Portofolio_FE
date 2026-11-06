import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { neighbours, PortfolioDetailPage } from '@/components/sections/portfolio-detail';
import { fetchCertificationsList, fetchProjectsList, fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatDuration, formatPeriod } from '@/lib/format';
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
    // Optional chain: tolerates an API that predates experience attachments.
    image: exp?.attachments?.find((a) => a.kind === 'image')?.url,
    noIndex: !exp,
  });
}

export default async function ExperienceDetailPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const [t, tSection, list, allProjects, allCerts] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.extras' }),
    getTranslations({ locale: typedLocale, namespace: 'sections.experience' }),
    loadExperiences(typedLocale),
    fetchProjectsList({ locale: typedLocale, all: true, limit: 100 }),
    fetchCertificationsList(typedLocale),
  ]);
  const index = list.findIndex((e) => e.id === id);
  const exp = list[index];
  if (!exp) notFound();
  // Full cards (cover, stack) for the projects of this role, in the role's order.
  const projectCards = exp.projects.flatMap((ref) => allProjects.data.find((p) => p.slug === ref.slug) ?? []);

  return (
    <PortfolioDetailPage
      {...exp}
      {...neighbours(list, index, (e) => ({ href: `/experience/${e.id}`, title: e.role }))}
      title={exp.role}
      backHref="/#experience"
      backLabel={tSection('title')}
      trackId={`experience-${exp.id}`}
      badges={[exp.employmentType.label]}
      kicker={formatPeriod(exp.startDate, exp.endDate, typedLocale)}
      organization={exp.organization}
      responsibilitiesTitle={tSection('responsibilities')}
      achievementsTitle={tSection('achievements')}
      projectsTitle={tSection('projectsInRole')}
      projectCards={projectCards}
      // Related by organization: certificates the same company issued (e.g. internship training).
      relatedCertifications={allCerts.filter(
        (c) => c.issuer && c.issuer.slug === exp.organization?.slug,
      )}
      facts={[
        { label: t('duration'), value: formatDuration(exp.startDate, exp.endDate, typedLocale) },
        { label: t('projects'), value: exp.projects.length || null },
        { label: tSection('achievements'), value: exp.achievements.length || null },
        { label: t('workMode'), value: exp.workMode?.label },
        // The organization line already shows its own location.
        { label: t('location'), value: exp.location !== exp.organization?.location ? exp.location : null },
      ]}
    />
  );
}
