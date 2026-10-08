import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button, Icons, ThemeToggle, cn } from '@sl/ui';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/marketing/brand';
import { MobileNav } from './mobile-nav';
import { SmoothScroll } from './smooth-scroll';

export const CONTAINER = 'mx-auto w-full max-w-[84rem] px-5 sm:px-8';
/** The page gutter and the frame width shared by the header and every landing section (whose hairline rails sit on its edges). */
export const GUTTER = 'px-3 sm:px-6';
export const FRAME = 'mx-auto w-full max-w-[84rem]';

const FOCUS = 'rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring';

const NAV: readonly { href: string; label: string }[] = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#signals', label: 'Signals' },
  { href: '/#industries', label: 'Industries' },
  { href: '/#compliance', label: 'Compliance' },
  { href: '/#faq', label: 'FAQ' },
];

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 text-foreground', FOCUS, className)}>
      <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Icons.Radar className="size-4" strokeWidth={2.25} />
      </span>
      <span className="text-[15px] font-[560] tracking-[-0.01em]">{BRAND_NAME}</span>
    </Link>
  );
}

function SiteHeader({ showNav }: { showNav: boolean }) {
  return (
    // Leadistry's bar: plain page colour with a hairline under it, the logo and the section nav on
    // the left, "Sign in" (outlined) and the call to action (ink) on the right, both with the site's
    // 10px button corners. Its
    // content spans FRAME, the sections' width, so the logo and the pill line up with the content.
    // The sections' scroll-margin (scroll-mt-18) meets its 4.5rem.
    <header className={cn('sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85', GUTTER)}>
      <div className={cn(FRAME, 'relative flex h-18 items-center justify-between gap-3 sm:gap-6')}>
        <div className="flex items-center gap-10">
          <BrandMark />
          {showNav && (
            <nav aria-label="Page sections" className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={cn('text-sm text-foreground/75 transition-colors hover:text-foreground', FOCUS)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className={cn('h-9 rounded-[10px] border-border bg-card px-3 shadow-none', showNav && 'hidden sm:inline-flex')}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          {showNav && (
            <Button
              asChild
              size="sm"
              className="group/cta h-9 rounded-[10px] bg-foreground px-3 text-background shadow-none transition-[color,background-color,transform] hover:bg-foreground/85 motion-safe:active:scale-[0.98]"
            >
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

/** Leadistry's footer caption: small mono capitals. */
const FOOTER_LABEL = 'font-mono text-[11px] leading-none font-medium tracking-[0.14em] uppercase';

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    // Leadistry's dark footer: the same tokens scoped dark, the brand with its line and the call to
    // action on the left, link columns under mono captions, then the legal line in mono.
    <footer data-theme="dark" className="bg-sidebar text-foreground">
      <div className={cn(CONTAINER, 'flex flex-col gap-14 pt-16 pb-10 sm:pt-20')}>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
          <div className="flex max-w-sm flex-col gap-5">
            <BrandMark />
            <p className="text-sm leading-6 text-pretty text-muted-foreground">{BRAND_TAGLINE}</p>
            <Button asChild size="sm" className="group/cta h-9 w-fit rounded-lg bg-foreground px-3.5 text-background shadow-none hover:bg-foreground/85">
              <a href="/#join">
                Join the waitlist
                <Icons.ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
              </a>
            </Button>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={`Footer: ${column.title}`} className="flex flex-col gap-5">
              <h2 className={cn(FOOTER_LABEL, 'text-muted-foreground')}>{column.title}</h2>
              <ul className="flex flex-col gap-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={cn('text-foreground/80 transition-colors hover:text-foreground', FOCUS)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
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
