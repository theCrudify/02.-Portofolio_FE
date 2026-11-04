import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/layout/section';
import { ProjectGrid } from '@/components/project/project-grid';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { fetchProjectsList, fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const t = await getTranslations({ locale: typedLocale, namespace: 'sections.projects' });

  return buildMetadata({
    title: t('title'),
    description: t('eyebrow'),
    path: '/projects',
    locale: typedLocale,
  });
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ technology?: string; type?: string; page?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';

  const [t, site, projectsResult] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.projects' }),
    fetchSiteData(typedLocale),
    fetchProjectsList({
      locale: typedLocale,
      technology: query.technology,
      type: query.type,
      page: query.page ? Number(query.page) : 1,
    }),
  ]);

  const allTechs = [
    ...site.technologies.frontend,
    ...site.technologies.backend,
    ...site.technologies.database,
    ...site.technologies.devops,
    ...site.technologies.tools,
  ];

  const projectTypes = [
    'personal',
    'freelance',
    'company',
    'open_source',
    'hackathon',
  ] as const;

  return (
    <Section eyebrow={t('eyebrow')} title={t('title')}>
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/projects"
            className={cn(
              buttonVariants({
                variant: !query.type ? 'default' : 'outline',
                size: 'sm',
              }),
            )}
          >
            {t('allTypes')}
          </Link>
          {projectTypes.map((pType) => (
            <Link
              key={pType}
              href={`/projects?type=${pType}${query.technology ? `&technology=${query.technology}` : ''}`}
              className={cn(
                buttonVariants({
                  variant: query.type === pType ? 'default' : 'outline',
                  size: 'sm',
                }),
                'capitalize',
              )}
            >
              {pType.replace('_', ' ')}
            </Link>
          ))}
        </div>

        {allTechs.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={query.type ? `/projects?type=${query.type}` : '/projects'}
              className={cn(
                buttonVariants({
                  variant: !query.technology ? 'secondary' : 'outline',
                  size: 'sm',
                }),
              )}
            >
              {t('allTech')}
            </Link>
            {allTechs.map((tech) => (
              <Link
                key={tech.slug}
                href={`/projects?technology=${tech.slug}${query.type ? `&type=${query.type}` : ''}`}
                className={cn(
                  buttonVariants({
                    variant: query.technology === tech.slug ? 'default' : 'outline',
                    size: 'sm',
                  }),
                )}
              >
                {tech.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <ProjectGrid projects={projectsResult.data} />
    </Section>
  );
}
