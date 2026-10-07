import { cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, EXAMPLE_SCORE, REJECT_EXAMPLES, SEND_GATES, SIGNAL_TYPES, STEPS } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { StepRail } from '../step-rail';
import { CONTENT_GAP, Frame, FrameTitle, ICON_TILE, Line, Section, SectionHeader, sentence, SIGNAL_ICONS, Tag } from './ui';

const STEP_ICONS = {
  Radar: Icons.Radar,
  ListChecks: Icons.ListChecks,
  UserRound: Icons.UserRound,
  MailCheck: Icons.MailCheck,
  ShieldCheck: Icons.ShieldCheck,
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
              <span className="font-mono text-sm font-medium text-primary tabular-nums">{EXAMPLE_SCORE.text}</span>
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
    <Section id="how-it-works" labelledBy="how-title" band>
      <SectionHeader
        eyebrow="How it works"
        titleId="how-title"
        title="From a public event to an email a person approved"
        lead="Five steps, in this order. A person decides at every point that matters."
      />
      <div className={CONTENT_GAP}>
        <StepRail label="How it works, step by step" items={STEPS.map((step) => ({ id: step.id, title: step.title.split(',')[0] ?? step.title }))}>
          {STEPS.map((step) => {
            const Icon = STEP_ICONS[step.icon];
            return (
              <article key={step.id} id={`step-${step.id}`} data-step="" aria-labelledby={`step-${step.id}-title`} className="scroll-mt-28">
                <Reveal className="flex flex-col gap-7">
                  <div className="flex max-w-2xl flex-col gap-4">
                    <span className={ICON_TILE}>
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <h3 id={`step-${step.id}-title`} className="text-[1.375rem] leading-[1.25] font-medium tracking-[-0.01em] text-balance sm:text-[1.75rem] sm:leading-[1.2]">
                      <span className="text-foreground">{sentence(step.title)}</span>
                      <span className="text-muted-foreground"> {step.body}</span>
                    </h3>
                  </div>
                  <Frame bar>
                    <StepVisual id={step.id} />
                  </Frame>
                </Reveal>
              </article>
            );
          })}
        </StepRail>
      </div>
    </Section>
  );
}
