'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn, Icons } from '@sl/ui';
import { HOVER_PRIMARY } from './hover';

/** Scroll past this and the bar detaches into a pill (as the desktop header and SoftexEdge's both do). */
const SCROLLED = 80;

const FOCUS = 'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring';

/**
 * Frosted glass in the page's own palette, as the hero's glass side cards: blur and saturation over
 * what scrolls beneath, a light rim, an inner highlight along the top edge, a soft diagonal sheen
 * with a hint of the theme's pale blue, and a gentle lift. The ground's opacity is set per state.
 */
const GLASS =
  'border border-[color-mix(in_oklab,var(--card)_60%,var(--border))] bg-linear-to-br from-[color-mix(in_oklab,var(--card)_55%,transparent)] via-transparent to-[color-mix(in_oklab,var(--selected-border)_25%,transparent)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--card)_90%,transparent),0_1px_2px_var(--shadow-color),0_24px_48px_-20px_var(--shadow-color)]';

/**
 * The header below `lg`, after SoftexEdge's mobile navbar: the logo and a menu toggle only. At the
 * top it is the plain full-width bar. Scrolled, it detaches into a narrow frosted-glass pill a little
 * below the top; opened (at any scroll), it widens into a glass card and the menu unfolds inside that
 * same surface: large links between hairlines, Sign in, then a full-width "Join the waitlist".
 * SoftexEdge's is dark; this one is white glass (GLASS), on request. The menu is a CSS grid-rows accordion (always mounted,
 * `invisible` when closed so its links leave the tab order). Closes on a link, Escape or resizing
 * to `lg`. While open it marks the header `data-menu-open`, so the header's own ground clears.
 */
export function MobileNav({ items, brand, className }: { items: readonly { href: string; label: string }[]; brand: ReactNode; className?: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last: boolean | null = null;
    const onScroll = () => {
      const next = window.scrollY > SCROLLED;
      if (next === last) return;
      last = next;
      setScrolled(next);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    ref.current?.closest('header')?.toggleAttribute('data-menu-open', open);
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const wide = window.matchMedia('(min-width: 64rem)');
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', close);
    };
  }, [open]);

  const floating = scrolled || open;
  const close = () => setOpen(false);

  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto flex flex-col overflow-hidden transition-[width,translate,border-radius,background-color,border-color,box-shadow] duration-300 ease-out lg:hidden motion-reduce:transition-none',
        open ? 'w-full rounded-[18px]' : scrolled ? 'w-[max(69%,15.5rem)] rounded-2xl' : 'w-full rounded-none',
        floating ? cn('translate-y-2.5', GLASS) : 'translate-y-0 border-0 bg-transparent',
        // The open card is a little more opaque than the pill, so the menu's text stays crisp over the page.
        open ? 'bg-[color-mix(in_oklab,var(--card)_80%,transparent)]' : scrolled && 'bg-[color-mix(in_oklab,var(--card)_60%,transparent)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-full shrink-0 items-center justify-between transition-[height,padding] duration-300 ease-out motion-reduce:transition-none',
          open ? 'h-16 px-5' : scrolled ? 'h-14 px-4' : 'h-18 px-0',
        )}
      >
        {brand}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className={cn('-mr-1 inline-flex size-10 items-center justify-center rounded-[10px] text-foreground', FOCUS)}
        >
          {open ? <Icons.X aria-hidden="true" className="size-6" /> : <Icons.Menu aria-hidden="true" className="size-6" />}
        </button>
      </div>

      <div
        className={cn(
          'grid w-full transition-[grid-template-rows,opacity,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          open ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <nav id={id} aria-label="Page sections" className="flex flex-col px-5 pt-1 pb-5">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href} className="border-b border-border/70">
                  <a href={item.href} onClick={close} className={cn('flex w-full py-3.5 text-xl font-medium text-foreground/90 transition-colors hover:text-foreground', FOCUS)}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/sign-in" onClick={close} className={cn('flex w-full py-3.5 text-xl font-medium text-foreground/90 transition-colors hover:text-foreground', FOCUS)}>
                  Sign in
                </Link>
              </li>
            </ul>
            <a
              href="#join"
              onClick={close}
              className={cn(
                'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-semibold tracking-tight text-primary-foreground transition-colors',
                HOVER_PRIMARY,
                FOCUS,
              )}
            >
              Join the waitlist
              <Icons.ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
