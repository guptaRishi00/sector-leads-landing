import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { themeScript } from '@sl/ui';
import './globals.css';

// IBM Plex: an engineered, data-first face suited to a compliance-heavy B2B product, with a mono
// for the evidence, scores and sources. The variables keep their Geist names because the shared
// theme.css (@sl/ui) reads --font-geist-sans / --font-geist-mono; the main app's layout needs the
// same swap.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
