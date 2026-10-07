'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useReducer, type ReactNode } from 'react';
import { Button, cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, EXAMPLE_SCORE, SEND_GATES } from '@/lib/marketing/content';
import { useAutoplay } from './use-autoplay';

/* ------------------------------------------------------------------------------------------------
 * Automation: Attio's workflow canvas, run the way Attio runs it. Step cards (an icon tile, a title,
 * a detail) with a status pill above them, joined by connectors with rounded elbows, port dots and
 * arrowheads, on a dotted grey canvas, read as a snake: the automated half along the top, the line
 * dropping and running back under it into "You approve", the rest along the second row.
 *
 * The run: each step in turn shows "Running" while a blue line traces its border, then turns "Done"
 * with a blue border; the connector out of it draws itself to the next step, and that one starts.
 * The two steps that wait on a person (approving the lead, approving the draft) hold on "Waiting for
 * you" before turning "Approved". When the last step is done the canvas holds, fades out, resets and
 * runs again. The server renders the frame where the run waits for your approval (and it stays there
 * under reduced motion); it plays under the page's autoplay rules (useAutoplay).
 *
 * The diagram is one SVG with a fixed coordinate system (cards are HTML in <foreignObject>), so it
 * scales as one picture; below lg the same steps and statuses show as a stacked list. Illustration
 * only: role="img" with a text description, inner markup aria-hidden.
 * ---------------------------------------------------------------------------------------------- */

type Tone = 'blue' | 'green' | 'amber' | 'coral';

interface FlowNode {
  id: string;
  label: string;
  detail: string;
  icon: keyof typeof FLOW_ICONS;
  tone: Tone;
  /** Waits for a person before it completes. */
  waits?: boolean;
}

const FLOW_ICONS = {
  Database: Icons.Database,
  Radar: Icons.Radar,
  ShieldCheck: Icons.ShieldCheck,
  Target: Icons.Target,
  UserRound: Icons.UserRound,
  Users: Icons.Users,
  Mail: Icons.Mail,
  Send: Icons.Send,
} as const;

const FLOW_NODES: readonly FlowNode[] = [
  { id: 'sources', label: 'Public record', detail: 'Companies House, TED, SAM.gov', icon: 'Database', tone: 'blue' },
  { id: 'signal', label: 'Signal found', detail: EXAMPLE_LEAD.evidence.trigger, icon: 'Radar', tone: 'amber' },
  { id: 'checks', label: 'Rules and AI checks', detail: 'Same company? Own industry?', icon: 'ShieldCheck', tone: 'green' },
  { id: 'lead', label: 'Lead scored', detail: `${EXAMPLE_SCORE.text} of ${EXAMPLE_SCORE.max}, with evidence`, icon: 'Target', tone: 'blue' },
  { id: 'approve', label: 'You approve', detail: 'Nothing moves without you', icon: 'UserRound', tone: 'coral', waits: true },
  { id: 'buyer', label: 'Buyer found', detail: 'Their address verified', icon: 'Users', tone: 'green' },
  { id: 'draft', label: 'AI first draft', detail: `Cites ${EXAMPLE_LEAD.evidence.title}`, icon: 'Mail', tone: 'amber', waits: true },
  { id: 'send', label: 'Gates, then send', detail: `${SEND_GATES.length} checks, your own mailbox`, icon: 'Send', tone: 'blue' },
];

const LAST = FLOW_NODES.length - 1;

/** Icon tiles in the theme's soft tones (no raw colours); coral is kept for what waits on a person. */
const TONE: Record<Tone, string> = {
  blue: 'bg-selected text-primary',
  green: 'bg-success-soft text-success',
  amber: 'bg-warning-soft text-warning-foreground',
  coral: 'bg-highlight-soft text-highlight-foreground',
};

type Status = 'queued' | 'running' | 'waiting' | 'done' | 'approved';

const STATUS: Record<Status, { card: string; pill: string; label: string }> = {
  queued: { card: 'border-border', pill: 'border-border bg-muted text-muted-foreground', label: 'Queued' },
  running: { card: 'border-border', pill: 'border-primary/25 bg-selected text-primary', label: 'Running' },
  waiting: { card: 'border-highlight ring-[3px] ring-highlight-soft', pill: 'border-highlight/30 bg-highlight-soft text-highlight-foreground', label: 'Waiting for you' },
  done: { card: 'border-primary/70', pill: 'border-success/25 bg-success-soft text-success', label: 'Done' },
  approved: { card: 'border-primary/70', pill: 'border-success/25 bg-success-soft text-success', label: 'Approved' },
};

