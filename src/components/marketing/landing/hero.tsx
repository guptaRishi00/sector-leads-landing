import type { ReactNode } from 'react';
import { Button, cn, Icons } from '@sl/ui';
import { EXAMPLE_SCORE, SEND_GATES } from '@/lib/marketing/content';
import { HeroIntro } from '../hero-intro';
import { HeroStage } from '../hero-stage';
import { GUTTER } from '../marketing-shell';
import { AppSidebar, HERO_FEED, LeadWindow } from './product';
import { BUTTON, BUTTON_INK, BUTTON_PLAIN, EDGE, INTRO } from './ui';

/**
 * A floating side card around the hero window: compact, and draggable by hand from lg (HeroStage
 * wires GSAP Draggable to `[data-drag]`). Decorative, so it's hidden from assistive tech and has no
 * keyboard role; its content is all from the page's own data.
 */
function SideCard({ title, aside, dark = false, children }: { title: string; aside?: string; dark?: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      data-drag=""
      data-theme={dark ? 'dark' : undefined}
      className={cn('overflow-hidden rounded-xl border bg-card text-left text-foreground shadow-[0_1px_2px_var(--shadow-color),0_24px_48px_-20px_var(--shadow-color)] select-none', EDGE)}
    >
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2 text-[11px]">
        <span className="font-medium">{title}</span>
        {aside !== undefined && <span className="text-muted-foreground">{aside}</span>}
      </div>
      {children}
    </div>
  );
}

/**
 * The hero's product: a window (sidebar and the example lead) in a tinted bezel, and from lg three
 * side cards (the incoming events, the send gates in a dark card, the score), each in its own
 * `[data-stage=card]` wrapper so HeroStage can bring them out one after another as the stage pins
 * (`data-from` says which side they slide out to). The cards are draggable (`[data-drag]`, inside
 * the wrapper so the scroll and the drag never move the same element). Stacking: copy < window
 * (z-10) < cards (z-20). Without motion, or below lg, nothing is pinned and the cards simply sit in
 * their final spots.
 */
function HeroVisual() {
  return (
    <HeroStage className="relative mx-auto w-full max-w-[72rem]">
      <div data-stage="window" className="relative z-10 mx-auto max-w-5xl origin-top text-left lg:mx-36 lg:max-w-none">
        {/* Attio's app window: a pale frame with the window controls on their own strip, and the
            white app inset in it with its own corners and hairline. */}
        <div className="rounded-2xl border bg-muted px-1.5 pb-1.5 shadow-[0_1px_2px_var(--shadow-color),0_24px_60px_-24px_var(--shadow-color)] sm:px-2 sm:pb-2">
          <div aria-hidden="true" className="flex h-8 items-center gap-2 px-1.5 sm:h-9">
            <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--destructive)_80%,var(--card))]" />
            <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--highlight)_50%,var(--warning-border))]" />
            <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--success)_75%,var(--card))]" />
          </div>
          {/* The app's UI at 78%: zoom (not a transform) so the layout shrinks with it and the window
              keeps its width while getting shorter. */}
          <div className={cn('flex overflow-hidden rounded-xl border bg-card [zoom:0.78]', EDGE)}>
            <AppSidebar packs chrome className="hidden md:flex" />
            <LeadWindow />
          </div>
        </div>
      </div>
      <div data-stage="card" data-from="left" className="absolute top-10 left-2 z-20 hidden w-52 lg:block">
        <SideCard title="Incoming events" aside="Public record">
          <ul className="flex flex-col gap-2 p-3">
            {HERO_FEED.slice(0, 3).map((row) => (
              <li key={`${row.source}-${row.outcome}`} className="flex flex-col gap-0.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[10px] text-muted-foreground">{row.source}</span>
                  <span className={cn('shrink-0 rounded-full px-1.5 py-px text-[9px] font-medium', row.lead === true ? 'bg-primary text-primary-foreground' : 'bg-selected text-primary')}>
                    {row.outcome}
                  </span>
                </span>
                <span className="truncate text-xs">{row.event}</span>
              </li>
            ))}
          </ul>
        </SideCard>
      </div>
      <div data-stage="card" data-from="right" className="absolute top-24 right-2 z-20 hidden w-52 lg:block">
        <SideCard title="Why it scored" aside={`${EXAMPLE_SCORE.text} of ${EXAMPLE_SCORE.max}`}>
          <ul className="flex flex-col gap-1.5 p-3">
            {EXAMPLE_SCORE.lines.map((line) => (
              <li key={line.id} className="flex items-center justify-between gap-2 text-xs">
                <span>{line.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {line.points} of {line.max}
                </span>
              </li>
            ))}
          </ul>
        </SideCard>
      </div>
      <div data-stage="card" data-from="left" className="absolute top-64 left-14 z-20 hidden w-52 lg:block">
        <SideCard dark title="Before it sends" aside={`${SEND_GATES.length} gates`}>
          <ol className="flex flex-col gap-1 p-3 font-mono text-[10px]">
            {SEND_GATES.slice(0, 4).map((gate) => (
              <li key={gate} className="flex items-center justify-between gap-2">
                <span className="truncate">{gate}</span>
                <span className="shrink-0 text-success">pass</span>
              </li>
            ))}
          </ol>
        </SideCard>
      </div>
    </HeroStage>
  );
}

