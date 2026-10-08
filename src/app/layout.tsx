import type { Metadata } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { themeScript } from '@sl/ui';
import './globals.css';

// Leadistry's type: Inter for the text, Inter Tight for the headings (--font-display, a landing
// utility in globals.css) and JetBrains Mono for the eyebrows, evidence, scores and captions. All
// are self-hosted by next/font. The text and mono variables keep their Geist names because the
// shared theme.css (@sl/ui) reads --font-geist-sans / --font-geist-mono; the main app's layout
// needs the same swap.
const inter = Inter({
  subsets: ['latin'],
  // The optical-size axis: large headings get Inter's display cut (Attio's "Inter Display").
  axes: ['opsz'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'sector-leads',
};

// Preview version of the main app's root layout. The real one also reads a per-request CSP
// nonce for the theme script and mounts the app-wide toast and tooltip providers, which the
// public pages do not use.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