// The clock. `at` is the step in hand; each step runs, waits if it needs a person, then links to the
// next (its connector draws). After the last: hold, fade, reset to idle, run again.
type Stage = 'idle' | 'run' | 'wait' | 'link' | 'end' | 'fade';

interface FlowState {
  at: number;
  stage: Stage;
}

/** The frame the server renders: the automated half done, waiting on your approval. */
const INITIAL: FlowState = { at: FLOW_NODES.findIndex((node) => node.waits === true), stage: 'wait' };

const RUN = 1.1;
const LINK = 0.65;
const LONG_LINK = 1.1;
const HOLD: Record<Stage, number> = { idle: 800, run: RUN * 1000, wait: 1900, link: LINK * 1000, end: 2600, fade: 550 };

/** The connector into node `to` from the one before it is the long elbow when they sit on different rows. */
const longLinkInto = (to: number) => cardTop(to) !== cardTop(to - 1);

function next(state: FlowState): FlowState {
  const node = FLOW_NODES[state.at];
  switch (state.stage) {
    case 'idle':
      return { at: 0, stage: 'run' };
    case 'run':
      if (node?.waits === true) return { ...state, stage: 'wait' };
      return { ...state, stage: state.at === LAST ? 'end' : 'link' };
    case 'wait':
      return { ...state, stage: state.at === LAST ? 'end' : 'link' };
    case 'link':
      return { at: state.at + 1, stage: 'run' };
    case 'end':
      return { ...state, stage: 'fade' };
    default:
      return { at: -1, stage: 'idle' };
  }
}

const holdFor = (state: FlowState) => (state.stage === 'link' && longLinkInto(state.at + 1) ? LONG_LINK * 1000 : HOLD[state.stage]);

function statusOf(index: number, state: FlowState): Status {
  const node = FLOW_NODES[index];
  const finished: Status = node?.waits === true ? 'approved' : 'done';
  if (index < state.at) return finished;
  if (index > state.at) return 'queued';
  if (state.stage === 'run') return 'running';
  if (state.stage === 'wait') return 'waiting';
  return finished;
}

type Wire = 'idle' | 'drawing' | 'drawn';

/** The connector into node `to`: drawn once the run has reached it, drawing while it links there. */
function wireInto(to: number, state: FlowState): Wire {
  if (to <= state.at) return 'drawn';
  if (to === state.at + 1 && state.stage === 'link') return 'drawing';
  return 'idle';
}

// The canvas, in SVG user units: two rows of four cards.
const VIEW_W = 1200;
const VIEW_H = 520;
const CARD_W = 248;
const CARD_H = 92;
const PILL_H = 30;
const PAD = 6; // room around each card for its focus-like ring
const ROW_TOP = [96, 380] as const;
const COL_GAP = (VIEW_W - 80 - 4 * CARD_W) / 3;
const RADIUS = 12;

function cardX(index: number) {
  return 40 + (index % 4) * (CARD_W + COL_GAP);
}
function cardTop(index: number) {
  return ROW_TOP[index < 4 ? 0 : 1];
}
const portY = (index: number) => cardTop(index) + CARD_H / 2;

/** The connector into node `to` from the node before it: straight along a row, or the long elbowed run from the top row back under it. */
function connectorPath(to: number) {
  const from = to - 1;
  const sx = cardX(from) + CARD_W;
  const sy = portY(from);
  const tx = cardX(to) - 1;
  const ty = portY(to);
  if (sy === ty) return `M ${sx} ${sy} H ${tx}`;
  const right = sx + 22;
  const left = 18;
  const mid = (cardTop(from) + CARD_H + cardTop(to) - PILL_H) / 2;
  const r = RADIUS;
  return [
    `M ${sx} ${sy}`,
    `H ${right - r} Q ${right} ${sy} ${right} ${sy + r}`,
    `V ${mid - r} Q ${right} ${mid} ${right - r} ${mid}`,
    `H ${left + r} Q ${left} ${mid} ${left} ${mid + r}`,
    `V ${ty - r} Q ${left} ${ty} ${left + r} ${ty}`,
    `H ${tx}`,
  ].join(' ');
}

