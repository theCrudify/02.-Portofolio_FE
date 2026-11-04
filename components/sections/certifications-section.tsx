import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { CertificationCard } from '@/components/sections/certification-card';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicCertification, SupportedLocale } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface CertificationsSectionProps {
  certifications: PublicCertification[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function CertificationsSection({
  certifications,
  locale,
  muted,
}: CertificationsSectionProps) {
  const t = useTranslations('sections.certifications');
  if (!certifications || certifications.length === 0) return null;

  return (
    <Section
      id="certifications"
      eyebrow={t('eyebrow')}
      title={t('title')}
      muted={muted}
      actions={
        <Link href="/certifications" className={buttonVariants({ variant: 'outline' })}>
          <span>{t('viewAll')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          certifications.length === 1
            ? 'lg:grid-cols-1'
            : certifications.length === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {certifications.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} locale={locale} />
        ))}
      </div>
    </Section>
  );
}
