import type { ReactNode } from 'react';
import { Badge, Icons, cn } from '@sl/ui';
import { EvidencePanel } from '@/components/queue/evidence-panel';
import { ScoreBreakdown } from '@/components/queue/score-breakdown';
import { BRAND_NAME } from '@/lib/marketing/brand';
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
import { HeroIntro } from './hero-intro';
import { Reveal } from './reveal';
import { WaitlistForm } from './waitlist-form';

// One design language for every section: eyebrow → h2 → lead, the same gap from that header to the
// content, one card surface and one icon tile. The accent (primary) is kept to eyebrows, icon tiles,
// numbers and the call to action.
const H2 = 'text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-[2.5rem]';
const LEAD = 'max-w-[62ch] text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-8';
const CONTENT_GAP = 'mt-12 sm:mt-14';
const CARD = 'rounded-2xl border bg-card';
const CARD_HOVER =
  'transition-[translate,border-color,box-shadow] duration-300 ease-out hover:border-selected-border hover:shadow-md motion-safe:hover:-translate-y-0.5';
/** A hero piece GSAP brings in (see HeroIntro): hidden until the timeline starts, unless motion is reduced. */
const INTRO = 'motion-safe:opacity-0';
const ICON_TILE = 'inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-selected text-primary ring-1 ring-selected-border';

