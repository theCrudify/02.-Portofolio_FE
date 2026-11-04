import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Section } from '@/components/layout/section';
import {
  MultiImageShowcase,
  type ShowcaseImageEntry,
} from '@/components/media/multi-image-showcase';
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
  searchParams: Promise<{
    technology?: string;
    type?: string;
    page?: string;
    search?: string;
    q?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    all?: string;
  }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
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
      search: query.search ?? query.q,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      all: query.all === 'true' || query.all === '1',
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

  const showcaseItems: ShowcaseImageEntry[] = [];
  for (const proj of projectsResult.data) {
    if (proj.images && proj.images.length > 0) {
      proj.images.forEach((img, idx) => {
        showcaseItems.push({
          id: `${proj.slug}-${idx}`,
          url: img.url,
          alt: img.alt || proj.title,
          title: proj.title,
          caption: img.caption ?? proj.summary,
          category: proj.type.replace('_', ' '),
          width: img.width,
          height: img.height,
        });
      });
    } else if (proj.cover) {
      showcaseItems.push({
        id: `${proj.slug}-cover`,
        url: proj.cover.url,
        alt: proj.cover.alt || proj.title,
        title: proj.title,
        caption: proj.summary,
        category: proj.type.replace('_', ' '),
        width: proj.cover.width,
        height: proj.cover.height,
      });
    }
  }

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

      <div className="space-y-14">
        <ProjectGrid projects={projectsResult.data} />

        {showcaseItems.length > 1 ? (
          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-bold text-foreground">{t('gallery')}</h2>
            <MultiImageShowcase items={showcaseItems} defaultLayout="bento" />
          </div>
        ) : null}
      </div>
    </Section>
  );
}
