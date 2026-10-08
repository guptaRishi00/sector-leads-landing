import Image from 'next/image';
import type { ReactNode } from 'react';
import { Button, cn, Icons } from '@sl/ui';
import { FRAME, GUTTER } from '../marketing-shell';
import { Reveal } from '../reveal';

// One design language for every section, after leadistry.co.uk, in the page's own blue palette:
// full-bleed hairlines between sections and a wide inner margin (no vertical guide lines); every
// section opens with a small mono uppercase eyebrow and a display heading (Inter Tight, weight 500,
// tight tracking) whose closing phrase is set in the accent; the lead sits under it in grey. Product screens are AppWindows. Dark panels
// (the Compliance panel, the footer, the ticker) use the same tokens scoped dark.
// Shape rule: buttons 8px (the header's call to action is a pill), cards and windows 12px, panels 16px.
// Colour: white and blue-tinted neutrals, ink (foreground) for the header action, blue (primary)
// for the main action, eyebrows, accents and progress, coral (highlight) only for what waits on a
// person, green only for passed checks.
const H2 = 'font-display text-[1.875rem] leading-[1.08] font-medium tracking-[-0.012em] text-balance sm:text-[2.625rem] sm:leading-[1.08]';

/** A giant centred statement (Leadistry's "Pay for leads with intent."). */
const STATEMENT = 'font-display text-[2.75rem] leading-[1] font-medium tracking-[-0.025em] text-balance sm:text-6xl lg:text-[5.25rem] lg:leading-[0.98]';

export const LEAD = 'max-w-[60ch] text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-[1.5]';

export const CONTENT_GAP = 'mt-12 sm:mt-16';

/** Leadistry's eyebrows and captions: small mono capitals, spaced out. */
export const MONO_LABEL = 'font-mono text-[11px] leading-none font-medium tracking-[0.14em] uppercase';

/** A dark panel in both themes with tokens only: deep navy (the inverted foreground) in light mode, the lifted popover surface in dark. */
export const NIGHT = 'bg-foreground text-background dark:bg-popover dark:text-foreground';

export const NIGHT_MUTED = 'text-background/60 dark:text-muted-foreground';

export const NIGHT_LINE = 'border-background/10 dark:border-border';

/** A hero piece GSAP brings in (see HeroIntro): hidden until the timeline starts, unless motion is reduced. */
export const INTRO = 'motion-safe:opacity-0';

export const ICON_TILE = 'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-xs';

/** Leadistry's buttons: 8px corners, 14px medium, a small press. */
export const BUTTON = 'rounded-lg font-medium transition-[color,background-color,border-color,box-shadow,transform] motion-safe:active:scale-[0.98]';

export const BUTTON_INK = 'bg-foreground text-background shadow-none hover:bg-foreground/85';

/** The main action: the accent, flat (no shadow). */
export const BUTTON_PRIMARY = 'bg-primary text-primary-foreground shadow-none hover:bg-primary/90';

export const BUTTON_PLAIN = 'border-border bg-card text-foreground shadow-none hover:bg-muted';

/** The product screens' bezel: a translucent hairline tint, so it reads on white, on the tinted bands and in the dark panels. */
export const BEZEL = 'rounded-2xl border bg-[color-mix(in_oklab,var(--border)_40%,transparent)] p-1.5 sm:p-2';

/** A faint top-edge highlight on lifted panels, in dark mode only (where shadows don't read). */
export const EDGE = 'dark:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_7%,transparent)]';

/** The content frame: the header's width. */
export const RAIL = FRAME;

/** The inner margin between the frame's edge and the content: none, so sections span the header's width (the logo to the last button). */
export const INNER = '';

/** Three promises, each stated elsewhere on the page (How it works and Compliance). */
export const TRUST: readonly string[] = ['A person approves every lead and email', 'Every lead links to its public source', 'Sent from your own mailbox'];