/** A card's outline as one path from its top-left corner, clockwise (the trigger's top-left corner is square). */
function outlinePath(index: number) {
  const x = cardX(index) + 0.5;
  const y = cardTop(index) + 0.5;
  const w = CARD_W - 1;
  const h = CARD_H - 1;
  const r = RADIUS;
  const tl = index === 0 ? 0 : r;
  return [
    `M ${x + tl} ${y}`,
    `H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r}`,
    `V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r}`,
    `V ${y + tl}`,
    tl > 0 ? `Q ${x} ${y} ${x + tl} ${y}` : '',
  ].join(' ');
}

function StatusPill({ status, className }: { status: Status; className?: string }) {
  const style = STATUS[status];
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-xs font-medium whitespace-nowrap', style.pill, className)}>
      {(status === 'done' || status === 'approved') && <Icons.Check className="size-3.5" strokeWidth={2.5} />}
      {status === 'running' && <Icons.LoaderCircle className="size-3.5 motion-safe:animate-spin" />}
      {status === 'waiting' && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full rounded-full bg-highlight opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-1.5 rounded-full bg-highlight" />
        </span>
      )}
      {style.label}
    </span>
  );
}

/** The pill, swapped with a small fade and rise when the status changes (old and new share one grid cell, right-aligned). */
function Pill({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn('grid', className)}>
      <AnimatePresence initial={false}>
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="inline-flex justify-self-end [grid-area:1/1]"
        >
          <StatusPill status={status} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function IconTile({ node, className }: { node: FlowNode; className?: string }) {
  const Icon = FLOW_ICONS[node.icon];
  return (
    <span className={cn('inline-flex size-7 shrink-0 items-center justify-center rounded-md', TONE[node.tone], className)}>
      <Icon className="size-4" />
    </span>
  );
}

/** One step card with its pill row (and the Trigger tab on the first), as HTML inside the SVG. */
function FlowCard({ node, index, status }: { node: FlowNode; index: number; status: Status }) {
  const trigger = index === 0;
  return (
    <foreignObject x={cardX(index) - PAD} y={cardTop(index) - PILL_H} width={CARD_W + PAD * 2} height={CARD_H + PILL_H + PAD}>
      <div className="flex h-full flex-col px-1.5 pb-1.5">
        <div className="flex h-[30px] shrink-0 items-end justify-between">
          {trigger ? (
            <span className="inline-flex h-6 items-center gap-1 rounded-t-md bg-primary px-2 text-xs font-medium text-primary-foreground">
              <Icons.Play className="size-3" />
              Trigger
            </span>
          ) : (
            <span />
          )}
          <Pill status={status} className="mb-1.5" />
        </div>
        <div
          className={cn(
            'flex flex-1 flex-col justify-center gap-1.5 rounded-xl border bg-card px-3.5 transition-[border-color,box-shadow] duration-300',
            trigger && 'rounded-tl-none',
            STATUS[status].card,
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <IconTile node={node} />
            <span className="truncate text-[15px] font-medium text-foreground">{node.label}</span>
          </div>
          <p className="truncate text-[13px] text-muted-foreground">{node.detail}</p>
        </div>
      </div>
    </foreignObject>
  );
}

function FlowCanvas({ state }: { state: FlowState }) {
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block h-auto w-full">
      {/* The whole run fades out before it resets. */}
      <motion.g animate={{ opacity: state.stage === 'fade' ? 0.15 : 1 }} transition={{ duration: HOLD.fade / 1000, ease: 'easeInOut' }}>
        <text x={40} y={36} className="fill-muted-foreground text-[13px] font-medium">
          Automated
        </text>
        <text x={40} y={ROW_TOP[1] - PILL_H - 12} className="fill-muted-foreground text-[13px] font-medium">
          After your approval
        </text>
        {FLOW_NODES.slice(1).map((node, offset) => {
          const to = offset + 1;
          const tx = cardX(to) - 1;
          const ty = portY(to);
          const wire = wireInto(to, state);
          const arrow = `M ${tx - 6} ${ty - 4.5} L ${tx} ${ty} L ${tx - 6} ${ty + 4.5}`;
          return (
            <g key={node.id} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d={connectorPath(to)} className="stroke-control/50" />
              <path d={arrow} className="stroke-control/50" />
              {/* The live line, drawn from the port along the connector, then its arrowhead. */}
              <motion.path
                d={connectorPath(to)}
                className="stroke-primary"
                animate={{ pathLength: wire === 'idle' ? 0 : 1, opacity: wire === 'idle' ? 0 : 1 }}
                transition={wire === 'drawing' ? { duration: longLinkInto(to) ? LONG_LINK : LINK, ease: 'easeInOut' } : { duration: 0 }}
              />
              <motion.path d={arrow} className="stroke-primary" animate={{ opacity: wire === 'drawn' ? 1 : 0 }} transition={{ duration: wire === 'drawn' ? 0.15 : 0 }} />
            </g>
          );
        })}
        {FLOW_NODES.slice(0, -1).map((node, index) => (
          <circle
            key={node.id}
            cx={cardX(index) + CARD_W}
            cy={portY(index)}
            r={4}
            strokeWidth={2}
            className={cn('stroke-card transition-[fill] duration-300', wireInto(index + 1, state) === 'idle' ? 'fill-control/60' : 'fill-primary')}
          />
        ))}
        {FLOW_NODES.map((node, index) => (
          <FlowCard key={node.id} node={node} index={index} status={statusOf(index, state)} />
        ))}
        {/* The step running: a blue line traces its border once round. */}
        {state.stage === 'run' && (
          <motion.path
            key={`trace-${state.at}`}
            d={outlinePath(state.at)}
            fill="none"
            strokeWidth={1.5}
            strokeLinecap="round"
            className="stroke-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: RUN, ease: 'linear' }}
          />
        )}
      </motion.g>
    </svg>
  );
}

export const FLOW_DESCRIPTION = `Diagram, playing on a loop: ${FLOW_NODES.map((node) => node.label).join(', then ')}. Each step runs in turn; the run stops at ${FLOW_NODES.filter(
  (node) => node.waits === true,
)
  .map((node) => node.label)
  .join(' and at ')} until a person approves.`;

/**
 * Below lg, the same steps and statuses as a stacked list laid out like the canvas: each card with
 * its pill on a row of its own above it, right-aligned, so the card's full width goes to the title
 * and detail, and a status change (a wider or narrower pill) never rewraps anything.
 */
function FlowList({ state }: { state: FlowState }): ReactNode {
  return (
    <ol className="flex flex-col gap-1.5 p-3">
      {FLOW_NODES.map((node, index) => {
        const status = statusOf(index, state);
        return (
          <li key={node.id} className="flex flex-col gap-1.5">
            <Pill status={status} className="h-6" />
            <div className={cn('flex items-start gap-3 rounded-xl border bg-card px-3.5 py-3 transition-[border-color,box-shadow] duration-300', STATUS[status].card)}>
              <IconTile node={node} className="mt-0.5" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">{node.label}</p>
                <p className="text-[13px] text-muted-foreground">{node.detail}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function PauseButton({ paused, onClick, className }: { paused: boolean; onClick: () => void; className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      aria-label={paused ? 'Play the example run' : 'Pause the example run'}
      className={cn('size-8 rounded-lg bg-card/80 text-muted-foreground ring-1 ring-border [&_svg]:size-3.5', className)}
    >
      {paused ? <Icons.Play aria-hidden="true" /> : <Icons.Pause aria-hidden="true" />}
    </Button>
  );
}

export function AutomationFlow() {
  const [state, step] = useReducer(next, INITIAL);
  const { ref, animated, running, paused, togglePaused, hold } = useAutoplay<HTMLDivElement>();

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(step, holdFor(state));
    return () => window.clearTimeout(timer);
  }, [running, state]);

  return (
    <div
      ref={ref}
      {...hold}
      className="relative bg-muted bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px)] [background-size:16px_16px]"
    >
      {/* The canvas from lg; the stacked list below it, where the canvas would be too small to read. */}
      <div role="img" aria-label={FLOW_DESCRIPTION} className="hidden px-2 py-1 lg:block">
        <div aria-hidden="true">
          <FlowCanvas state={state} />
        </div>
      </div>
      {animated && <PauseButton paused={paused} onClick={togglePaused} className="absolute top-4 right-4 hidden lg:inline-flex" />}
      <div className="lg:hidden">
        <p className="sr-only">{FLOW_DESCRIPTION}</p>
        {/* A fixed-height row, so the button's arrival after hydration moves nothing. */}
        <div className="flex h-11 items-end justify-between px-3">
          <span aria-hidden="true" className="pb-1.5 text-[13px] font-medium text-muted-foreground">
            Example run
          </span>
          {animated && <PauseButton paused={paused} onClick={togglePaused} />}
        </div>
        <div aria-hidden="true">
          <FlowList state={state} />
        </div>
      </div>
    </div>
  );
}
