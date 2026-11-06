import { Suspense } from 'react';
import { AutoPrint, PrintCvButton } from '@/components/pdf/print-controls';
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

  // Same shape as the API export. A CV reads experience first, whatever the home-page order;
  // sections hidden in the admin stay hidden.
  const available: Record<string, unknown[]> = {
    experience: site.experiences,
    projects: site.featuredProjects,
    skills: site.technologies,
    education: site.education,
    certifications: site.certifications,
  };
  const visible = new Set(site.settings.sections.filter((s) => s.visible).map((s) => s.code));
  const sections = Object.fromEntries(
    Object.entries(available).filter(([code]) => visible.has(code)),
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
        <PrintCvButton label={t('downloadPdf')} />
      </div>
      <Suspense>
        <AutoPrint />
      </Suspense>
      <CvPrintableView data={exportPayload} labels={labels} />
    </div>
  );
}
