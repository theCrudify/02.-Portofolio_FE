import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { routing, type AppLocale } from '@/i18n/routing';

import { fetchSiteData } from '@/lib/api/server';
import { getFontPairClass } from '@/lib/fonts';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Without this next-intl reads the locale from headers, which breaks on-demand static rendering.
  setRequestLocale(locale);

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  const typedLocale = locale as AppLocale;
  const [messages, site] = await Promise.all([
    getMessages({ locale: typedLocale }),
    fetchSiteData(typedLocale),
  ]);

  const themePreset = site.settings?.themePreset || 'slate';
  const colorMode = site.settings?.colorMode || 'system';
  const fontPairClass = getFontPairClass(site.settings?.fontPair);
  const brandName = site.profile?.name || 'Portfolio';

  return (
    <NextIntlClientProvider locale={typedLocale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme={colorMode}
        enableSystem
      >
        <div
          data-theme={themePreset}
          lang={typedLocale}
          className={`bg-page-canvas flex min-h-screen flex-col text-foreground ${fontPairClass}`}
        >
          <PageViewTracker locale={typedLocale} />
          <Navbar brandName={brandName} />

          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer
            name={brandName}
            socials={site.profile?.socials}
            updatedAt={site.profile?.updatedAt}
          />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
