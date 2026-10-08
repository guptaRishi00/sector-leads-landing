'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Handle, Position, ReactFlow, getSmoothStepPath, useReactFlow, useStore, type Edge, type EdgeProps, type Node, type NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { cn, Icons } from '@sl/ui';
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
 * The diagram is a React Flow canvas (@xyflow/react): custom step-card nodes and connector edges on
 * its smooth-step routing, laid out in flow units and fitted to the window; every interaction (drag,
 * select, pan, zoom, focus) is off and the page scrolls through it. Below lg the same steps and
 * statuses show as a stacked list. Illustration only: role="img" with a text description, inner
 * markup aria-hidden.
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

const RUN = 0.75;
const LINK = 0.45;
const LONG_LINK = 0.75;
const HOLD: Record<Stage, number> = { idle: 350, run: RUN * 1000, wait: 1300, link: LINK * 1000, end: 1800, fade: 450 };

/** The connector into node `to` from the one before it is the long elbow when they sit on different rows. */
const longLinkInto = (to: number) => row(to) !== row(to - 1);

/** Where the run starts when the canvas first comes into view: idle, every step queued. */
const RESTART: FlowState = { at: -1, stage: 'idle' };

type Action = 'advance' | 'restart';

const reduce = (state: FlowState, action: Action): FlowState => (action === 'restart' ? RESTART : next(state));

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

// The canvas, in flow units: two rows of four step cards (a pill row above each card), laid out and
// scaled by React Flow (fitView), joined by its smooth-step connectors.
const CARD_W = 248;
const CARD_H = 92;
const PILL_H = 30;
const COL_GAP = 48;
const ROW_GAP = 290;
const RADIUS = 12;

const row = (index: number) => (index < 4 ? 0 : 1);

/** A card's outline, in its own box, from its top-left corner clockwise (the trigger's top-left corner is square). */
function outline(trigger: boolean) {
  const [x, y, w, h, r] = [0.5, 0.5, CARD_W - 1, CARD_H - 1, RADIUS];
  const tl = trigger ? 0 : r;
  return [
    `M ${x + tl} ${y}`,
    `H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r}`,
    `V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r}`,
    `V ${y + tl}`,
    tl > 0 ? `Q ${x} ${y} ${x + tl} ${y}` : '',
  ].join(' ');
}

type StepData = { node: FlowNode; index: number };
type LabelData = { text: string };
type WireData = { to: number };

/**
 * The run's state, read by the step and wire components through context. React Flow is handed one
 * fixed set of nodes and edges (below) and never sees the state change: when it was carried in node
 * and edge data, every tick gave React Flow new nodes to re-process and it dropped every connector
 * for one frame while re-reading their handles, which showed as a flicker in a real browser.
 */
const RunContext = createContext<FlowState>(INITIAL);

/** The handles React Flow joins, at the card's middle height, invisible (the port dot is drawn by the card). */
const HANDLE = { top: PILL_H + CARD_H / 2, width: 1, height: 1, minWidth: 0, minHeight: 0, border: 0, background: 'transparent' } as const;

/** One step: the pill row (with the Trigger tab on the first) over the card, a blue trace round it while it runs. */
function StepNode({ data }: NodeProps<Node<StepData, 'step'>>) {
  const { node, index } = data;
  const state = useContext(RunContext);
  const status = statusOf(index, state);
  const tracing = state.stage === 'run' && state.at === index;
  const port = index === LAST ? 'none' : wireInto(index + 1, state) === 'idle' ? 'idle' : 'live';
  const trigger = index === 0;
  return (
    <div className="flex flex-col" style={{ width: CARD_W, height: PILL_H + CARD_H }}>
      <Handle type="target" position={Position.Left} isConnectable={false} style={HANDLE} />
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
          'relative flex flex-1 flex-col justify-center gap-1.5 rounded-xl border bg-card px-3.5 transition-[border-color,box-shadow] duration-300',
          trigger && 'rounded-tl-none',
          STATUS[status].card,
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <IconTile node={node} />
          <span className="truncate text-[15px] font-medium text-foreground">{node.label}</span>
        </div>
        <p className="truncate text-[13px] text-muted-foreground">{node.detail}</p>
        {tracing && (
          <svg className="pointer-events-none absolute -inset-px overflow-visible" width={CARD_W} height={CARD_H}>
            <motion.path
              d={outline(trigger)}
              fill="none"
              strokeWidth={1.5}
              strokeLinecap="round"
              className="stroke-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: RUN, ease: 'linear' }}
            />
          </svg>
        )}
        {port !== 'none' && (
          <span
            className={cn(
              'absolute top-1/2 -right-[5px] size-2.5 -translate-y-1/2 rounded-full border-2 border-card transition-colors duration-300',
              port === 'live' ? 'bg-primary' : 'bg-control/60',
            )}
          />
        )}
      </div>
      <Handle type="source" position={Position.Right} isConnectable={false} style={HANDLE} />
    </div>
  );
}

