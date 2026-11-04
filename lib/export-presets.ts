import type { SiteData, SupportedLocale } from '@/lib/api/types';

/** Public CV preset for a locale: a full CV in that language, else any in it, else any. */
export function pickExportPreset(presets: SiteData['exportPresets'], locale: SupportedLocale) {
  return (
    presets.find((p) => p.locale === locale && p.template === 'full') ??
    presets.find((p) => p.locale === locale) ??
    presets[0] ??
    null
  );
}
