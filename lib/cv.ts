import { getTranslations } from 'next-intl/server';
import type { CvLabels } from '@/components/pdf/cv-templates';
import type { SupportedLocale } from '@/lib/api/types';

export async function getCvLabels(locale: SupportedLocale): Promise<CvLabels> {
  const t = await getTranslations({ locale, namespace: 'cv' });
  return {
    experience: t('experience'),
    projects: t('projects'),
    education: t('education'),
    skills: t('skills'),
    certifications: t('certifications'),
    responsibilities: t('responsibilities'),
    present: t('present'),
    gpa: t('gpa'),
  };
}