function LabelNode({ data }: NodeProps<Node<LabelData, 'label'>>) {
  return <span className="text-[13px] font-medium whitespace-nowrap text-muted-foreground">{data.text}</span>;
}

/** A connector: React Flow's smooth-step route, grey, with the live blue line drawn along it and its arrowhead on arrival. */
function WireEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps<Edge<WireData, 'wire'>>) {
  const [path] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: RADIUS, offset: 22 });
  const to = data?.to ?? 0;
  const wire = wireInto(to, useContext(RunContext));
  const arrow = `M ${targetX - 6} ${targetY - 4.5} L ${targetX} ${targetY} L ${targetX - 6} ${targetY + 4.5}`;
  return (
    <g fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} className="stroke-control/50" />
      <path d={arrow} className="stroke-control/50" />
      <motion.path
        d={path}
        className="stroke-primary"
        animate={{ pathLength: wire === 'idle' ? 0 : 1, opacity: wire === 'idle' ? 0 : 1 }}
        transition={wire === 'drawing' ? { duration: longLinkInto(to) ? LONG_LINK : LINK, ease: 'easeInOut' } : { duration: 0 }}
      />
      <motion.path d={arrow} className="stroke-primary" animate={{ opacity: wire === 'drawn' ? 1 : 0 }} transition={{ duration: wire === 'drawn' ? 0.15 : 0 }} />
    </g>
  );
}

const NODE_TYPES = { step: StepNode, label: LabelNode };
const EDGE_TYPES = { wire: WireEdge };

/** Keeps the whole run in frame when the window (and so the canvas) changes width. */
function FitOnResize() {
  const { fitView } = useReactFlow();
  const width = useStore((store) => store.width);
  useEffect(() => {
    if (width > 0) void fitView({ padding: 0.05 });
  }, [width, fitView]);
  return null;
}

/** The canvas's nodes and edges: built once and never changed (the run state reaches them through RunContext). */
const NODES: Node[] = [
  { id: 'label-automated', type: 'label', position: { x: 0, y: -44 }, width: 200, height: 20, data: { text: 'Automated' } satisfies LabelData },
  { id: 'label-after', type: 'label', position: { x: 0, y: ROW_GAP - 44 }, width: 200, height: 20, data: { text: 'After your approval' } satisfies LabelData },
  ...FLOW_NODES.map((node, index) => ({
    id: node.id,
    type: 'step',
    position: { x: (index % 4) * (CARD_W + COL_GAP), y: row(index) * ROW_GAP },
    width: CARD_W,
    height: PILL_H + CARD_H,
    data: { node, index } satisfies StepData,
  })),
];

const EDGES: Edge[] = FLOW_NODES.slice(1).map((node, offset) => ({
  id: `wire-${node.id}`,
  source: FLOW_NODES[offset]?.id ?? '',
  target: node.id,
  type: 'wire',
  data: { to: offset + 1 } satisfies WireData,
}));

function FlowCanvas({ state }: { state: FlowState }) {
  return (
    // The whole run fades out before it resets.
    <motion.div className="aspect-[1200/560] w-full" animate={{ opacity: state.stage === 'fade' ? 0.15 : 1 }} transition={{ duration: HOLD.fade / 1000, ease: 'easeInOut' }}>
      <RunContext.Provider value={state}>
        <ReactFlow
          nodes={NODES}
          edges={EDGES}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.05 }}
          minZoom={0.2}
          maxZoom={1.5}
          // An illustration, not an editor: nothing to drag, select, connect, focus, pan or zoom, and the
          // page scrolls through it.
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          style={{ background: 'transparent' }}
        >
          <FitOnResize />
        </ReactFlow>
      </RunContext.Provider>
    </motion.div>
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

export function AutomationFlow() {
  const [state, dispatch] = useReducer(reduce, INITIAL);
  const { ref, running, started } = useAutoplay<HTMLDivElement>();

  // The first time it comes into view, the run starts over from the trigger, in view.
  useEffect(() => {
    if (started) dispatch('restart');
  }, [started]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => dispatch('advance'), holdFor(state));
    return () => window.clearTimeout(timer);
  }, [running, state]);

  return (
    <div ref={ref} className="relative bg-muted bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px)] [background-size:16px_16px]">
      {/* The canvas from lg; the stacked list below it, where the canvas would be too small to read. */}
      <div role="img" aria-label={FLOW_DESCRIPTION} className="hidden px-2 py-1 lg:block">
        <div aria-hidden="true">
          <FlowCanvas state={state} />
        </div>
      </div>
      <div className="lg:hidden">
        <p className="sr-only">{FLOW_DESCRIPTION}</p>
        <div className="flex h-11 items-end px-3">
          <span aria-hidden="true" className="pb-1.5 text-[13px] font-medium text-muted-foreground">
            Example run
          </span>
        </div>
        <div aria-hidden="true">
          <FlowList state={state} />
        </div>
      </div>
    </div>
  );
}
