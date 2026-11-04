import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { ProjectLinks } from '@/components/project/project-links';
import { buildPersonJsonLd } from '@/components/seo/json-ld';
import { formatPeriod } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

describe('T06 & T07 · Public Pages, Formatting, ProjectLinks & SEO', () => {
  it('formats periods in EN and ID with duration', () => {
    const fixedNow = new Date('2026-10-15T00:00:00Z');
    const enPeriod = formatPeriod('2025-01-01', null, 'en', fixedNow);
    expect(enPeriod).toContain('Jan 2025 – Present');
    expect(enPeriod).toContain('1 yr 10 mos');

    const idPeriod = formatPeriod('2025-01-01', null, 'id', fixedNow);
    expect(idPeriod).toContain('Jan 2025 – Sekarang');
    expect(idPeriod).toContain('1 thn 10 bln');
  });

  it('renders ProjectLinks with private repository as badge and public link as anchor', () => {
    render(
      <ProjectLinks
        projectSlug="cashier-app"
        privateLabel="Private repo"
        links={[
          {
            type: 'demo',
            label: 'Live Demo',
            url: 'https://demo.example.com',
            isPrivate: false,
          },
          {
            type: 'repo',
            label: 'Backend Source',
            url: null,
            isPrivate: true,
          },
        ]}
      />,
    );

    const demoLink = screen.getByRole('link', { name: /Live Demo/i });
    expect(demoLink.getAttribute('href')).toBe('https://demo.example.com');
    expect(screen.getByText(/Private repo/i)).toBeDefined();
  });

  it('builds metadata with canonical and hreflang alternates (en, id, x-default)', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://portfolio.example.com';

    const enMeta = buildMetadata({
      title: 'Cashier App',
      description: 'POS case study',
      path: '/projects/cashier-app',
      locale: 'en',
    });

    expect(enMeta.alternates?.canonical).toBe(
      'https://portfolio.example.com/projects/cashier-app',
    );
    expect(enMeta.alternates?.languages).toEqual({
      en: 'https://portfolio.example.com/projects/cashier-app',
      id: 'https://portfolio.example.com/id/projects/cashier-app',
      'x-default': 'https://portfolio.example.com/projects/cashier-app',
    });

    const idMeta = buildMetadata({
      title: 'Aplikasi Kasir',
      description: 'Studi kasus POS',
      path: '/projects/cashier-app',
      locale: 'id',
    });
    expect(idMeta.alternates?.canonical).toBe(
      'https://portfolio.example.com/id/projects/cashier-app',
    );
  });

  it('generates valid Person JSON-LD, robots.txt, and sitemap.xml', async () => {
    const personLd = buildPersonJsonLd({
      name: 'Jidan Fathilla',
      headline: 'Fullstack Engineer',
      bio: 'Bio',
      avatar: null,
      location: 'Jakarta',
      timezone: 'Asia/Jakarta',
      email: 'jidan@example.com',
      socials: { github: 'https://github.com/jidan' },
      availability: 'open_to_work',
      workPreference: 'remote',
      languages: [{ name: 'English', level: 'professional' }],
      interests: [],
      referencesNote: null,
      careerStartDate: '2022-01-01',
      updatedAt: '2026-05-01T00:00:00Z',
    });

    expect(personLd['@type']).toBe('Person');
    expect(personLd.name).toBe('Jidan Fathilla');

    const robotsConfig = robots();
    expect(robotsConfig.sitemap).toContain('/sitemap.xml');

    const sitemapEntries = await sitemap();
    expect(sitemapEntries.some((e) => e.url.endsWith('/projects/cashier-app'))).toBe(true);
  });
});
