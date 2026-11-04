'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { Button } from '@/components/ui/button';

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <Section eyebrow="500" title={t('errorTitle')} subtitle={t('errorDesc')}>
      <Button type="button" onClick={reset}>
        {t('retry')}
      </Button>
    </Section>
  );
}
