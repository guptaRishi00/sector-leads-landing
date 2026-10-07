import { cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, EXAMPLE_SCORE, SEND_GATES } from '@/lib/marketing/content';
import { FlowMotion } from '../flow-motion';
import { Reveal } from '../reveal';
import { CONTENT_GAP, Frame, Section, SectionHeader } from './ui';

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
  done: { card: 'border-border', pill: 'bg-success-soft text-success', label: 'Done', line: 'color-mix(in oklab, var(--primary) 45%, transparent)', dash: 4, duration: 8 },
  active: { card: 'border-highlight/60 ring-4 ring-highlight-soft', pill: 'bg-highlight-soft text-highlight-foreground', label: 'Waiting for you', line: 'var(--highlight)', dash: 4, duration: 6 },
  todo: { card: 'border-dashed border-control/60 bg-card/80', pill: 'bg-muted text-muted-foreground', label: 'Queued', line: 'color-mix(in oklab, var(--muted-foreground) 45%, transparent)', dash: 3, duration: 16 },
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
        <span className="absolute inset-0 rounded-full bg-highlight/30 motion-safe:animate-ping" />
        <span className="relative size-2.5 rounded-full bg-highlight" />
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
                'absolute size-2 rounded-full bg-highlight shadow-[0_0_10px_2px_color-mix(in_oklab,var(--highlight)_55%,transparent)]',
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
          <span className="truncate text-xs font-medium text-foreground">{node.label}</span>
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
    <Section id="automation" labelledBy="automation-title">
      <SectionHeader
        eyebrow="Automation"
        titleId="automation-title"
        title="The reading is automated. The decisions stay with you."
        lead="Rules and a narrow model read the public record, check each event and score what qualifies. Then it stops: nothing moves past a lead or a draft until a person approves it."
      />
      <Reveal className={CONTENT_GAP}>
        <Frame bar="Automation">
          {/* The diagram from md; a plain stepper below it, where the canvas would be too narrow. */}
          <FlowMotion className="hidden md:block">
            <div
              role="img"
              aria-label={FLOW_DESCRIPTION}
              className="relative aspect-[16/6] min-h-[22rem] overflow-hidden rounded-xl bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
            >
              <div aria-hidden="true">
                {FLOW_NODES.slice(1).map((node, index) => {
                  const from = FLOW_NODES[index];
                  return from === undefined ? null : <FlowSegment key={node.id} from={from} to={node} status={node.status} delay={index * 0.4} />;
                })}
                {FLOW_NODES.map((node) => (
                  <FlowCard key={node.id} node={node} />
                ))}
                <p className="absolute top-3 left-4 text-xs font-medium text-muted-foreground">Automated</p>
                <p className="absolute bottom-3 left-4 text-xs font-medium text-muted-foreground">After your approval</p>
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
