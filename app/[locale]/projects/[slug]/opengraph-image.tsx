import { ImageResponse } from 'next/og';
import { fetchProjectDetail } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const project = await fetchProjectDetail(slug, typedLocale);

  const title = project?.title ?? 'Project Case Study';
  const summary = project?.summary ?? '';
  const techs = project
    ? [
        ...project.technologies.frontend,
        ...project.technologies.backend,
        ...project.technologies.database,
        ...project.technologies.devops,
      ]
        .slice(0, 3)
        .map((t) => t.name)
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '72px',
          backgroundColor: 'rgb(15, 23, 42)',
          color: 'rgb(248, 250, 252)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgb(96, 165, 250)',
          }}
        >
          CASE STUDY
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '60px', fontWeight: 700, lineHeight: 1.15 }}>
            {title}
          </div>
          <div
            style={{
              fontSize: '28px',
              lineHeight: 1.4,
              color: 'rgb(203, 213, 225)',
              maxWidth: '960px',
            }}
          >
            {summary}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {techs.map((tech) => (
            <div
              key={tech}
              style={{
                display: 'flex',
                padding: '8px 20px',
                borderRadius: '999px',
                backgroundColor: 'rgb(30, 41, 59)',
                color: 'rgb(226, 232, 240)',
                fontSize: '20px',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