/** Leadistry's check row: small ticks and grey text. */
export function TrustRow({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted-foreground', className)}>
      {TRUST.map((item) => (
        <li key={item} className="inline-flex items-center gap-1.5">
          <Icons.Check aria-hidden="true" className="size-3.5 text-primary" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * A section in the frame, closed by a full-bleed hairline. `band` sets it on the tinted surface;
 * `dark` makes it dark: the dark palette applies inside it (theme.css scopes it to
 * data-theme="dark"), on the deepest dark surface.
 */
export function Section({
  id,
  labelledBy,
  band = false,
  dark = false,
  className,
  innerClassName,
  children,
}: {
  id: string;
  labelledBy: string;
  band?: boolean;
  dark?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-theme={dark ? 'dark' : undefined}
      className={cn('scroll-mt-18 border-b', GUTTER, band && 'bg-muted', dark && 'bg-sidebar text-foreground', className)}
    >
      <div className={RAIL}>
        <div className={cn(INNER, 'py-20 sm:py-28 lg:py-32', innerClassName)}>{children}</div>
      </div>
    </section>
  );
}

// Every section opens with a short label (the user's choice: the accent colour only, no ground),
// set as Leadistry's mono capitals.
export function Chip({ children }: { children: string }) {
  return <p className={cn(MONO_LABEL, 'inline-flex h-4 w-fit items-center text-primary')}>{children}</p>;
}

export const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

/**
 * The eyebrow, then the heading, with its closing phrase (`accent`) in the accent colour, then the
 * lead in grey and an optional action. `statement` sets the heading giant and centred.
 */
export function SectionHeader({
  eyebrow,
  titleId,
  title,
  accent,
  lead,
  action,
  center = false,
  statement = false,
  className,
}: {
  eyebrow: string;
  titleId: string;
  title: string;
  /** The heading's closing phrase, set in the accent (Leadistry's "…the work for you."). */
  accent?: string;
  lead?: string;
  action?: ReactNode;
  center?: boolean;
  statement?: boolean;
  className?: string;
}) {
  const centred = center || statement;
  return (
    <Reveal className={cn('flex flex-col gap-5', centred ? 'mx-auto max-w-4xl items-center text-center' : 'max-w-[52rem]', className)}>
      <Chip>{eyebrow}</Chip>
      <h2 id={titleId} className={cn(statement ? STATEMENT : H2, 'text-foreground')}>
        {title}
        {accent !== undefined && (
          <>
            {' '}
            <span className="text-primary">{accent}</span>
          </>
        )}
      </h2>
      {lead !== undefined && <p className={cn(LEAD, centred && 'mx-auto')}>{lead}</p>}
      {action !== undefined && <div className="pt-1">{action}</div>}
    </Reveal>
  );
}

/** Leadistry's quiet secondary action: a small plain button with an arrow. */
export function ActionLink({ href, children }: { href: string; children: string }) {
  return (
    <Button asChild variant="outline" size="sm" className={cn('group/cta h-9 px-3.5', BUTTON, BUTTON_PLAIN)}>
      <a href={href}>
        {children}
        <Icons.ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
      </a>
    </Button>
  );
}

/** The soft lift under a card that sits on the page (the Compliance log, the final form). */
export const SCREEN_SHADOW = 'shadow-[0_1px_2px_var(--shadow-color),0_16px_40px_-20px_var(--shadow-color)]';

/**
 * Attio's app window, as the hero shows the product: a pale frame with the three window controls
 * on their own strip, and the white app inset in it with its own corners and hairline. `shadow`
 * lifts it off the page (the hero); without it the window is flat, with no dark-mode edge either.
 */
export function AppWindow({ shadow = false, className, innerClassName, children }: { shadow?: boolean; className?: string; innerClassName?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border bg-muted px-1.5 pb-1.5 sm:px-2 sm:pb-2',
        shadow && 'shadow-[0_1px_2px_var(--shadow-color),0_24px_60px_-24px_var(--shadow-color)]',
        className,
      )}
    >
      <div aria-hidden="true" className="flex h-8 items-center gap-2 px-1.5 sm:h-9">
        <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--destructive)_80%,var(--card))]" />
        <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--highlight)_50%,var(--warning-border))]" />
        <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--success)_75%,var(--card))]" />
      </div>
      <div className={cn('min-h-0 flex-1 overflow-hidden rounded-xl border bg-card', shadow && EDGE, innerClassName)}>{children}</div>
    </div>
  );
}

/** The paintings behind product windows, as in How it works (public/how-it-works/; 1 and 4 are the same picture). */
export const PAINTINGS = { sunset: '/how-it-works/1.webp', lake: '/how-it-works/2.webp', valley: '/how-it-works/3.webp' } as const;

/**
 * A painting as the ground of a product window, the way How it works sets its demos: the picture
 * fills a rounded panel and the window sits on it with a margin. Decoration only (empty alt).
 */
export function Painting({ src, className, children }: { src: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn('relative isolate overflow-hidden rounded-2xl border p-3 sm:p-6 lg:p-10', className)}>
      <Image src={src} alt="" fill sizes="(min-width: 1344px) 1344px, 100vw" className="-z-10 object-cover" />
      {children}
    </div>
  );
}

/** A small caption row at the top of a frame, like a window's title. */
export function FrameTitle({ children, aside }: { children: string; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
      <p className="text-xs font-medium text-muted-foreground">{children}</p>
      {aside}
    </div>
  );
}

export const Tag = ({ tone = 'muted', children }: { tone?: 'muted' | 'accent' | 'success'; children: ReactNode }) => (
  <span
    className={cn(
      'inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium',
      tone === 'muted' && 'bg-muted text-muted-foreground ring-1 ring-border',
      tone === 'accent' && 'bg-selected text-primary',
      tone === 'success' && 'bg-success-soft text-success',
    )}
  >
    {children}
  </span>
);

/** A placeholder line of text in a mock-up: says "text goes here" without inventing any. */
export const Line = ({ className }: { className?: string }) => <span aria-hidden="true" className={cn('block h-2 rounded-full bg-muted', className)} />;

export const SIGNAL_ICONS = {
  Megaphone: Icons.Megaphone,
  CircleCheck: Icons.CircleCheck,
  ChartLine: Icons.ChartLine,
  UserRound: Icons.UserRound,
  Users: Icons.Users,
  Database: Icons.Database,
  Shield: Icons.Shield,
  Code: Icons.Code,
  Globe: Icons.Globe,
} as const;
