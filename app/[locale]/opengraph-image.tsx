import { ImageResponse } from 'next/og';
import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const site = await fetchSiteData(typedLocale);

  const name = site.profile?.name ?? 'Portfolio';
  const headline = site.profile?.headline ?? 'Fullstack Software Engineer';

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
          PORTFOLIO · {typedLocale.toUpperCase()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '68px', fontWeight: 700, lineHeight: 1.1 }}>
            {name}
          </div>
          <div
            style={{
              fontSize: '32px',
              lineHeight: 1.4,
              color: 'rgb(203, 213, 225)',
              maxWidth: '960px',
            }}
          >
            {headline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '20px',
            color: 'rgb(148, 163, 184)',
          }}
        >
          {site.profile?.location ?? 'Remote'}
        </div>
      </div>
    ),
    { ...size },
  );
}