function Section({ id, labelledBy, band = false, className, children }: { id: string; labelledBy: string; band?: boolean; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('scroll-mt-16 py-20 sm:py-28', band && 'border-y bg-muted/40', className)}>
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

function ExampleLeadCard() {
  return (
    <section data-intro="" aria-labelledby="example-lead-title" className={cn(CARD, 'flex flex-col gap-5 p-4 shadow-lg sm:p-6', INTRO)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="example-lead-title" className="text-[13px] text-muted-foreground">
            Example lead
          </h2>
          <p className="text-[15px] font-medium text-pretty text-foreground">{EXAMPLE_LEAD.descriptor}</p>
        </div>
        <p className="flex shrink-0 flex-col items-end">
          <span className="font-mono text-2xl font-semibold text-primary tabular-nums">{EXAMPLE_SCORE.text}</span>
          <span className="text-xs text-muted-foreground">score of {EXAMPLE_SCORE.max}</span>
        </p>
      </div>
      <div className="border-t pt-5">
        <EvidencePanel evidence={EXAMPLE_LEAD.evidence} />
      </div>
      <p className="mt-auto flex items-center gap-2 rounded-lg bg-muted/70 px-3 py-2 text-[13px] text-muted-foreground">
        <Icons.Inbox aria-hidden="true" className="size-4 shrink-0" />
        Waiting for a person to approve or reject it.
      </p>
    </section>
  );
}

export function Hero({ token }: { token: string }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b">
      {/* A faint grid and an accent glow behind the card; both fade out well before the edges. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_85%_10%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)]" />
      </div>
      <HeroIntro className={cn(CONTAINER, 'grid items-start gap-12 pt-12 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-stretch lg:gap-14 lg:pt-24 lg:pb-24 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]')}>
        <div id="join" className="flex scroll-mt-24 flex-col gap-8">
          <div className="flex flex-col gap-5">
            <p data-intro="" className={cn('inline-flex h-7 items-center gap-2 self-start rounded-full border bg-card/70 px-3 text-xs font-medium text-muted-foreground', INTRO)}>
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Early access waitlist is open
            </p>
            <h1
              data-intro=""
              id="hero-title"
              className={cn('text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground sm:text-5xl sm:leading-[1.05]', INTRO)}
            >
              Leads from public events, with the proof attached.
            </h1>
            <p data-intro="" className={cn(LEAD, INTRO)}>
              {BRAND_NAME} turns tenders, filings, new directors, hiring and funding into leads you can check, and sends only what you approve.
            </p>
          </div>
          <div data-intro="" className={INTRO}>
            <WaitlistForm token={token} source="landing-hero" className="max-w-xl" />
          </div>
        </div>
        <ExampleLeadCard />
      </HeroIntro>
    </section>
  );
}

const STEP_ICONS = {
  Radar: Icons.Radar,
  ListChecks: Icons.ListChecks,
  UserRound: Icons.UserRound,
  MailCheck: Icons.MailCheck,
  ShieldCheck: Icons.ShieldCheck,
} as const;

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <SectionHeader
        eyebrow="How it works"
        titleId="how-title"
        title="From a public event to an email a person approved"
        lead="Five steps, in this order. A person decides at every point that matters."
      />
      <ol className={cn('grid gap-4 lg:grid-cols-5', CONTENT_GAP)}>
        {STEPS.map((step, index) => {
          const Icon = STEP_ICONS[step.icon];
          return (
            <Reveal as="li" key={step.id} delay={index * 0.08} className={cn(CARD, CARD_HOVER, 'flex gap-4 p-4 sm:p-5 lg:flex-col')}>
              <span className={ICON_TILE}>
                <Icon aria-hidden="true" className="size-[18px]" />
              </span>
              <div className="flex flex-col gap-1.5">
                <span aria-hidden="true" className="font-mono text-xs text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[15px] font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}

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

export function Signals() {
  const [featured, ...rest] = [
    ...SIGNAL_TYPES.filter((signal) => signal.id === 'secured-loan'),
    ...SIGNAL_TYPES.filter((signal) => signal.id !== 'secured-loan'),
  ];
  const ordered = featured === undefined ? rest : [featured, ...rest];
  return (
    <Section id="signals" labelledBy="signals-title" band>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <SectionHeader
          eyebrow="Signals"
          titleId="signals-title"
          title="What starts a lead"
          lead="Each signal is a dated record in a public source. The examples describe kinds of companies, not real ones."
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {ordered.map((signal, index) => {
            const Icon = SIGNAL_ICONS[signal.icon];
            return (
              <Reveal
                as="li"
                key={signal.id}
                delay={(index % 2) * 0.08}
                className={cn(
                  CARD,
                  CARD_HOVER,
                  'flex flex-col gap-4 p-5 sm:p-6',
                  index === 0 && 'border-selected-border sm:col-span-2 sm:flex-row sm:items-start sm:gap-5',
                )}
              >
                <span className={cn(ICON_TILE, index === 0 && 'bg-primary text-primary-foreground ring-primary')}>
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{signal.name}</h3>
                  <p className={cn('text-pretty text-foreground/90', index === 0 ? 'text-lg leading-snug' : 'text-[15px] leading-snug')}>
                    {signal.example}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{signal.sources}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

export function Proof() {
  return (
    <Section id="evidence" labelledBy="proof-title">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
        <div className="flex flex-col gap-10 lg:justify-between">
          <SectionHeader
            eyebrow="Evidence"
            titleId="proof-title"
            title="Every lead shows its work"
            lead="Five parts add up to the score, and each one says why. Records that don't qualify are kept with the reason, so you can check the rules instead of trusting them."
          />
          <Reveal className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Some of the reasons a record is rejected</h3>
            <ul className="flex flex-wrap gap-2">
              {REJECT_EXAMPLES.map((reason) => (
                <li key={reason.code}>
                  <Badge variant="muted" className="h-7 gap-1.5 rounded-md px-2.5 text-[13px] font-normal">
                    <Icons.Ban aria-hidden="true" className="size-3.5" />
                    {reason.label}
                  </Badge>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.08} className={cn(CARD, 'p-5 shadow-sm sm:p-6')}>
          <p className="mb-4 text-[13px] text-muted-foreground">Example, from the lead above</p>
          <ScoreBreakdown score={EXAMPLE_SCORE} />
        </Reveal>
      </div>
    </Section>
  );
}

export function Industries() {
  return (
    <Section id="industries" labelledBy="industries-title" band>
      <SectionHeader
        eyebrow="Industries"
        titleId="industries-title"
        title="Fifteen industries, each with its own rules"
        lead="A pack decides which signals count for your industry, which sources to read and which companies to leave out, such as your competitors and staffing firms."
      />
      <ul className={cn('grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3', CONTENT_GAP)}>
        {INDUSTRY_PACKS.map((pack, index) => (
          <Reveal as="li" key={pack.id} delay={(index % 3) * 0.08} className="group -mb-px flex gap-4 border-y py-5">
            <span aria-hidden="true" className="pt-0.5 font-mono text-xs text-muted-foreground tabular-nums transition-colors group-hover:text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-[15px] font-medium text-foreground">{pack.name}</h3>
              <p className="text-sm text-pretty text-muted-foreground">{pack.watches}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function Tile({ title, icon, className, children }: { title: string; icon: ReactNode; className?: string; children: ReactNode }) {
  return (
    <Reveal as="li" className={cn(CARD, CARD_HOVER, 'flex flex-col gap-4 p-5 sm:p-6', className)}>
      <span aria-hidden="true" className={ICON_TILE}>
        {icon}
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {children}
    </Reveal>
  );
}

export function Compliance() {
  return (
    <Section id="compliance" labelledBy="compliance-title">
      <SectionHeader
        eyebrow="Compliance"
        titleId="compliance-title"
        title="Built to send within the law, and to keep your data yours"
        lead="The rules are in the product, not in a policy document. When a check fails, the email waits."
      />
      <ul className={cn('grid gap-4 lg:grid-cols-3', CONTENT_GAP)}>
        <Reveal as="li" className="flex flex-col gap-5 rounded-2xl border border-selected-border bg-selected p-5 sm:p-8 lg:col-span-2 lg:row-span-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-foreground">Seven gates before any email leaves</h3>
            <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground">
              They run in this order on every send, from your own mailbox. A send that fails more than one reports the first.
            </p>
          </div>
          <ol className="grid gap-2 sm:grid-cols-2">
            {SEND_GATES.map((gate, index) => (
              <li key={gate} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground sm:last:col-span-2">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-xs font-semibold text-primary-foreground tabular-nums">
                  {index + 1}
                </span>
                {gate}
              </li>
            ))}
          </ol>
          <p className="text-[13px] text-pretty text-muted-foreground">
            Legal basis is set per country. Public holidays are built in for Australia, Canada, France, Germany, India, Ireland, Singapore, the UAE, the UK and the US.
          </p>
        </Reveal>
        <Tile title="Your own database" icon={<Icons.Database className="size-[18px]" />}>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
            Connect your own Postgres and your leads, contacts and messages are stored there. Every workspace is isolated by row-level security.
          </p>
        </Tile>
        <Tile title="Lift you can measure" icon={<Icons.ChartColumn className="size-[18px]" />}>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
            A holdout group, 12% of accounts by default, is never contacted. Results compares the two, so you see what outreach added.
          </p>
        </Tile>
        <Tile title="Suppression that sticks" icon={<Icons.Ban className="size-[18px]" />}>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
            Unsubscribes, complaints and hard bounces suppress the address. Every email carries a one-click unsubscribe and your postal address.
          </p>
        </Tile>
        <Tile title="Inbound in the same inbox" icon={<Icons.Inbox className="size-[18px]" />} className="lg:col-span-2">
          <p className="max-w-[60ch] text-sm leading-relaxed text-pretty text-muted-foreground">
            Your website form, Meta and LinkedIn lead ads and WhatsApp land in one inbox, routed by your rules and answered within the same limits as outbound.
          </p>
        </Tile>
      </ul>
    </Section>
  );
}

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title" band>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
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
    <section aria-labelledby="final-title" className="py-20 sm:py-28">
      <div className={CONTAINER}>
        <Reveal className="relative isolate grid gap-10 overflow-hidden rounded-3xl border border-selected-border bg-card p-5 shadow-sm sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_0%_0%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_70%)]" />
          <div className="flex flex-col gap-4">
            <Eyebrow>Join the waitlist</Eyebrow>
            <h2 id="final-title" className={H2}>
              Get early access
            </h2>
            <p className="text-base leading-7 text-pretty text-muted-foreground">
              We haven&apos;t opened access yet. Leave your email and we&apos;ll write when yours is ready. You can remove yourself with one link.
            </p>
          </div>
          <WaitlistForm token={token} source="landing-final" />
        </Reveal>
      </div>
    </section>
  );
}
