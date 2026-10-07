import type { ReactNode } from 'react';
import { Button, cn, Icons } from '@sl/ui';
import { FRAME, GUTTER } from '../marketing-shell';
import { Reveal } from '../reveal';

// One design language for every section, after attio.com: the page sits between two hairline rails
// with a hairline between sections; every section opens with a small blue chip and a two-tone
// heading (the title in ink, the lead continuing in grey) when the lead is short enough to read as
// one statement; product screens are 12px windows in a 16px tinted bezel; content grids share
// hairlines like Attio's cell walls. One deliberate theme switch device: the Compliance chapter and
// the closing call to action are dark chapters (data-theme="dark", same tokens).
// Shape rule: buttons 10px, chips 8px, cards and windows 12px, bezels 16px, inputs 8px.
// Colour: white and blue-tinted neutrals, ink (foreground) for the primary action, blue (primary)
// for chips, progress and accents, coral (highlight) only for what waits on a person, green only
// for passed checks.
const H2 = 'text-[1.75rem] leading-[1.12] font-medium tracking-[-0.01em] text-balance sm:text-[2.5rem] sm:leading-[1.1]';

/** A dark chapter's opener, set large and alone. */
const STATEMENT = 'text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[4rem] lg:leading-[1]';

export const LEAD = 'max-w-[62ch] text-base leading-7 font-medium text-pretty text-muted-foreground sm:text-[17px]';

export const CONTENT_GAP = 'mt-12 sm:mt-16';

/** A dark panel in both themes with tokens only: deep navy (the inverted foreground) in light mode, the lifted popover surface in dark. */
export const NIGHT = 'bg-foreground text-background dark:bg-popover dark:text-foreground';

export const NIGHT_MUTED = 'text-background/60 dark:text-muted-foreground';

export const NIGHT_LINE = 'border-background/10 dark:border-border';

/** A hero piece GSAP brings in (see HeroIntro): hidden until the timeline starts, unless motion is reduced. */
export const INTRO = 'motion-safe:opacity-0';

export const ICON_TILE = 'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-xs';

/** Attio's buttons: 10px corners, 14px medium; the primary is ink, with a small press. */
export const BUTTON = 'rounded-[10px] font-medium transition-[color,background-color,border-color,box-shadow,transform] motion-safe:active:scale-[0.98]';

export const BUTTON_INK = 'bg-foreground text-background shadow-none hover:bg-foreground/85';

export const BUTTON_PLAIN = 'border-border bg-card text-foreground shadow-none hover:bg-muted';

/** The product screens' bezel: a translucent hairline tint, so it reads on white, on the tinted bands and in the dark chapters. */
export const BEZEL = 'rounded-2xl border bg-[color-mix(in_oklab,var(--border)_40%,transparent)] p-1.5 sm:p-2';

/** A faint top-edge highlight on lifted panels, in dark mode only (where shadows don't read). */
export const EDGE = 'dark:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--foreground)_7%,transparent)]';

/** Attio's rails: the page gutter, then the header's frame width with hairlines on both sides. */
export const RAIL = cn(FRAME, 'border-x');

export const INNER = 'px-5 sm:px-10 lg:px-16';

/** Three promises, each stated elsewhere on the page (How it works and Compliance). */
const TRUST: readonly string[] = ['A person approves every lead and email', 'Every lead links to its public source', 'Sent from your own mailbox'];

export function TrustRow({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-muted-foreground', className)}>
      {TRUST.map((item) => (
        <li key={item} className="inline-flex items-center gap-1.5">
          <Icons.Check aria-hidden="true" className="size-3.5 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * A section between the rails, closed by a hairline. `band` sets it on the tinted surface; `dark`
 * makes it a dark chapter: the dark palette applies inside it (theme.css scopes it to
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
      className={cn('scroll-mt-18', GUTTER, band && 'bg-muted', dark && 'bg-sidebar text-foreground', className)}
    >
      <div className={cn(RAIL, 'border-b')}>
        <div className={cn(INNER, 'py-20 sm:py-28 lg:pt-36 lg:pb-28', innerClassName)}>{children}</div>
      </div>
    </section>
  );
}

// Every section opens with a short label (the user's choice): the accent colour only, no ground,
// so it sits flush with the heading under it.
export function Chip({ children }: { children: string }) {
  return <p className="inline-flex h-6 w-fit items-center text-sm font-medium text-primary">{children}</p>;
}

/** Up to this many words, the lead continues the heading in grey (Attio's two-tone heading); longer leads sit under it. */
const TWO_TONE_MAX = 24;

const words = (text: string) => text.trim().split(/\s+/).length;

export const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

/** Chip, then the heading: two-tone when the lead is short, else heading and lead stacked. An action sits under it. */
export function SectionHeader({
  eyebrow,
  titleId,
  title,
  lead,
  action,
  center = false,
  statement = false,
  className,
}: {
  eyebrow: string;
  titleId: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  center?: boolean;
  /** A dark chapter's opener: the title alone, large, with the lead under it (Attio's "Universal Context"). */
  statement?: boolean;
  className?: string;
}) {
  const twoTone = !statement && lead !== undefined && words(lead) <= TWO_TONE_MAX;
  return (
    <Reveal className={cn('flex flex-col gap-5', center ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-[58rem]', className)}>
      <Chip>{eyebrow}</Chip>
      <h2 id={titleId} className={statement ? STATEMENT : H2}>
        <span className="text-foreground">{twoTone ? sentence(title) : title}</span>
        {twoTone && <span className="text-muted-foreground"> {lead}</span>}
      </h2>
      {!twoTone && lead !== undefined && <p className={cn(LEAD, center && 'mx-auto')}>{lead}</p>}
      {action !== undefined && <div className="pt-1">{action}</div>}
    </Reveal>
  );
}

/** Attio's "See more →": a small plain button. */
export function ActionLink({ href, children }: { href: string; children: string }) {
  return (
    <Button asChild variant="outline" size="sm" className={cn('group/cta h-8 px-3', BUTTON, BUTTON_PLAIN)}>
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
    <div className={cn('flex flex-col rounded-2xl border bg-muted px-1.5 pb-1.5 sm:px-2 sm:pb-2', shadow && 'shadow-[0_1px_2px_var(--shadow-color),0_24px_60px_-24px_var(--shadow-color)]', className)}>
      <div aria-hidden="true" className="flex h-8 items-center gap-2 px-1.5 sm:h-9">
        <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--destructive)_80%,var(--card))]" />
        <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--highlight)_50%,var(--warning-border))]" />
        <span className="size-3 rounded-full bg-[color-mix(in_oklab,var(--success)_75%,var(--card))]" />
      </div>
      <div className={cn('min-h-0 flex-1 overflow-hidden rounded-xl border bg-card', shadow && EDGE, innerClassName)}>{children}</div>
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
