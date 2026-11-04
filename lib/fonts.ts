import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
} from 'next/font/google';

export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const allFontVariables = [
  geistSans.variable,
  geistMono.variable,
  inter.variable,
  jetbrainsMono.variable,
  instrumentSerif.variable,
].join(' ');

export type FontPair = 'geist' | 'inter' | 'serif-accent';

export function getFontPairClass(fontPair?: string | null): string {
  if (fontPair === 'inter') {
    return 'font-pair-inter';
  }
  if (fontPair === 'serif-accent') {
    return 'font-pair-serif-accent';
  }
  return 'font-pair-geist';
}