/**
 * The hero's backdrop, replicated from attio.com's three layers: a radial wash rising from the
 * bottom centre (pale at the centre, periwinkle at the edges, at 40%), fine page-coloured vertical
 * lines every 8px over it (at 40%), and a huge page-coloured ellipse from the top that keeps the
 * headline on a clean page and lets the colour come up from below the buttons. Attio's three RGB
 * stops are mixed from the theme instead (--primary into --background at 12/30/55%), and "white"
 * is --background, so it follows the theme. It is sticky under the header for one screen, so the
 * colour stays behind the window while HeroStage pins it; HeroStage eases the veil back
 * (`[data-stage=veil]`) as the window rises.
 */
const WASH = 'radial-gradient(90% 80% at 50% 100%, color-mix(in oklab, var(--primary) 12%, var(--background)) 0%, color-mix(in oklab, var(--primary) 30%, var(--background)) 45%, color-mix(in oklab, var(--primary) 55%, var(--background)) 100%)';

const LINES = 'repeating-linear-gradient(90deg, color-mix(in oklab, var(--background) 78%, transparent) 0 1px, transparent 1px 8px)';

const VEIL = 'radial-gradient(70% 106.6667% at 50% 0%, var(--background) 32%, transparent 64%)';

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none sticky top-[calc(4.5rem+1px)] z-0 col-start-1 row-start-1 h-[calc(100svh-4.5rem-1px)] self-start overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: WASH }} />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: LINES }} />
      <div data-stage="veil" className="absolute top-0 left-[-150%] h-[150%] w-[400%] origin-top will-change-transform" style={{ backgroundImage: VEIL }} />
    </div>
  );
}

export function Hero() {
  return (
    // Centred copy like Attio's (the headline and both actions stay in the first screen), then the
    // product window shown whole: the hero's height comes from its content, with room under the
    // window before the next section. overflow-x-clip only (it doesn't make a scroll container, so
    // the backdrop can still stick), and the side cards can drift sideways without a scrollbar. The
    // backdrop and the content share one grid cell, as on Attio.
    <section aria-labelledby="hero-title" className="relative isolate grid overflow-x-clip border-b">
      <HeroBackdrop />
      <HeroIntro className={cn(GUTTER, 'relative z-10 col-start-1 row-start-1 flex flex-col items-center pt-[clamp(4.5rem,16svh,10rem)] pb-(--hero-pb) text-center [--hero-pb:2.5rem] sm:[--hero-pb:3rem] lg:[--hero-pb:5rem]')}>
        {/* The copy, as one block HeroStage fades and lifts away on scroll (its children keep their own intro). */}
        <div data-stage="copy" className="flex flex-col items-center">
          <a
            data-intro=""
            href="#join"
            className={cn(
              'group/badge relative inline-flex h-7 items-center gap-1.5 rounded-full border bg-card pr-2.5 pl-3 text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring',
              INTRO,
            )}
          >
            {/* A thin comet circling the border (globals.css: comet-border). */}
            <span aria-hidden="true" className="comet-border" />
            Early access waitlist is open
            <Icons.ChevronRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover/badge:translate-x-0.5" />
          </a>
          <h1
            data-intro=""
            id="hero-title"
            className={cn(
              'mt-8 max-w-[16ch] text-[2.5rem] leading-[1] font-semibold tracking-[-0.02em] text-balance text-foreground sm:max-w-[20ch] sm:text-6xl lg:max-w-none lg:text-[clamp(3rem,min(7.5svh,5vw),4.5rem)] lg:leading-[0.95] lg:whitespace-nowrap',
              INTRO,
            )}
          >
            Leads with the proof attached.
          </h1>
          <p data-intro="" className={cn('mt-6 max-w-[34rem] text-base leading-7 font-medium text-pretty text-muted-foreground sm:text-lg sm:leading-[1.55]', INTRO)}>
            Tenders, filings, new directors, hiring and funding become leads you can check. Only what you approve is sent.
          </p>
          <div data-intro="" className={cn('mt-9 flex flex-wrap items-center justify-center gap-2.5', INTRO)}>
            <Button asChild variant="outline" className={cn('h-10 px-4', BUTTON, BUTTON_PLAIN)}>
              <a href="#how-it-works">How it works</a>
            </Button>
            <Button asChild className={cn('group/cta h-10 px-4', BUTTON, BUTTON_INK)}>
              <a href="#join">
                Join the waitlist
                <Icons.ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
              </a>
            </Button>
          </div>
        </div>
        <div data-intro="" data-stage="visual" className={cn('relative mt-(--hero-gap) mb-[calc(-1*var(--rise,0px))] w-full [--hero-gap:clamp(2.5rem,9svh,5.5rem)]', INTRO)}>
          {/* Where the side cards may be dragged: from the buttons' bottom edge (--hero-gap is the
              space above this wrapper) to the hero's bottom edge (--hero-pb below it, less the
              --rise the wrapper hands back), inside the gutter. Invisible; HeroStage reads it as
              the drag bounds. */}
          <div aria-hidden="true" data-drag-zone="" className="pointer-events-none absolute inset-x-0 top-[calc(-1*var(--hero-gap))] bottom-[calc(-1*var(--hero-pb)_+_var(--rise,0px))]" />
          <HeroVisual />
        </div>
      </HeroIntro>
    </section>
  );
}
