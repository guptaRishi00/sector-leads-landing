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
import { WaitlistForm } from './waitlist-form';

const H2 = 'text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl';
const LEAD = 'max-w-[62ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg';

function Section({ id, labelledBy, className, children }: { id: string; labelledBy: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('scroll-mt-20 py-20 sm:py-28', className)}>
      <div className={CONTAINER}>{children}</div>
    </section>
  );
}

function ExampleLeadCard() {
  return (
    <section
      aria-labelledby="example-lead-title"
      className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-[0_1px_2px_var(--shadow-color),0_12px_40px_-12px_var(--shadow-color)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="example-lead-title" className="text-[13px] text-muted-foreground">
            Example lead
          </h2>
          <p className="text-[15px] font-medium text-pretty text-foreground">{EXAMPLE_LEAD.descriptor}</p>
        </div>
        <p className="flex shrink-0 flex-col items-end">
          <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">{EXAMPLE_SCORE.text}</span>
          <span className="text-xs text-muted-foreground">score of {EXAMPLE_SCORE.max}</span>
        </p>
      </div>
      <div className="border-t pt-5">
        <EvidencePanel evidence={EXAMPLE_LEAD.evidence} />
      </div>
      <p className="flex items-center gap-2 rounded-lg bg-muted/70 px-3 py-2 text-[13px] text-muted-foreground">
        <Icons.Inbox aria-hidden="true" className="size-4 shrink-0" />
        Waiting for a person to approve or reject it.
      </p>
    </section>
  );
}

export function Hero({ token }: { token: string }) {
  return (
    <section aria-labelledby="hero-title" className="border-b">
      <div className={cn(CONTAINER, 'grid items-start gap-12 pt-12 pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:pt-20 lg:pb-24')}>
        <div id="join" className="flex scroll-mt-24 flex-col gap-8">
          <div className="flex flex-col gap-5">
            <h1 id="hero-title" className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
              Leads from public events, with the proof attached.
            </h1>
            <p className={LEAD}>
              {BRAND_NAME} turns tenders, filings, new directors, hiring and funding into leads you can check, and sends only what you approve.
            </p>
          </div>
          <WaitlistForm token={token} source="landing-hero" className="max-w-xl" />
        </div>
        <ExampleLeadCard />
      </div>
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
      <div className="flex flex-col gap-4">
        <h2 id="how-title" className={H2}>
          From a public event to an email a person approved
        </h2>
        <p className={LEAD}>Five steps, in this order. A person decides at every point that matters.</p>
      </div>
      <ol className="relative mt-14 grid gap-10 lg:grid-cols-5 lg:gap-6">
        {STEPS.map((step, index) => {
          const Icon = STEP_ICONS[step.icon];
          return (
            <li key={step.id} className="relative flex gap-4 lg:flex-col">
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-11 bottom-[-2.5rem] left-[1.1875rem] w-px bg-border lg:top-[1.1875rem] lg:right-[-1.5rem] lg:bottom-auto lg:left-11 lg:h-px lg:w-auto"
                />
              )}
              <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card text-primary shadow-xs">
                <Icon aria-hidden="true" className="size-[18px]" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[15px] font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{step.body}</p>
              </div>
            </li>
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
    <Section id="signals" labelledBy="signals-title" className="bg-muted/40">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <h2 id="signals-title" className={H2}>
            What starts a lead
          </h2>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">
            Each signal is a dated record in a public source. The examples describe kinds of companies, not real ones.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ordered.map((signal, index) => {
            const Icon = SIGNAL_ICONS[signal.icon];
            return (
              <li
                key={signal.id}
                className={cn(
                  'flex flex-col gap-3 rounded-xl border bg-card p-5',
                  index === 0 && 'sm:col-span-2 sm:flex-row sm:items-start sm:gap-5 sm:p-6',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground',
                    index === 0 && 'bg-primary text-primary-foreground',
                  )}
                >
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{signal.name}</h3>
                  <p className={cn('text-pretty text-foreground/90', index === 0 ? 'text-lg leading-snug' : 'text-[15px] leading-snug')}>
                    {signal.example}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{signal.sources}</p>
                </div>
              </li>
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
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 id="proof-title" className={H2}>
              Every lead shows its work
            </h2>
            <p className={LEAD}>
              Five parts add up to the score, and each one says why. Records that don&apos;t qualify are kept with the reason, so you can check the rules instead of trusting them.
            </p>
          </div>
          <div className="flex flex-col gap-3">
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
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
          <p className="mb-4 text-[13px] text-muted-foreground">Example, from the lead above</p>
          <ScoreBreakdown score={EXAMPLE_SCORE} />
        </div>
      </div>
    </Section>
  );
}

export function Industries() {
  return (
    <Section id="industries" labelledBy="industries-title" className="border-t">
      <div className="flex flex-col gap-4">
        <h2 id="industries-title" className={H2}>
          Fifteen industries, each with its own rules
        </h2>
        <p className={LEAD}>
          A pack decides which signals count for your industry, which sources to read and which companies to leave out, such as your competitors and staffing firms.
        </p>
      </div>
      <ul className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRY_PACKS.map((pack) => (
          <li key={pack.id} className="flex flex-col gap-1 border-t py-5">
            <h3 className="text-[15px] font-medium text-foreground">{pack.name}</h3>
            <p className="text-sm text-pretty text-muted-foreground">{pack.watches}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Tile({ title, icon, className, children }: { title: string; icon: ReactNode; className?: string; children: ReactNode }) {
  return (
    <li className={cn('flex flex-col gap-3 rounded-2xl border bg-card p-6', className)}>
      <span aria-hidden="true" className="inline-flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
        {icon}
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {children}
    </li>
  );
}

export function Compliance() {
  return (
    <Section id="compliance" labelledBy="compliance-title" className="bg-muted/40">
      <div className="flex flex-col gap-4">
        <h2 id="compliance-title" className={H2}>
          Built to send within the law, and to keep your data yours
        </h2>
        <p className={LEAD}>The rules are in the product, not in a policy document. When a check fails, the email waits.</p>
      </div>
      <ul className="mt-12 grid gap-4 lg:grid-cols-3">
        <li className="flex flex-col gap-5 rounded-2xl border border-selected-border bg-selected p-6 sm:p-8 lg:col-span-2 lg:row-span-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-foreground">Seven gates before any email leaves</h3>
            <p className="max-w-[56ch] text-sm leading-relaxed text-pretty text-muted-foreground">
              They run in this order on every send, from your own mailbox. A send that fails more than one reports the first.
            </p>
          </div>
          <ol className="grid gap-2 sm:grid-cols-2">
            {SEND_GATES.map((gate, index) => (
              <li key={gate} className="flex items-center gap-3 sm:last:col-span-2 rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground">
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
        </li>
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
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <h2 id="faq-title" className={H2}>
          Questions
        </h2>
        <div className="divide-y border-y">
          {FAQ.map((item) => (
            <details key={item.id} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 text-base font-medium text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                {item.question}
                <Icons.ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none" />
              </summary>
              <p className="max-w-[65ch] pb-5 text-[15px] leading-relaxed text-pretty text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function FinalCta({ token }: { token: string }) {
  return (
    <section aria-labelledby="final-title" className="pb-24 sm:pb-28">
      <div className={CONTAINER}>
        <div className="grid gap-10 rounded-3xl border bg-card p-6 shadow-xs sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:p-12">
          <div className="flex flex-col gap-4">
            <h2 id="final-title" className={H2}>
              Get early access
            </h2>
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">
              We haven&apos;t opened access yet. Leave your email and we&apos;ll write when yours is ready. You can remove yourself with one link.
            </p>
          </div>
          <WaitlistForm token={token} source="landing-final" />
        </div>
      </div>
    </section>
  );
}
