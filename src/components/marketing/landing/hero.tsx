import type { CSSProperties, ReactNode } from 'react';
import { Button, cn, Icons } from '@sl/ui';
import { EXAMPLE_SCORE, SEND_GATES } from '@/lib/marketing/content';
import { CloudShader } from '../cloud-shader';
import { HeroIntro } from '../hero-intro';
import { HeroStage } from '../hero-stage';
import { GUTTER } from '../marketing-shell';
import { AppSidebar, HERO_FEED, LeadWindow } from './product';
import { AppWindow, BUTTON, BUTTON_PLAIN, BUTTON_PRIMARY, INTRO, TrustRow } from './ui';

type Surface = 'glass' | 'liquid';

/**
 * The side cards' grounds. One shadow utility each (an inset highlight and the lift together, since
 * a second shadow class would replace the first). Token mixes in oklab, so they hold in both themes.
 * - glass: frosted glass over a cool aurora: a clearish card ground with two wide, soft elliptical
 *   blooms of the theme's blues (the accent from the top right, the pale selection blue from the
 *   bottom left) and a white sheen at the top left, the window blurred and saturated behind it.
 * - liquid: liquid glass: a clearer ground than glass with a stronger blur and saturation, a light
 *   rim (bright along the top, softer down the left, a faint shade along the bottom), an inner glow
 *   and a diagonal specular sheen, so it reads as a thick, wet pane. `--rim` is the light it catches:
 *   white on the light page, a soft white haze in dark mode.
 */
const SURFACE: Record<Surface, { className: string; style?: CSSProperties }> = {
  glass: {
    className:
      'border-[color-mix(in_oklab,var(--card)_55%,var(--border))] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--card)_85%,transparent),0_1px_2px_var(--shadow-color),0_24px_48px_-20px_var(--shadow-color)] backdrop-blur-xl backdrop-saturate-150',
    style: {
      backgroundColor: 'color-mix(in oklab, var(--card) 70%, transparent)',
      backgroundImage: [
        'radial-gradient(70% 55% at 12% 0%, color-mix(in oklab, var(--card) 90%, transparent) 0%, transparent 70%)',
        'radial-gradient(130% 90% at 100% 0%, color-mix(in oklab, var(--primary) 20%, transparent) 0%, transparent 62%)',
        'radial-gradient(120% 100% at 0% 100%, color-mix(in oklab, var(--selected-border) 55%, transparent) 0%, transparent 68%)',
      ].join(', '),
    },
  },
  liquid: {
    className:
      '[--rim:var(--card)] dark:[--rim:color-mix(in_oklab,var(--foreground)_35%,transparent)] border-[color-mix(in_oklab,var(--border)_80%,transparent)] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--rim)_95%,transparent),inset_1px_0_0_color-mix(in_oklab,var(--rim)_50%,transparent),inset_0_-1px_1px_color-mix(in_oklab,var(--foreground)_8%,transparent),inset_0_0_16px_color-mix(in_oklab,var(--rim)_35%,transparent),0_1px_2px_var(--shadow-color),0_24px_48px_-20px_var(--shadow-color)] backdrop-blur-2xl backdrop-saturate-[1.8]',
    style: {
      backgroundColor: 'color-mix(in oklab, var(--card) 45%, transparent)',
      backgroundImage:
        'linear-gradient(135deg, color-mix(in oklab, var(--rim) 60%, transparent) 0%, transparent 36%, transparent 70%, color-mix(in oklab, var(--rim) 30%, transparent) 100%)',
    },
  },
};

/** The cards' inner hairlines: the border colour, half clear. */
const CLEAR_LINE = 'border-[color-mix(in_oklab,var(--border)_60%,transparent)]';

/**
 * A floating side card around the hero window: compact, and draggable by hand from lg (HeroStage
 * wires GSAP Draggable to `[data-drag]`). Decorative, so it's hidden from assistive tech and has no
 * keyboard role; its content is all from the page's own data.
 */
function SideCard({ title, aside, surface = 'glass', children }: { title: string; aside?: string; surface?: Surface; children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      data-drag=""
      style={SURFACE[surface].style}
      className={cn('overflow-hidden rounded-xl border text-left text-foreground select-none', SURFACE[surface].className)}
    >
      <div className={cn('flex items-center justify-between gap-3 border-b px-3 py-2 text-[11px]', CLEAR_LINE)}>
        <span className="font-medium">{title}</span>
        {aside !== undefined && <span className="text-muted-foreground">{aside}</span>}
      </div>
      {children}
    </div>
  );
}

