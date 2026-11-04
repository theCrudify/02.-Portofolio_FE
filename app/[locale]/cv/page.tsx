import { fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { CvPrintableView, type CvExportPayload } from '@/components/pdf/cv-templates';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCvLabels } from '@/lib/cv';
import { pickExportPreset } from '@/lib/export-presets';

export default async function WebCvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Without this next-intl reads the locale from headers, which breaks on-demand static rendering.
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const site = await fetchSiteData(typedLocale);

  const labels = await getCvLabels(typedLocale);
  const t = await getTranslations({ locale: typedLocale, namespace: 'cv' });
  const preset = pickExportPreset(site.exportPresets, typedLocale);

  // Same shape as the API export; sections follow the home-page order set in the admin.
  const available: Record<string, unknown[]> = {
    experience: site.experiences,
    projects: site.featuredProjects,
    education: site.education,
    skills: site.technologies,
    certifications: site.certifications,
  };
  const sections = Object.fromEntries(
    site.settings.sections
      .filter((s) => s.visible && s.code in available)
      .map((s) => [s.code, available[s.code]!]),
  );

  const exportPayload: CvExportPayload = {
    preset: {
      slug: preset?.slug ?? 'cv',
      name: preset?.name ?? t('printTitle'),
      template: 'full',
      locale: typedLocale,
    },
    profile: site.profile,
    sections,
  };

  return (
    <div className="container mx-auto py-10 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-lg font-semibold">{t('printTitle')}</h1>
        {preset ? (
          <a
            href={`/api/pdf/${preset.slug}?locale=${typedLocale}`}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            {t('downloadPdf')}
          </a>
        ) : null}
      </div>
      <CvPrintableView data={exportPayload} labels={labels} />
    </div>
  );
}
