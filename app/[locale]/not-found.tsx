import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default function LocaleNotFound() {
  const t = useTranslations('common');

  return (
    <Section eyebrow="404" title={t('notFoundTitle')} subtitle={t('notFoundDesc')}>
      <Link href="/" className={buttonVariants({ variant: 'default' })}>
        {t('backToHome')}
      </Link>
    </Section>
  );
}
