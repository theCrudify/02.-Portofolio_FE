import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';

export const metadata: Metadata = {
  title: { default: 'Admin Panel', template: '%s — Admin Panel' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    </NextIntlClientProvider>
  );
}
