import { EXAMPLE_LEAD, EXAMPLE_SCORE, SEND_GATES, SIGNAL_TYPES } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { ResultsChart } from '../results-chart';
import { AppSidebar } from './product';
import { ActionLink, AppWindow, CONTENT_GAP, Section, SectionHeader, Tag } from './ui';

/* ------------------------------------------------------------------------------------------------
 * Workspace: a dashboard mock-up of the product. Every figure is from the content (the three
 * queued examples, the 12% holdout default, the seven gates); the chart has no axis values.
 * ---------------------------------------------------------------------------------------------- */

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
      <SectionHeader
        eyebrow="Workspace"
        titleId="workspace-title"
        title="One workspace"
        accent="for the whole loop"
        lead="The queue you approve from, the inbox for replies and inbound leads, and Results, which compares contacted accounts with a holdout so you see what outreach added."
        action={<ActionLink href="#join">Join the waitlist</ActionLink>}
      />
      <Reveal className={CONTENT_GAP}>
        <AppWindow shadow innerClassName="flex">
          <div aria-hidden="true" className="flex w-full">
            <AppSidebar className="hidden md:flex" />
            <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-medium text-foreground">Approval queue</p>
                <Tag>Example workspace</Tag>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {KPIS.map((kpi) => (
                  <div key={kpi.label} className="flex flex-col gap-1 rounded-lg border p-3.5">
                    <span className="text-[12px] text-muted-foreground">{kpi.label}</span>
                    <span className="font-mono text-2xl font-medium tracking-tight text-foreground tabular-nums">{kpi.value}</span>
                    <span className="text-[11px] text-muted-foreground">{kpi.note}</span>
                  </div>
                ))}
              </div>
              {/* Results, full width: contacted accounts against the holdout, drawn in on view. */}
              <div className="flex flex-col gap-3 rounded-lg border p-3.5 sm:p-4">
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
                <ResultsChart contacted={CONTACTED} holdout={HOLDOUT} className="h-44 pr-1.5 sm:h-52" />
                <p className="text-[11px] text-muted-foreground">The gap between the lines is the lift outreach added. Example shape, no real data.</p>
              </div>
            </div>
          </div>
        </AppWindow>
      </Reveal>
    </Section>
  );
}
