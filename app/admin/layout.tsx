import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/layout/theme-provider';
import enMessages from '@/messages/en.json';

export const metadata: Metadata = {
  title: { default: 'Admin Panel', template: '%s — Admin Panel' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {/* Admin is outside app/[locale], so it needs its own provider for the theme toggle to work. */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="font-pair-geist min-h-screen bg-background text-foreground">{children}</div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

