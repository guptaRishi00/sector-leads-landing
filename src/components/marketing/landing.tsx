import type { ReactNode } from 'react';
import { Button, Icons, cn } from '@sl/ui';
import { EvidencePanel } from '@/components/queue/evidence-panel';
import { ScoreBreakdown } from '@/components/queue/score-breakdown';
import { BRAND_NAME } from '@/lib/marketing/brand';
import { livePacks } from '@/lib/marketing/live';
import {
  EXAMPLE_LEAD,
  EXAMPLE_SCORE,
  FAQ,
  INDUSTRY_PACKS,
  REJECT_EXAMPLES,
  SEND_GATES,
  SIGNAL_TYPES,
  STEPS,
} from '@/lib/marketing/content';
import { CONTAINER } from './marketing-shell';
import { FlowMotion } from './flow-motion';
import { HeroIntro } from './hero-intro';
import { Reveal } from './reveal';
import { SourcesMarquee } from './sources-marquee';
import { Tabs } from './tabs';
import { WaitlistForm } from './waitlist-form';

// One design language for every section: eyebrow → h2 → lead, the same gap from that header to the
// content, product "screens" in a Frame (see below) and one icon tile. The accent (primary) is kept
// to eyebrows, icon tiles, numbers and the call to action.
const H2 = 'text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-foreground sm:text-[2.625rem] sm:leading-[1.08]';
const LEAD = 'max-w-[62ch] text-[15px] leading-6.5 text-pretty text-muted-foreground sm:text-lg sm:leading-8';
const CONTENT_GAP = 'mt-9 sm:mt-14';
/** A hero piece GSAP brings in (see HeroIntro): hidden until the timeline starts, unless motion is reduced. */
const INTRO = 'motion-safe:opacity-0';
const ICON_TILE = 'inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-selected text-primary ring-1 ring-selected-border';

/** Three promises, each stated elsewhere on the page (How it works and Compliance). */
const TRUST: readonly string[] = ['A person approves every lead and email', 'Every lead links to its public source', 'Sent from your own mailbox'];

