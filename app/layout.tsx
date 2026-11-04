import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { allFontVariables } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal Portfolio & Case Studies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={allFontVariables}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
