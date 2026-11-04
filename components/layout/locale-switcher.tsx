'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function LocaleSwitcher({ label = 'Switch language' }: { label?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === 'en' ? 'id' : 'en';

  const handleSwitch = () => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={label}
      onClick={handleSwitch}
      className="min-h-11 px-3 font-mono text-xs uppercase"
    >
      {locale === 'en' ? 'EN · ID' : 'ID · EN'}
    </Button>
  );
}