function TrustRow({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted-foreground', className)}>
      {TRUST.map((item) => (
        <li key={item} className="inline-flex items-center gap-1.5">
          <Icons.Check aria-hidden="true" className="size-3.5 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Section({ id, labelledBy, band = false, className, children }: { id: string; labelledBy: string; band?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('scroll-mt-20 py-14 sm:py-28', band && 'border-y bg-muted/40', className)}>
      <div className={CONTAINER}>{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      {children}
    </p>
  );
}

function SectionHeader({ eyebrow, titleId, title, lead, className }: { eyebrow: string; titleId: string; title: string; lead?: string; className?: string }) {
  return (
    <Reveal className={cn('flex max-w-3xl flex-col gap-4', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={titleId} className={H2}>
        {title}
      </h2>
      {lead !== undefined && <p className={LEAD}>{lead}</p>}
    </Reveal>
  );
}

/** Other kinds of lead in the illustrated queue; only the open one carries a (real, worked) score. */
const QUEUE_TABS: readonly string[] = SIGNAL_TYPES.filter((signal) => signal.id === 'tender-award' || signal.id === 'new-leader').map((signal) => signal.name);

/** The example lead, framed as the product's approval queue. Illustration only: nothing in it is interactive. */
function LeadWindow() {
  return (
    <section
      aria-labelledby="example-lead-title"
      className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_32px_80px_-32px_var(--shadow-color),0_2px_6px_var(--shadow-color)] ring-1 ring-foreground/[0.03]"
    >
      <div className="flex h-10 shrink-0 items-center gap-3 border-b bg-muted/50 px-4">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <h2 id="example-lead-title" className="text-xs font-medium text-muted-foreground">
          Approval queue
        </h2>
      </div>
      <ul
        aria-hidden="true"
        className="flex shrink-0 gap-1.5 overflow-hidden border-b px-3 py-2.5 [mask-image:linear-gradient(to_right,black_80%,transparent)] sm:px-4"
      >
        <li className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-selected px-2.5 text-xs font-medium text-foreground ring-1 ring-selected-border">
          <span className="font-mono text-primary tabular-nums">{EXAMPLE_SCORE.text}</span>
          {EXAMPLE_LEAD.evidence.trigger}
        </li>
        {QUEUE_TABS.map((name) => (
          <li key={name} className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-foreground/20" />
            {name}
          </li>
        ))}
      </ul>
      <div className="flex flex-1 flex-col gap-5 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[15px] font-medium text-pretty text-foreground">{EXAMPLE_LEAD.descriptor}</p>
          <p className="flex shrink-0 flex-col items-end">
            <span className="font-mono text-2xl font-semibold text-primary tabular-nums">{EXAMPLE_SCORE.text}</span>
            <span className="text-xs text-muted-foreground">score of {EXAMPLE_SCORE.max}</span>
          </p>
        </div>
        <div className="border-t pt-5">
          <EvidencePanel evidence={EXAMPLE_LEAD.evidence} />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/70 p-2 pl-3">
          <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Icons.Inbox aria-hidden="true" className="size-4 shrink-0" />
            Waiting for a person to decide.
          </p>
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-medium text-foreground">Reject</span>
            <span className="inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground">Approve</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/** The product window with a "sent" toast layered on it, the way Stripe stacks product UI. From lg only. */
function HeroVisual() {
  return (
    <div data-intro="" className={cn('relative hidden lg:ml-4 lg:block', INTRO)}>
      <LeadWindow />
      <div
        aria-hidden="true"
        className="absolute -top-5 -right-3 flex items-center gap-2.5 rounded-xl border bg-card/95 py-2 pr-3.5 pl-2 shadow-[0_12px_32px_-12px_var(--shadow-color)] backdrop-blur-sm xl:-right-5"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-success-soft text-success">
          <Icons.Send className="size-3.5" />
        </span>
        <span className="flex flex-col">
          <span className="text-xs font-medium text-foreground">All {SEND_GATES.length} gates passed</span>
          <span className="text-[11px] text-muted-foreground">Sent from your own mailbox</span>
        </span>
      </div>
    </div>
  );
}

export function Hero({ token }: { token: string }) {
  return (
    // One screen, no more: at least the viewport minus the header strip (4rem, sm: 4.25rem), with
    // the content centred in it. From lg the headline and the gaps scale with the viewport's
    // height, so it still fits a 1280x720 screen; the product window only shows from lg.
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[calc(100svh-4rem)] overflow-x-clip border-b sm:min-h-[calc(100svh-4.25rem)]">
      {/* A faint grid and an accent glow behind the window; both fade out well before the edges.
          The layer reaches up under the floating header's strip (pt-2 + h-14, sm: pt-3 + h-14) so
          the top of the page is one surface; overflow-x-clip (not hidden) lets it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10 sm:-top-[4.25rem]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_85%_10%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)]" />
      </div>
      <HeroIntro
        className={cn(
          CONTAINER,
          'my-auto grid grid-cols-1 items-center gap-10 py-6 sm:py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 lg:py-[5svh]',
        )}
      >
        <div id="join" className="flex scroll-mt-28 flex-col gap-5 sm:gap-6 lg:gap-[clamp(1rem,2.6svh,1.75rem)]">
          <p data-intro="" className={cn('inline-flex h-7 items-center gap-2 self-start rounded-full border bg-card/80 px-3 text-xs font-medium text-muted-foreground backdrop-blur-sm', INTRO)}>
            <span aria-hidden="true" className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Early access waitlist is open
          </p>
          <h1
            data-intro=""
            id="hero-title"
            className={cn(
              'max-w-[15ch] text-[2.375rem] leading-[1.04] font-semibold tracking-[-0.045em] text-balance text-foreground sm:text-6xl lg:text-[clamp(2.75rem,6.6svh,4.25rem)] lg:leading-[1.02]',
              INTRO,
            )}
          >
            Leads from public events, with the proof attached.
          </h1>
          <p data-intro="" className={cn('max-w-[34rem] text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-8', INTRO)}>
            {BRAND_NAME} turns tenders, filings, new directors, hiring and funding into leads you can check, and sends only what you approve.
          </p>
          <div data-intro="" className={cn('pt-1', INTRO)}>
            <WaitlistForm token={token} source="landing-hero" compact className="max-w-lg" />
          </div>
        </div>
        <HeroVisual />
      </HeroIntro>
    </section>
  );
}

// Counted from the content itself, so a figure can't drift from the list it describes.
const STATS: readonly { value: number; label: string }[] = [
  { value: INDUSTRY_PACKS.length, label: 'industry packs, each with its own rules' },
  { value: SIGNAL_TYPES.length, label: 'kinds of dated public signal' },
  { value: EXAMPLE_SCORE.lines.length, label: 'parts to every score, each with a reason' },
  { value: SEND_GATES.length, label: 'gates before any email leaves' },
];

/** Every named source behind the signals, once each (the generic "news" is left out). */
const SOURCES: readonly string[] = [...new Set(SIGNAL_TYPES.flatMap((signal) => signal.sources.split(', ')))].filter((source) => source !== 'news');

/** The strip under the hero: the product in four numbers, and the public record it reads. */
export function ProofBar() {
  return (
    <section aria-labelledby="proof-bar-title" className="border-b bg-muted/40 py-10 sm:py-16">
      <div className={cn(CONTAINER, 'flex flex-col gap-10 sm:gap-12')}>
        <h2 id="proof-bar-title" className="sr-only">
          {BRAND_NAME} at a glance
        </h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col gap-1.5 border-l pl-4 sm:pl-5">
              <dt className="order-2 text-sm text-pretty text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:text-4xl">{stat.value}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal className="flex flex-col gap-4">
          <p className="text-center text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">Reads the public record</p>
          <SourcesMarquee sources={SOURCES} />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * A product "screen": a muted outer frame around a card, the way Infrantic frames its workflow
 * panels. Everything inside is illustration built from the page's own content.
 */
function Frame({ className, innerClassName, children }: { className?: string; innerClassName?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-2xl border bg-muted/60 p-1.5 sm:p-2', className)}>
      <div className={cn('h-full rounded-xl border bg-card', innerClassName)}>{children}</div>
    </div>
  );
}

/** Section header with one action on the right from `lg`, as on Infrantic. */
function HeaderRow({ action, ...header }: { action: ReactNode; eyebrow: string; titleId: string; title: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <SectionHeader {...header} />
      <Reveal delay={0.08} className="shrink-0">
        {action}
      </Reveal>
    </div>
  );
}

function ActionLink({ href, children }: { href: string; children: string }) {
  return (
    <Button asChild variant="outline" size="sm" className="group/cta">
      <a href={href}>
        {children}
        <Icons.ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />
      </a>
    </Button>
  );
}

/** A small caption row at the top of a frame, like a window's title. */
function FrameTitle({ children, aside }: { children: string; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
      <p className="text-xs font-medium text-muted-foreground">{children}</p>
      {aside}
    </div>
  );
}

const Tag = ({ tone = 'muted', children }: { tone?: 'muted' | 'accent' | 'success'; children: ReactNode }) => (
  <span
    className={cn(
      'inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium',
      tone === 'muted' && 'bg-muted text-muted-foreground',
      tone === 'accent' && 'bg-selected text-primary ring-1 ring-selected-border',
      tone === 'success' && 'bg-success-soft text-success',
    )}
  >
    {children}
  </span>
);

/** A placeholder line of text in a mock-up: says "text goes here" without inventing any. */
const Line = ({ className }: { className?: string }) => <span aria-hidden="true" className={cn('block h-2 rounded-full bg-muted', className)} />;

const STEP_ICONS = {
  Radar: Icons.Radar,
  ListChecks: Icons.ListChecks,
  UserRound: Icons.UserRound,
  MailCheck: Icons.MailCheck,
  ShieldCheck: Icons.ShieldCheck,
} as const;

const SIGNAL_ICONS = {
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

const signalById = (id: string) => SIGNAL_TYPES.find((item) => item.id === id);
const FEED = ['secured-loan', 'tender-notice', 'new-leader'].map(signalById).filter((item) => item !== undefined);
const REJECTED_IN_QUEUE = REJECT_EXAMPLES.filter((reason) => reason.code === 'staffing_firm' || reason.code === 'shell_or_spv');
const SEND_WINDOW = SEND_GATES.filter((gate) => gate === 'Legal basis for the country' || gate === 'Daily caps' || gate === 'Business hours and holidays');
const REACHABILITY = EXAMPLE_SCORE.lines.find((line) => line.id === 'reachability');

/** The right-hand view for each step of How it works. Illustrations only; not interactive. */
function StepVisual({ id }: { id: string }) {
  switch (id) {
    case 'signal':
      return (
        <>
          <FrameTitle aside={<Tag tone="accent">{FEED.length} new</Tag>}>Events from the public record</FrameTitle>
          <ul className="divide-y">
            {FEED.map((item) => {
              const Icon = SIGNAL_ICONS[item.icon];
              return (
                <li key={item.id} className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="truncate text-[13px] text-muted-foreground">{item.example}</p>
                  </div>
                  <span className="hidden shrink-0 pt-0.5 font-mono text-[11px] text-muted-foreground sm:block">{item.sources.split(', ')[0]}</span>
                </li>
              );
            })}
          </ul>
        </>
      );
    case 'evidence':
      return (
        <>
          <FrameTitle>Rules applied to each event</FrameTitle>
          <ul className="divide-y">
            <li className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
              <Tag tone="accent">
                <Icons.Check aria-hidden="true" className="size-3.5" />
                Lead
              </Tag>
              <p className="min-w-0 flex-1 truncate text-sm text-foreground">{EXAMPLE_LEAD.descriptor}</p>
              <span className="font-mono text-sm font-semibold text-primary tabular-nums">{EXAMPLE_SCORE.text}</span>
            </li>
            {REJECTED_IN_QUEUE.map((reason) => (
              <li key={reason.code} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <Tag>
                  <Icons.Ban aria-hidden="true" className="size-3.5" />
                  Rejected
                </Tag>
                <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{reason.label}</p>
                <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{reason.code}</span>
              </li>
            ))}
          </ul>
        </>
      );
    case 'contact':
      return (
        <>
          <FrameTitle>After you approve</FrameTitle>
          <ol className="flex flex-col gap-3 p-4 sm:p-5">
            {[
              { label: 'Lead approved by a person', detail: EXAMPLE_LEAD.descriptor, done: true },
              { label: 'The right person found', detail: REACHABILITY?.why ?? '', done: true },
              { label: 'Their address verified', detail: 'Verified again before it sends', done: false },
            ].map((row) => (
              <li key={row.label} className="flex items-start gap-3 rounded-lg border px-3 py-2.5">
                <span
                  className={cn(
                    'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full',
                    row.done ? 'bg-primary text-primary-foreground' : 'border-2 border-dashed border-selected-border',
                  )}
                >
                  {row.done && <Icons.Check aria-hidden="true" className="size-3" strokeWidth={3} />}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="truncate text-[13px] text-muted-foreground">{row.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      );
    case 'draft':
      return (
        <>
          <FrameTitle aside={<Tag>Draft</Tag>}>A first email, waiting for you</FrameTitle>
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-col gap-2.5">
              <Line className="w-2/5" />
              <Line className="w-11/12" />
              <Line className="w-4/5" />
              <Line className="w-3/5" />
            </div>
            <p className="inline-flex w-fit items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
              <Icons.Info aria-hidden="true" className="size-3.5" />
              Cites: {EXAMPLE_LEAD.evidence.title}
            </p>
            <div aria-hidden="true" className="flex justify-end gap-1.5 border-t pt-4">
              <span className="inline-flex h-7 items-center rounded-md border bg-card px-2.5 text-xs font-medium text-foreground">Edit</span>
              <span className="inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground">Approve draft</span>
            </div>
          </div>
        </>
      );
    default:
      return (
        <>
          <FrameTitle>Before it sends</FrameTitle>
          <ul className="flex flex-col gap-2 p-4 sm:p-5">
            {SEND_WINDOW.map((gate) => (
              <li key={gate} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm text-foreground">
                {gate}
                <Tag tone="success">
                  <Icons.Check aria-hidden="true" className="size-3.5" />
                  Passed
                </Tag>
              </li>
            ))}
            <li className="mt-1 flex items-center gap-2 rounded-lg bg-selected px-3 py-2.5 text-sm font-medium text-foreground ring-1 ring-selected-border">
              <Icons.Send aria-hidden="true" className="size-4 text-primary" />
              Sent from your own mailbox
            </li>
          </ul>
        </>
      );
  }
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <SectionHeader
        eyebrow="How it works"
        titleId="how-title"
        title="From a public event to an email a person approved"
        lead="Five steps, in this order. A person decides at every point that matters."
      />
      <Reveal className={CONTENT_GAP}>
        <Tabs
          label="How it works, step by step"
          autoAdvance={6500}
          tabs={STEPS.map((step, index) => (
            <span key={step.id} className="inline-flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              {step.title.split(',')[0]}
            </span>
          ))}
          panels={STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.icon];
            return (
              <Frame key={step.id} innerClassName="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <div className="flex flex-col gap-4 p-4 sm:p-8">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-0.5 text-[13px] text-muted-foreground">
                    <Icon aria-hidden="true" className="size-3.5 text-primary" />
                    Step {index + 1} of {STEPS.length}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-[1.75rem]">{step.title}</h3>
                  <p className="max-w-md text-[15px] leading-7 text-pretty text-muted-foreground lg:mt-auto">{step.body}</p>
                </div>
                <div className="border-t bg-muted/30 p-3 sm:p-4 lg:border-t-0 lg:border-l">
                  <div className="h-full overflow-hidden rounded-lg border bg-card shadow-sm">
                    <StepVisual id={step.id} />
                  </div>
                </div>
              </Frame>
            );
          })}
        />
      </Reveal>
    </Section>
  );
}

export function Signals() {
  const ordered = [...SIGNAL_TYPES.filter((item) => item.id === 'secured-loan'), ...SIGNAL_TYPES.filter((item) => item.id !== 'secured-loan')];
  return (
    <Section id="signals" labelledBy="signals-title">
      <HeaderRow
        eyebrow="Signals"
        titleId="signals-title"
        title="What starts a lead"
        lead="Each signal is a dated record in a public source. The examples describe kinds of companies, not real ones."
        action={<ActionLink href="#evidence">See how a lead is scored</ActionLink>}
      />
      {/* One frame, cells divided by hairlines: each cell draws its right and bottom edge and the
          frame's overflow hides the ones on the rim. The first cell spans two columns on sm so
          nine signals fill whole rows at both 2 and 3 columns. */}
      <Reveal className={CONTENT_GAP}>
        <ul className="grid grid-cols-1 overflow-hidden rounded-2xl border bg-card sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((item, index) => {
            const Icon = SIGNAL_ICONS[item.icon];
            return (
              <li key={item.id} className={cn('-mr-px -mb-px border-r border-b', index === 0 && 'sm:col-span-2 lg:col-span-1')}>
                <article className="flex h-full flex-col gap-4 p-4 transition-colors duration-200 hover:bg-muted/40 sm:p-7">
                  <span className={cn(ICON_TILE, index === 0 && 'bg-primary text-primary-foreground ring-primary')}>
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                    <p className="text-[15px] leading-6 text-pretty text-muted-foreground">{item.example}</p>
                  </div>
                  <p className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {item.sources.split(', ').map((source) => (
                      <span key={source} className="rounded-md border bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {source}
                      </span>
                    ))}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}

export function Proof() {
  return (
    <Section id="evidence" labelledBy="proof-title" band>
      <SectionHeader
        eyebrow="Evidence"
        titleId="proof-title"
        title="Every lead shows its work"
        lead="Five parts add up to the score, and each one says why. Records that don't qualify are kept with the reason, so you can check the rules instead of trusting them."
      />
      <Reveal className={CONTENT_GAP}>
        <Frame innerClassName="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col">
            <FrameTitle aside={<Tag tone="accent">Example lead</Tag>}>Score, line by line</FrameTitle>
            <div className="p-4 sm:p-7">
              <ScoreBreakdown score={EXAMPLE_SCORE} />
            </div>
          </div>
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l">
            <FrameTitle aside={<Tag>Kept, not contacted</Tag>}>Rejected, with the reason</FrameTitle>
            <ul className="flex flex-1 flex-col divide-y">
              {REJECT_EXAMPLES.map((reason) => (
                <li key={reason.code} className="flex flex-1 items-center gap-3 px-5 py-3.5 sm:px-7">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icons.Ban aria-hidden="true" className="size-3.5" />
                  </span>
                  <p className="min-w-0 flex-1 text-sm text-foreground">{reason.label}</p>
                  <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{reason.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </Frame>
      </Reveal>
    </Section>
  );
}

const Chip = ({ children }: { children: string }) => (
  <li className="rounded-md border bg-card px-2 py-1 text-[13px] text-foreground">{children}</li>
);

export function Industries() {
  const packs = livePacks();
  const industries = INDUSTRY_PACKS.map((copy) => ({ ...copy, pack: packs.find((pack) => pack.id === copy.id) }));
  return (
    <Section id="industries" labelledBy="industries-title">
      <HeaderRow
        eyebrow="Industries"
        titleId="industries-title"
        title="Fifteen industries, each with its own rules"
        lead="A pack decides which signals count for your industry, which sources to read and which companies to leave out, such as your competitors and staffing firms."
        action={<ActionLink href="#join">Join the waitlist</ActionLink>}
      />
      <Reveal className={CONTENT_GAP}>
        <Tabs
          vertical
          label="Industry packs"
          autoAdvance={4000}
          tabs={industries.map((industry) => industry.name)}
          panels={industries.map((industry, index) => (
            <Frame key={industry.id} className="h-full" innerClassName="flex flex-col">
              <FrameTitle aside={<Tag tone="accent">Pack {String(index + 1).padStart(2, '0')}</Tag>}>Industry pack</FrameTitle>
              <div className="flex flex-1 flex-col gap-6 p-4 sm:gap-7 sm:p-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">{industry.name}</h3>
                  <p className="text-[15px] leading-7 text-pretty text-muted-foreground">
                    <span className="text-foreground">Starts a lead:</span> {industry.watches}
                  </p>
                </div>
                {industry.pack !== undefined && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">Signals on by default</h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {industry.pack.defaultSignals.map((item) => (
                          <Chip key={item.id}>{item.label}</Chip>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">Sources it reads</h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {industry.pack.sources.map((item) => (
                          <Chip key={item.id}>{item.label}</Chip>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <p className="mt-auto flex items-center gap-2 border-t pt-5 text-[13px] text-muted-foreground">
                  <Icons.Filter aria-hidden="true" className="size-4 shrink-0" />
                  Each signal can be switched on or off, and your competitors and staffing firms are left out.
                </p>
              </div>
            </Frame>
          ))}
        />
      </Reveal>
    </Section>
  );
}

const GUARANTEES: readonly { title: string; icon: keyof typeof GUARANTEE_ICONS; body: string }[] = [
  {
    title: 'Your own database',
    icon: 'Database',
    body: 'Connect your own Postgres and your leads, contacts and messages are stored there. Every workspace is isolated by row-level security.',
  },
  {
    title: 'Lift you can measure',
    icon: 'ChartColumn',
    body: 'A holdout group, 12% of accounts by default, is never contacted. Results compares the two, so you see what outreach added.',
  },
  {
    title: 'Suppression that sticks',
    icon: 'Ban',
    body: 'Unsubscribes, complaints and hard bounces suppress the address. Every email carries a one-click unsubscribe and your postal address.',
  },
  {
    title: 'Inbound in the same inbox',
    icon: 'Inbox',
    body: 'Your website form, Meta and LinkedIn lead ads and WhatsApp land in one inbox, routed by your rules and answered within the same limits as outbound.',
  },
];
const GUARANTEE_ICONS = { Database: Icons.Database, ChartColumn: Icons.ChartColumn, Ban: Icons.Ban, Inbox: Icons.Inbox } as const;

export function Compliance() {
  return (
    <Section id="compliance" labelledBy="compliance-title">
      <SectionHeader
        eyebrow="Compliance"
        titleId="compliance-title"
        title="Built to send within the law, and to keep your data yours"
        lead="The rules are in the product, not in a policy document. When a check fails, the email waits."
      />
      <div className={cn('grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14', CONTENT_GAP)}>
        <Reveal className="flex flex-col gap-4">
          <Frame innerClassName="flex flex-col">
            <FrameTitle aside={<Tag tone="accent">{SEND_GATES.length} gates, in order</Tag>}>Every send, from your own mailbox</FrameTitle>
            <ol className="flex flex-col gap-2 p-4 sm:p-5">
              {SEND_GATES.map((gate, index) => (
                <li key={gate} className="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-foreground">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-xs font-semibold text-primary-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">{gate}</span>
                  <Icons.Check aria-hidden="true" className="size-4 shrink-0 text-success" />
                </li>
              ))}
              <li className="mt-1 flex items-center gap-2 rounded-lg bg-selected px-3 py-2.5 text-sm font-medium text-foreground ring-1 ring-selected-border">
                <Icons.Send aria-hidden="true" className="size-4 text-primary" />
                All passed: sent. One fails: the email waits.
              </li>
            </ol>
          </Frame>
          <p className="px-1 text-[13px] text-pretty text-muted-foreground">
            A send that fails more than one gate reports the first. Legal basis is set per country; public holidays are built in for Australia, Canada, France, Germany, India, Ireland, Singapore, the UAE, the UK and the US.
          </p>
        </Reveal>
        <ul className="flex flex-col divide-y border-y">
          {GUARANTEES.map((item, index) => {
            const Icon = GUARANTEE_ICONS[item.icon];
            return (
              <Reveal as="li" key={item.title} delay={index * 0.06} className="flex gap-4 py-6 first:pt-0 lg:first:pt-6">
                <span className={ICON_TILE}>
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-[15px] leading-6 text-pretty text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title" band>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <SectionHeader eyebrow="FAQ" titleId="faq-title" title="Questions" className="lg:sticky lg:top-28 lg:self-start" />
        <Reveal delay={0.08} className="divide-y border-y">
          {FAQ.map((item) => (
            <details key={item.id} name="faq" className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 text-base font-medium text-foreground transition-colors outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                {item.question}
                <Icons.Plus aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-open:text-primary motion-reduce:transition-none" />
              </summary>
              <p className="max-w-[65ch] pb-5 text-[15px] leading-relaxed text-pretty text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

export function FinalCta({ token }: { token: string }) {
  return (
    <section aria-labelledby="final-title" className="relative isolate overflow-hidden py-14 sm:py-28">
      {/* The hero's grid and glow, mirrored from the bottom, so the page closes the way it opened. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_100%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)]" />
      </div>
      <div className={cn(CONTAINER, 'flex flex-col items-center gap-10 sm:gap-12')}>
        <Reveal className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <Eyebrow>Join the waitlist</Eyebrow>
          <h2 id="final-title" className={H2}>
            Get early access
          </h2>
          <p className={cn(LEAD, 'mx-auto')}>
            We haven&apos;t opened access yet. Leave your email and we&apos;ll write when yours is ready. You can remove yourself with one link.
          </p>
          <TrustRow className="justify-center" />
        </Reveal>
        <Reveal delay={0.08} className="w-full max-w-2xl rounded-3xl border bg-card p-4 shadow-[0_24px_60px_-24px_var(--shadow-color),0_2px_6px_var(--shadow-color)] sm:p-8">
          <WaitlistForm token={token} source="landing-final" />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Automation: Infrantic-style node diagram. Absolutely placed cards over elbow connectors on a
 * dotted canvas; the connectors' dashes march and a packet travels into the active node
 * (FlowMotion). Illustration only: role="img" with a text description, inner markup aria-hidden.
 * ---------------------------------------------------------------------------------------------- */

type FlowStatus = 'done' | 'active' | 'todo';

interface FlowNode {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  status: FlowStatus;
}

// Two rows, read as a snake: the machine's half runs left to right along the top, then down into
// "You approve", and the rest waits, right to left, until a person has decided.
const FLOW_NODES: readonly FlowNode[] = [
  { id: 'sources', label: 'Public record', detail: 'Companies House, TED, SAM.gov', x: 12, y: 28, status: 'done' },
  { id: 'signal', label: 'Signal found', detail: EXAMPLE_LEAD.evidence.trigger, x: 37, y: 28, status: 'done' },
  { id: 'checks', label: 'Rules and AI checks', detail: 'Same company? Own industry?', x: 62, y: 28, status: 'done' },
  { id: 'lead', label: 'Lead scored', detail: `${EXAMPLE_SCORE.text} of ${EXAMPLE_SCORE.max}, with evidence`, x: 87, y: 28, status: 'done' },
  { id: 'approve', label: 'You approve', detail: 'Nothing moves without you', x: 87, y: 72, status: 'active' },
  { id: 'buyer', label: 'Buyer found', detail: 'Their address verified', x: 62, y: 72, status: 'todo' },
  { id: 'draft', label: 'AI first draft', detail: `Cites ${EXAMPLE_LEAD.evidence.title}`, x: 37, y: 72, status: 'todo' },
  { id: 'send', label: 'Gates, then send', detail: `${SEND_GATES.length} checks, your own mailbox`, x: 12, y: 72, status: 'todo' },
];

const FLOW_STATUS: Record<FlowStatus, { card: string; pill: string; label: string; line: string; dash: number; duration: number }> = {
  done: { card: 'border-border', pill: 'bg-success-soft text-success', label: 'Done', line: 'color-mix(in oklch, var(--primary) 45%, transparent)', dash: 4, duration: 8 },
  active: { card: 'border-selected-border ring-4 ring-selected', pill: 'bg-selected text-primary', label: 'Waiting for you', line: 'var(--primary)', dash: 4, duration: 6 },
  todo: { card: 'border-dashed border-control/60 bg-card/80', pill: 'bg-muted text-muted-foreground', label: 'Queued', line: 'color-mix(in oklch, var(--muted-foreground) 45%, transparent)', dash: 3, duration: 16 },
};

function FlowDot({ status }: { status: FlowStatus }) {
  if (status === 'done') {
    return (
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success text-card">
        <Icons.Check className="size-2.5" strokeWidth={3} />
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="relative grid size-4 shrink-0 place-items-center">
        <span className="absolute inset-0 rounded-full bg-primary/30 motion-safe:animate-ping" />
        <span className="relative size-2.5 rounded-full bg-primary" />
      </span>
    );
  }
  return <span className="block size-4 shrink-0 rounded-full border-[1.5px] border-dashed border-control" />;
}

/** One straight segment of a connector: a clipped strip of dashes that FlowMotion slides along. */
function FlowSegment({ from, to, status, delay }: { from: FlowNode; to: FlowNode; status: FlowStatus; delay: number }) {
  const horizontal = from.y === to.y;
  const reverse = horizontal ? to.x < from.x : to.y < from.y;
  const style = FLOW_STATUS[status];
  const box = horizontal
    ? { left: `${Math.min(from.x, to.x)}%`, top: `${from.y}%`, width: `${Math.abs(to.x - from.x)}%` }
    : { left: `${from.x}%`, top: `${Math.min(from.y, to.y)}%`, height: `${Math.abs(to.y - from.y)}%` };
  return (
    <>
      <span className={cn('absolute overflow-hidden', horizontal ? 'h-[1.5px] -translate-y-1/2' : 'w-[1.5px] -translate-x-1/2')} style={box}>
        <span
          data-flow={horizontal ? 'x' : 'y'}
          data-reverse={reverse}
          data-duration={style.duration}
          className={cn('absolute', horizontal ? 'inset-y-0 right-0 -left-20' : 'inset-x-0 -top-20 bottom-0')}
          style={{ backgroundImage: `repeating-linear-gradient(${horizontal ? '90deg' : '180deg'}, ${style.line} 0 ${style.dash}px, transparent ${style.dash}px 8px)` }}
        />
      </span>
      {status === 'active' && (
        <span className="absolute overflow-hidden motion-reduce:hidden" style={{ ...box, ...(horizontal ? { height: 8, marginTop: -4 } : { width: 8, marginLeft: -4 }) }}>
          <span data-packet={horizontal ? 'x' : 'y'} data-reverse={reverse} data-delay={delay} className="absolute inset-0 opacity-0">
            <span
              className={cn(
                'absolute size-2 rounded-full bg-primary shadow-[0_0_10px_2px_color-mix(in_oklch,var(--primary)_55%,transparent)]',
                horizontal ? (reverse ? 'left-0 top-0' : 'right-0 top-0') : reverse ? 'top-0 left-0' : 'bottom-0 left-0',
              )}
            />
          </span>
        </span>
      )}
    </>
  );
}

function FlowCard({ node }: { node: FlowNode }) {
  const style = FLOW_STATUS[node.status];
  return (
    <div className="absolute w-[22%] max-w-[13.5rem] -translate-x-1/2 -translate-y-1/2" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
      <div className={cn('rounded-lg border bg-card px-3 py-2.5 shadow-sm', style.card)}>
        <div className="flex items-center gap-2">
          <FlowDot status={node.status} />
          <span className="truncate text-xs font-semibold text-foreground">{node.label}</span>
        </div>
        <p className="mt-1 truncate pl-6 text-[11px] text-muted-foreground">{node.detail}</p>
        <span className={cn('mt-2 ml-6 inline-flex rounded-full px-1.5 py-px text-[10px] font-medium', style.pill)}>{style.label}</span>
      </div>
    </div>
  );
}

const FLOW_DESCRIPTION = `Diagram: ${FLOW_NODES.map((node) => `${node.label} (${FLOW_STATUS[node.status].label.toLowerCase()})`).join(', then ')}.`;

export function Automation() {
  return (
    <Section id="automation" labelledBy="automation-title" band>
      <SectionHeader
        eyebrow="Automation"
        titleId="automation-title"
        title="The reading is automated. The decisions stay with you."
        lead="Rules and a narrow model read the public record, check each event and score what qualifies. Then it stops: nothing moves past a lead or a draft until a person approves it."
      />
      <Reveal className={CONTENT_GAP}>
        <Frame>
          {/* The diagram from md; a plain stepper below it, where the canvas would be too narrow. */}
          <FlowMotion className="hidden md:block">
            <div
              role="img"
              aria-label={FLOW_DESCRIPTION}
              className="relative aspect-[16/6] min-h-[22rem] overflow-hidden rounded-xl bg-muted/30 bg-[radial-gradient(color-mix(in_oklch,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
            >
              <div aria-hidden="true">
                {FLOW_NODES.slice(1).map((node, index) => {
                  const from = FLOW_NODES[index];
                  return from === undefined ? null : <FlowSegment key={node.id} from={from} to={node} status={node.status} delay={index * 0.4} />;
                })}
                {FLOW_NODES.map((node) => (
                  <FlowCard key={node.id} node={node} />
                ))}
                <p className="absolute top-3 left-4 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">Automated</p>
                <p className="absolute bottom-3 left-4 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">After your approval</p>
              </div>
            </div>
          </FlowMotion>
          <ol className="flex flex-col gap-2 p-3 md:hidden">
            {FLOW_NODES.map((node) => (
              <li key={node.id} className={cn('flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5', FLOW_STATUS[node.status].card)}>
                <span className="pt-0.5">
                  <FlowDot status={node.status} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">{node.label}</p>
                  <p className="text-[13px] text-muted-foreground">{node.detail}</p>
                </div>
                <span className={cn('shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium', FLOW_STATUS[node.status].pill)}>{FLOW_STATUS[node.status].label}</span>
              </li>
            ))}
          </ol>
        </Frame>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Workspace: a dashboard mock-up of the product. Every figure is from the content (the three
 * queued examples, the 12% holdout default, the seven gates); the chart has no axis values.
 * ---------------------------------------------------------------------------------------------- */

const WORKSPACE_NAV: readonly { label: string; icon: keyof typeof WORKSPACE_ICONS; badge?: string }[] = [
  { label: 'Approval queue', icon: 'ListChecks', badge: '3' },
  { label: 'Inbox', icon: 'Inbox' },
  { label: 'Results', icon: 'ChartColumn' },
  { label: 'Industry packs', icon: 'Filter' },
  { label: 'Sending', icon: 'Send' },
];
const WORKSPACE_ICONS = { ListChecks: Icons.ListChecks, Inbox: Icons.Inbox, ChartColumn: Icons.ChartColumn, Filter: Icons.Filter, Send: Icons.Send } as const;

const QUEUE_ROWS: readonly { descriptor: string; signal: string; score?: string }[] = [
  { descriptor: EXAMPLE_LEAD.descriptor, signal: EXAMPLE_LEAD.evidence.trigger, score: EXAMPLE_SCORE.text },
  ...['tender-award', 'new-leader'].flatMap((id) => {
    const item = SIGNAL_TYPES.find((signal) => signal.id === id);
    return item === undefined ? [] : [{ descriptor: item.example, signal: item.name }];
  }),
];

const KPIS: readonly { label: string; value: string; note: string }[] = [
  { label: 'Waiting for approval', value: String(QUEUE_ROWS.length), note: 'leads in the queue' },
  { label: 'Holdout group', value: '12%', note: 'never contacted, by default' },
  { label: 'Send gates', value: String(SEND_GATES.length), note: 'checked on every send' },
];

// Two example series, no values: the contacted group against the holdout, the comparison Results makes.
const CONTACTED = '0,78 14,70 28,66 42,54 56,48 70,36 84,30 100,20';
const HOLDOUT = '0,80 14,78 28,75 42,74 56,70 70,68 84,66 100,62';

export function Workspace() {
  return (
    <Section id="workspace" labelledBy="workspace-title" band>
      <HeaderRow
        eyebrow="Workspace"
        titleId="workspace-title"
        title="One workspace for the whole loop"
        lead="The queue you approve from, the inbox for replies and inbound leads, and Results, which compares contacted accounts with a holdout so you see what outreach added."
        action={<ActionLink href="#join">Join the waitlist</ActionLink>}
      />
      <Reveal className={CONTENT_GAP}>
        <Frame innerClassName="flex overflow-hidden">
          <div aria-hidden="true" className="flex w-full">
            <aside className="hidden w-52 shrink-0 flex-col gap-1 border-r bg-muted/40 p-3 md:flex">
              <p className="flex items-center gap-2 px-2 pt-1 pb-3 text-sm font-semibold text-foreground">
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Icons.Radar className="size-3.5" strokeWidth={2.25} />
                </span>
                {BRAND_NAME}
              </p>
              {WORKSPACE_NAV.map((item, index) => {
                const Icon = WORKSPACE_ICONS[item.icon];
                return (
                  <span
                    key={item.label}
                    className={cn('flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]', index === 0 ? 'bg-card font-medium text-foreground shadow-xs ring-1 ring-border' : 'text-muted-foreground')}
                  >
                    <Icon className="size-4" />
                    {item.label}
                    {item.badge !== undefined && <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{item.badge}</span>}
                  </span>
                );
              })}
            </aside>
            <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-foreground">Approval queue</p>
                <Tag>Example workspace</Tag>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {KPIS.map((kpi) => (
                  <div key={kpi.label} className="flex flex-col gap-1 rounded-lg border p-3.5">
                    <span className="text-[12px] text-muted-foreground">{kpi.label}</span>
                    <span className="font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">{kpi.value}</span>
                    <span className="text-[11px] text-muted-foreground">{kpi.note}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-lg border">
                  <p className="border-b bg-muted/40 px-3.5 py-2 text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">Waiting for a person</p>
                  <ul className="divide-y">
                    {QUEUE_ROWS.map((row) => (
                      <li key={row.descriptor} className="flex items-center gap-3 px-3.5 py-3">
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <p className="truncate text-[13px] font-medium text-foreground">{row.descriptor}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{row.signal}</p>
                        </div>
                        {row.score !== undefined ? (
                          <span className="font-mono text-sm font-semibold text-primary tabular-nums">{row.score}</span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Scoring</span>
                        )}
                        <span className="hidden gap-1 sm:flex">
                          <span className="inline-flex h-6 items-center rounded-md border px-2 text-[11px] text-foreground">Reject</span>
                          <span className="inline-flex h-6 items-center rounded-md bg-primary px-2 text-[11px] text-primary-foreground">Approve</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 rounded-lg border p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-foreground">Results: meetings</p>
                    <span className="flex gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-0.5 w-3 rounded-full bg-primary" />
                        Contacted
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-0.5 w-3 rounded-full bg-muted-foreground/60" />
                        Holdout
                      </span>
                    </span>
                  </div>
                  <svg viewBox="0 0 100 90" preserveAspectRatio="none" className="h-36 w-full">
                    {[20, 40, 60, 80].map((y) => (
                      <line key={y} x1="0" x2="100" y1={y} y2={y} className="stroke-border" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    ))}
                    <polyline points={`${CONTACTED} 100,90 0,90`} className="fill-primary/10" />
                    <polyline points={CONTACTED} fill="none" className="stroke-primary" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                    <polyline points={HOLDOUT} fill="none" className="stroke-muted-foreground/60" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[11px] text-muted-foreground">The gap between the lines is the lift outreach added. Example shape, no real data.</p>
                </div>
              </div>
            </div>
          </div>
        </Frame>
      </Reveal>
    </Section>
  );
}
