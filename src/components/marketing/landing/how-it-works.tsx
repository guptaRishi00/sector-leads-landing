import { cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, EXAMPLE_SCORE, SEND_GATES, STEPS } from '@/lib/marketing/content';
import { EvidenceStory } from '../evidence-story';
import { SignalExplainer, SignalFeed, SignalStory } from '../signal-story';
import { StepCards } from '../step-cards';
import { AppWindow, CONTENT_GAP, FrameTitle, Line, Section, SectionHeader, sentence, Tag } from './ui';

const STEP_ICONS = {
  Radar: Icons.Radar,
  ListChecks: Icons.ListChecks,
  UserRound: Icons.UserRound,
  MailCheck: Icons.MailCheck,
  ShieldCheck: Icons.ShieldCheck,
} as const;

const SEND_WINDOW = SEND_GATES.filter((gate) => gate === 'Legal basis for the country' || gate === 'Daily caps' || gate === 'Business hours and holidays');

const REACHABILITY = EXAMPLE_SCORE.lines.find((line) => line.id === 'reachability');

/** The view under each step of How it works after the first (which is SignalStory). Illustrations only; not interactive. */
function StepVisual({ id }: { id: string }) {
  switch (id) {
    case 'evidence':
      return <EvidenceStory />;
    case 'contact':
      return (
        <>
          <FrameTitle>After you approve</FrameTitle>
          <ol className="flex flex-col gap-3 p-4 sm:p-5">
            {[
              {
                label: 'Lead approved by a person',
                detail: EXAMPLE_LEAD.descriptor,
                done: true,
              },
              {
                label: 'The right person found',
                detail: REACHABILITY?.why ?? '',
                done: true,
              },
              {
                label: 'Their address verified',
                detail: 'Verified again before it sends',
                done: false,
              },
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
        title="From public event"
        accent="to approved email"
        lead="Five steps, in this order. A person decides at every point that matters."
      />
      <div className={CONTENT_GAP}>
        <StepCards
          label="How it works, step by step"
          steps={STEPS.map((step) => {
            const Icon = STEP_ICONS[step.icon];
            return { id: step.id, short: step.title.split(',')[0] ?? step.title, title: sentence(step.title), body: step.body, icon: <Icon className="size-[18px]" /> };
          })}
          views={STEPS.map((step) =>
            step.id === 'signal' ? (
              // The first step, drawn and then shown working, in one window: the three stages as a
              // panel beside a feed that runs by itself, on one clock (side by side from xl, stacked below).
              <SignalStory key={step.id}>
                <AppWindow innerClassName="grid grid-cols-1 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
                  <SignalExplainer className="border-b xl:border-r xl:border-b-0" />
                  <div className="flex min-w-0">
                    <SignalFeed />
                  </div>
                </AppWindow>
              </SignalStory>
            ) : (
              <AppWindow key={step.id}>
                <StepVisual id={step.id} />
              </AppWindow>
            ),
          )}
        />
      </div>
    </Section>
  );
}
