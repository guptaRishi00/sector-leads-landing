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
    <header className="glass sticky top-0 z-40 border-b border-border/70">
      <div className={cn(CONTAINER, 'flex h-16 items-center justify-between gap-3 sm:gap-6')}>
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

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className={cn(CONTAINER, 'flex flex-col gap-10 py-12 sm:py-14')}>
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="flex max-w-sm flex-col gap-3">
            <BrandMark />
            <p className="text-sm text-pretty text-muted-foreground">{BRAND_TAGLINE}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2.5 text-sm sm:items-end">
              <li>
                <Link href="/sign-in" className={cn('text-foreground/80 hover:text-foreground', FOCUS)}>
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={cn('text-foreground/80 hover:text-foreground', FOCUS)}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={cn('text-foreground/80 hover:text-foreground', FOCUS)}>
                  Terms
                </Link>
              </li>
            </ul>
          </nav>
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
