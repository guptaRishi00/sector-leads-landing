import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button, Icons, ThemeToggle, cn } from '@sl/ui';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/marketing/brand';
import { MobileNav } from './mobile-nav';
import { SmoothScroll } from './smooth-scroll';

export const CONTAINER = 'mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8';

const FOCUS =
  'rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring';

const NAV: readonly { href: string; label: string }[] = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#signals', label: 'Signals' },
  { href: '/#industries', label: 'Industries' },
  { href: '/#compliance', label: 'Compliance' },
  { href: '/#faq', label: 'FAQ' },
];

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 font-semibold text-foreground', FOCUS, className)}>
      <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Icons.Radar className="size-4" strokeWidth={2.25} />
      </span>
      <span className="text-[15px]">{BRAND_NAME}</span>
    </Link>
  );
}

function SiteHeader({ showNav }: { showNav: boolean }) {
  return (
    // A floating shell rather than a full-width bar: inset from the edges, rounded, glass. The
    // sections' scroll-margin (scroll-mt-20/28) clears its 4.25rem. From lg its left padding puts
    // the logo on the content edge: 1rem while the page's 1rem margin still insets the shell,
    // 2rem once the viewport is wider than max-w-6xl plus those margins (74rem).
    <header className="sticky top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-3">
      <div className="glass relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 rounded-2xl border border-border/80 pr-2 pl-3 shadow-[0_8px_24px_-12px_var(--shadow-color)] sm:gap-6 sm:pr-2.5 sm:pl-5 lg:pl-4 min-[74rem]:pl-8">
        <BrandMark />
        {showNav && (
          <nav aria-label="Page sections" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={cn('text-sm text-muted-foreground transition-colors hover:text-foreground', FOCUS)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/sign-in" className={cn('text-sm font-medium text-foreground/80 transition-colors hover:text-foreground', showNav && 'hidden sm:inline', FOCUS)}>
            Sign in
          </Link>
          {showNav && (
            <Button asChild size="sm" className="group/cta">
              <a href="#join">
                Join the waitlist
                <Icons.ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
              </a>
            </Button>
          )}
          {showNav && <MobileNav items={NAV} />}
        </div>
      </div>
    </header>
  );
}

const FOOTER_COLUMNS: readonly { title: string; links: readonly { href: string; label: string }[] }[] = [
  { title: 'Product', links: [...NAV.filter((item) => item.href !== '/#faq'), { href: '/#evidence', label: 'Evidence' }] },
  {
    title: 'Company',
    links: [
      { href: '/#faq', label: 'FAQ' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/sign-in', label: 'Sign in' },
    ],
  },
];

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className={cn(CONTAINER, 'flex flex-col gap-12 pt-14 pb-10 sm:pt-16')}>
        <div className="grid gap-10 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
          <div className="flex max-w-sm flex-col gap-3">
            <BrandMark />
            <p className="text-sm text-pretty text-muted-foreground">{BRAND_TAGLINE}</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={`Footer: ${column.title}`} className="flex flex-col gap-3.5">
              <h2 className="text-[13px] font-medium text-foreground">{column.title}</h2>
              <ul className="flex flex-col gap-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={cn('text-muted-foreground transition-colors hover:text-foreground', FOCUS)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-[13px] text-muted-foreground">
            © {year} {BRAND_NAME}
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

/** The public pages' frame: header, main landmark and footer. */
export function MarketingShell({ children, showNav = false }: { children: ReactNode; showNav?: boolean }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:outline-2 focus:outline-ring focus:outline-solid"
      >
        Skip to content
      </a>
      {/* Motion starts hidden (GSAP hero intro, Framer reveals); without JavaScript, show it all. */}
      <noscript>
        <style>{'[data-intro],[data-reveal]{opacity:1!important;visibility:visible!important;transform:none!important}'}</style>
      </noscript>
      <SmoothScroll />
      <SiteHeader showNav={showNav} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