/**
 * The hero's product: a window (sidebar and the example lead) in a tinted bezel, and from lg three
 * side cards (the incoming events and the score on glass, the send gates on liquid glass), each in its own
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
        {/* Attio's app window; the app's UI at 78%: zoom (not a transform) so the layout shrinks
            with it and the window keeps its width while getting shorter. */}
        <AppWindow shadow innerClassName="flex [zoom:0.78]">
          <AppSidebar packs chrome className="hidden md:flex" />
          <LeadWindow />
        </AppWindow>
      </div>
      <div data-stage="card" data-from="left" className="absolute top-10 left-2 z-20 hidden w-60 lg:block">
        <SideCard surface="glass" title="Incoming events" aside="Public record">
          {/* One event per divided row, plain text only: what happened, then where it was read with its
              outcome set against it on the right (the lead in the accent, the rest in grey). */}
          <ul className="flex flex-col divide-y divide-[color-mix(in_oklab,var(--border)_60%,transparent)]">
            {HERO_FEED.slice(0, 3).map((row) => (
              <li key={`${row.source}-${row.outcome}`} className="flex flex-col gap-1.5 px-3 py-2.5">
                <span className="truncate text-xs leading-none font-medium">{row.event}</span>
                <span className="flex items-baseline justify-between gap-3 text-[10px] leading-none">
                  <span className="truncate font-mono text-muted-foreground">{row.source}</span>
                  <span className={cn('shrink-0 font-medium', row.lead === true ? 'text-primary' : 'text-muted-foreground')}>{row.outcome}</span>
                </span>
              </li>
            ))}
          </ul>
        </SideCard>
      </div>
      <div data-stage="card" data-from="right" className="absolute top-24 right-2 z-20 hidden w-52 lg:block">
        <SideCard surface="glass" title="Why it scored" aside={`${EXAMPLE_SCORE.text} of ${EXAMPLE_SCORE.max}`}>
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
        <SideCard surface="liquid" title="Before it sends" aside={`${SEND_GATES.length} gates`}>
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
const WASH =
  'radial-gradient(90% 80% at 50% 100%, color-mix(in oklab, var(--primary) 12%, var(--background)) 0%, color-mix(in oklab, var(--primary) 30%, var(--background)) 45%, color-mix(in oklab, var(--primary) 55%, var(--background)) 100%)';

const LINES = 'repeating-linear-gradient(90deg, color-mix(in oklab, var(--background) 78%, transparent) 0 1px, transparent 1px 8px)';

const VEIL = 'radial-gradient(70% 106.6667% at 50% 0%, var(--background) 32%, transparent 64%)';

/**
 * Which hero background is live. 'clouds' (2026-10-09) is Aceternity's cloud shader under white copy;
 * 'classic' is the earlier one, kept intact for a quick revert if the client prefers it: the blue
 * wash, the fine vertical lines and the white veil HeroStage eases back on scroll, under the
 * theme's dark copy. Switching this one word swaps both the backdrop and the copy colours. (`as`
 * keeps the type wide: with a plain annotation TypeScript narrows it, and the comparison below
 * fails to compile once the value is changed.)
 */
const HERO_BACKGROUND = 'clouds' as 'clouds' | 'classic';
const ON_SKY = HERO_BACKGROUND === 'clouds';

/** The backdrop's frame: one screen tall and sticky, behind the content in the same grid cell. */
const BACKDROP = 'pointer-events-none sticky top-[calc(4.5rem+1px)] z-0 col-start-1 row-start-1 h-[calc(100svh-4.5rem-1px)] self-start overflow-hidden';

function ClassicBackdrop() {
  return (
    <div aria-hidden="true" className={BACKDROP}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: WASH }} />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: LINES }} />
      <div data-stage="veil" className="absolute top-0 left-[-150%] h-[150%] w-[400%] origin-top will-change-transform" style={{ backgroundImage: VEIL }} />
    </div>
  );
}

/** A soft blue shade behind the copy, so the white text holds when a cloud drifts behind it. */
const SKY_SHADE = 'radial-gradient(70% 50% at 50% 34%, rgb(24 64 120 / 0.32) 0%, rgb(24 64 120 / 0.12) 55%, transparent 80%)';

