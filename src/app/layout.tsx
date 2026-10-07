import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { themeScript } from '@sl/ui';
import './globals.css';

// Inter (variable, with the optical-size axis so headings use the display cut) for the text, and
// IBM Plex Mono for the evidence, scores, sources and captions. Both are self-hosted by next/font.
// The variables keep their Geist names because the shared theme.css (@sl/ui) reads
// --font-geist-sans / --font-geist-mono; the main app's layout needs the same swap.
const inter = Inter({
  subsets: ['latin'],
  // The optical-size axis: large headings get Inter's display cut (Attio's "Inter Display").
  axes: ['opsz'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