/**
 * Drifting clouds in a blue sky, rendered at 1x (soft clouds lose nothing, and it's a per-pixel
 * shader). It sticks at the very top, so the sky shows around the header once that shrinks to a
 * pill, and its lower third fades into the page colour: at the hero's end that's where the next
 * section begins, so the sky melts into it instead of stopping at a line.
 */
function CloudBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none sticky top-0 z-0 col-start-1 row-start-1 h-svh self-start overflow-hidden">
      <CloudShader maxDpr={1} className="absolute inset-0 min-h-0" />
      <div className="absolute inset-0 max-sm:[background-size:100%_120%]" style={{ backgroundImage: SKY_SHADE }} />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-b from-transparent via-background/60 to-background" />
    </div>
  );
}

const HeroBackdrop = ON_SKY ? CloudBackdrop : ClassicBackdrop;

/**
 * The copy's colours on each background. The sky is the same in both themes, so on it the copy is
 * white (as in Aceternity's demo) with a soft shadow for the clouds drifting behind it.
 */
const COPY = ON_SKY
  ? {
      title: 'text-white drop-shadow-[0_2px_12px_rgb(15_40_80/0.35)]',
      accent: 'text-white/75',
      lead: 'text-white/90 drop-shadow-[0_1px_8px_rgb(15_40_80/0.35)]',
      trust: 'text-white/85 [&_svg]:text-white drop-shadow-[0_1px_6px_rgb(15_40_80/0.3)]',
    }
  : { title: 'text-foreground', accent: 'text-primary', lead: 'text-muted-foreground', trust: '' };

export function Hero() {
  return (
    // Centred copy like Attio's (the headline and both actions stay in the first screen), then the
    // product window shown whole: the hero's height comes from its content, with room under the
    // window before the next section. overflow-x-clip only (it doesn't make a scroll container, so
    // the backdrop can still stick), and the side cards can drift sideways without a scrollbar. The
    // backdrop and the content share one grid cell, as on Attio.
    <section aria-labelledby="hero-title" className={cn('relative isolate grid overflow-x-clip', !ON_SKY && 'border-b')}>
      <HeroBackdrop />
      <HeroIntro
        className={cn(
          GUTTER,
          'relative z-10 col-start-1 row-start-1 flex flex-col items-center pt-[clamp(4.5rem,16svh,10rem)] pb-(--hero-pb) text-center [--hero-pb:2.5rem] sm:[--hero-pb:3rem] lg:[--hero-pb:5rem]',
        )}
      >
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
              'mt-8 max-w-[16ch] font-display text-[2.75rem] leading-[1] font-medium tracking-[-0.025em] text-balance sm:max-w-[20ch] sm:text-[4rem] lg:max-w-none lg:text-[clamp(3rem,min(9svh,6vw),5.75rem)] lg:leading-[0.95] lg:whitespace-nowrap',
              COPY.title,
              INTRO,
            )}
          >
            Leads with <span className={COPY.accent}>the proof attached.</span>
          </h1>
          <p data-intro="" className={cn('mt-6 max-w-[34rem] text-base leading-7 text-pretty sm:text-lg sm:leading-[1.55]', COPY.lead, INTRO)}>
            Tenders, filings, new directors, hiring and funding become leads you can check. Only what you approve is sent.
          </p>
          <div data-intro="" className={cn('mt-5', INTRO)}>
            <TrustRow className={cn('justify-center', COPY.trust)} />
          </div>
          <div data-intro="" className={cn('mt-9 flex flex-wrap items-center justify-center gap-2.5', INTRO)}>
            <Button asChild variant="outline" className={cn('h-10 px-4', BUTTON, BUTTON_PLAIN)}>
              <a href="#how-it-works">How it works</a>
            </Button>
            <Button asChild className={cn('group/cta h-10 px-4', BUTTON, BUTTON_PRIMARY)}>
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
          <div
            aria-hidden="true"
            data-drag-zone=""
            className="pointer-events-none absolute inset-x-0 top-[calc(-1*var(--hero-gap))] bottom-[calc(-1*var(--hero-pb)_+_var(--rise,0px))]"
          />
          <HeroVisual />
        </div>
      </HeroIntro>
    </section>
  );
}
