'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { Button, cn, Icons } from '@sl/ui';
import { BRAND_NAME } from '@/lib/marketing/brand';
import { SIGNAL_TYPES } from '@/lib/marketing/content';
import { useAutoplay } from './use-autoplay';

/**
 * How it works, step one, told as a loop: on the left the step itself (it happens, a public
 * source records it, we read it), on the right the product doing it on its own (a feed the events
 * land in). One clock drives both, so each event walks down the three stages and then drops into
 * the feed. The server renders the finished first event (nothing shifts when the loop starts);
 * from then on it advances every few seconds, pausing on hover or focus, while off screen and via
 * the pause button (WCAG 2.2.2). Under reduced motion it stays on that first, finished frame.
 * Illustration only: the moving parts are aria-hidden and a sentence describes them.
 */

interface FeedItem {
  id: string;
  signal: string;
  example: string;
  source: string;
  document: string;
  date: string;
}

// The three events the step names, twice over, with dates in reading order. Examples describe
// kinds of companies, never real ones; document names are the registers' own.
const STORIES: readonly FeedItem[] = [
  {
    id: 'tender-1',
    signal: 'tender-notice',
    example: 'A county council opens a tender for IT support.',
    source: 'Find a Tender',
    document: 'Tender notice',
    date: '29 Sep 2026',
  },
  {
    id: 'loan-1',
    signal: 'secured-loan',
    example: 'A UK manufacturer registers a new secured loan against its assets.',
    source: 'Companies House',
    document: 'Charge registered (MR01)',
    date: '30 Sep 2026',
  },
  {
    id: 'leader-1',
    signal: 'new-leader',
    example: 'A UK logistics firm appoints a new director.',
    source: 'Companies House',
    document: 'Director appointed (AP01)',
    date: '1 Oct 2026',
  },
  {
    id: 'tender-2',
    signal: 'tender-notice',
    example: 'A regional health authority tenders for medical supplies.',
    source: 'TED',
    document: 'Contract notice',
    date: '2 Oct 2026',
  },
  {
    id: 'loan-2',
    signal: 'secured-loan',
    example: 'A food distributor registers a charge in favour of its bank.',
    source: 'Companies House',
    document: 'Charge registered (MR01)',
    date: '5 Oct 2026',
  },
  {
    id: 'leader-2',
    signal: 'new-leader',
    example: 'A software company appoints a new finance director.',
    source: 'Companies House',
    document: 'Director appointed (AP01)',
    date: '6 Oct 2026',
  },
];

/** Older events already in the feed when it opens, so it always shows FEED_ROWS (nothing below it moves). */
const SEEDS: readonly FeedItem[] = [
  {
    id: 'award',
    signal: 'tender-award',
    example: 'A mid-sized contractor wins a public roads contract.',
    source: 'SAM.gov',
    document: 'Award notice',
    date: '26 Sep 2026',
  },
  {
    id: 'funding',
    signal: 'funding-round',
    example: 'A US software startup files a Form D for a new raise.',
    source: 'SEC EDGAR',
    document: 'Form D',
    date: '25 Sep 2026',
  },
  {
    id: 'hiring',
    signal: 'hiring-surge',
    example: 'A company posts five roles in a month.',
    source: 'Job boards',
    document: 'Job postings',
    date: '24 Sep 2026',
  },
  {
    id: 'regulator',
    signal: 'regulator-action',
    example: 'A data-protection regulator reprimands a company over a breach.',
    source: 'News',
    document: 'Press release',
    date: '23 Sep 2026',
  },
  { id: 'stack', signal: 'tech-change', example: 'A company you track switches its site platform.', source: 'Company websites', document: 'Site scan', date: '22 Sep 2026' },
];

const SOURCES: readonly string[] = ['Find a Tender', 'TED', 'SAM.gov', 'Companies House', 'SEC EDGAR'];

export const SIGNAL_STORY_DESCRIPTION =
  'Illustration, playing on a loop: a tender is published on Find a Tender, a secured loan is registered at Companies House and a director’s appointment is filed at Companies House. Each event is read from that record with its date, source and document, then added to a feed of events.';

const LOOK: Record<string, { icon: Icons.LucideIcon; tone: string }> = {
  'tender-notice': { icon: Icons.Megaphone, tone: 'bg-selected text-primary' },
  'tender-award': { icon: Icons.CircleCheck, tone: 'bg-selected text-primary' },
  'secured-loan': {
    icon: Icons.Database,
    tone: 'bg-warning-soft text-warning-foreground',
  },
  'new-leader': { icon: Icons.UserRound, tone: 'bg-success-soft text-success' },
  'funding-round': {
    icon: Icons.ChartLine,
    tone: 'bg-success-soft text-success',
  },
  'hiring-surge': {
    icon: Icons.Users,
    tone: 'bg-warning-soft text-warning-foreground',
  },
  'regulator-action': { icon: Icons.Shield, tone: 'bg-selected text-primary' },
};

const signalName = (id: string) => SIGNAL_TYPES.find((signal) => signal.id === id)?.name ?? id;

const FEED_ROWS = 6;
const EASE = [0.22, 1, 0.36, 1] as const;

// The clock: phase 0 the event, 1 the record, 2 the reading, 3 into the feed; how long each holds (ms).
type Phase = 0 | 1 | 2 | 3;
const HOLD: Record<Phase, number> = { 0: 1300, 1: 1500, 2: 1700, 3: 2600 };

interface State {
  story: number;
  phase: Phase;
  feed: readonly { key: number; item: FeedItem }[];
  fresh: boolean;
  nextKey: number;
}

const FIRST: FeedItem = STORIES[0] ?? {
  id: 'none',
  signal: 'tender-notice',
  example: '',
  source: '',
  document: '',
  date: '',
};

const INITIAL: State = {
  story: 0,
  phase: 3,
  feed: [FIRST, ...SEEDS].map((item, key) => ({ key, item })),
  fresh: false,
  nextKey: SEEDS.length + 1,
};

function advance(state: State): State {
  if (state.phase === 3)
    return {
      ...state,
      story: (state.story + 1) % STORIES.length,
      phase: 0,
      fresh: false,
    };
  if (state.phase < 2) return { ...state, phase: (state.phase + 1) as Phase };
  const item = STORIES[state.story] ?? FIRST;
  return {
    ...state,
    phase: 3,
    fresh: true,
    feed: [{ key: state.nextKey, item }, ...state.feed].slice(0, FEED_ROWS),
    nextKey: state.nextKey + 1,
  };
}

interface Story extends State {
  item: FeedItem;
  animated: boolean;
  running: boolean;
  paused: boolean;
  togglePaused: () => void;
}

const StoryContext = createContext<Story | null>(null);

function useStory(): Story {
  const story = useContext(StoryContext);
  if (story === null) throw new Error('SignalExplainer and SignalFeed belong inside SignalStory.');
  return story;
}

/** The clock and its pause rules, around the two halves (laid out by the caller). */
export function SignalStory({ className, children }: { className?: string; children: ReactNode }) {
  const [state, step] = useReducer(advance, INITIAL);
  // `animated` is false on the server and under reduced motion: the finished first frame stays put.
  const { ref, animated, running, paused, togglePaused, hold } = useAutoplay<HTMLDivElement>();

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(step, HOLD[state.phase]);
    return () => window.clearTimeout(timer);
  }, [running, state]);

  const item = STORIES[state.story] ?? FIRST;
  const value: Story = {
    ...state,
    item,
    animated,
    running,
    paused,
    togglePaused,
  };

  return (
    <StoryContext.Provider value={value}>
      <div ref={ref} className={className} {...hold}>
        <p className="sr-only">{SIGNAL_STORY_DESCRIPTION}</p>
        {children}
      </div>
    </StoryContext.Provider>
  );
}

function IconTile({ signal, className }: { signal: string; className?: string }) {
  const look = LOOK[signal];
  const Icon = look?.icon ?? Icons.Radar;
  return (
    <span className={cn('inline-flex size-6 shrink-0 items-center justify-center rounded-md', look?.tone ?? 'bg-muted text-muted-foreground', className)}>
      <Icon className="size-3.5" />
    </span>
  );
}

/** A swap of one event's content for the next: the old one lifts out, the new one rises in. */
function Swap({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

const Bar = ({ className }: { className?: string }) => <span className={cn('block h-1.5 rounded-full bg-muted', className)} />;

function Stage({ index, label, aside, last = false, children }: { index: number; label: string; aside?: ReactNode; last?: boolean; children: ReactNode }) {
  const { phase } = useStory();
  const done = phase > index;
  const active = phase === index;
  return (
    <li className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'relative mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
            done ? 'bg-primary text-primary-foreground' : active ? 'border-2 border-primary bg-card' : 'border-2 border-border bg-card',
          )}
        >
          {done && <Icons.Check className="size-2.5" strokeWidth={3.5} />}
          {active && <span className="size-1 rounded-full bg-primary motion-safe:animate-pulse" />}
        </span>
        {!last && (
          <span className="relative mt-1.5 mb-0.5 w-px flex-1 bg-border">
            <motion.span className="absolute inset-0 origin-top bg-primary" animate={{ scaleY: done ? 1 : 0 }} transition={{ duration: done ? 0.5 : 0.25, ease: EASE }} />
          </span>
        )}
      </div>
      <div className={cn('flex min-w-0 flex-col gap-1.5', !last && 'pb-3.5')}>
        <div className="flex h-4 items-center justify-between gap-3">
          <p className={cn('text-xs font-medium transition-colors duration-300', active || done ? 'text-foreground' : 'text-muted-foreground')}>{label}</p>
          {aside}
        </div>
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border bg-card transition-[border-color,box-shadow,opacity] duration-500',
            active ? 'border-primary/60 ring-2 ring-selected' : !done && 'opacity-60',
          )}
        >
          {children}
        </div>
      </div>
    </li>
  );
}

/** The step, drawn: the event, the public record that holds it, and what we read from it. */
export function SignalExplainer({ className }: { className?: string }) {
  const { item, phase } = useStory();
  const READ: readonly [string, string][] = [
    ['Event', signalName(item.signal)],
    ['Happened', item.date],
    ['Source', item.source],
    ['Document', item.document],
  ];
  return (
    <div aria-hidden="true" className={cn('flex min-w-0 flex-col', className)}>
      <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b px-3 sm:px-4">
        <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Icons.Radar className="size-3.5 text-muted-foreground" />
          Latest event
        </p>
        <span className="font-mono text-[10.5px] text-muted-foreground">{phase === 3 ? 'Read' : `Step ${phase + 1} of 3`}</span>
      </div>
      <ol className="flex flex-1 flex-col bg-muted/40 p-3 sm:p-4">
        <Stage index={0} label="It happens">
          <Swap id={item.id} className="flex h-[4.75rem] flex-col gap-1 p-2.5">
            <div className="flex items-center gap-2">
              <IconTile signal={item.signal} />
              <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{signalName(item.signal)}</p>
              <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] text-muted-foreground ring-1 ring-border">
                <Icons.CalendarCheck className="size-3" />
                {item.date}
              </span>
            </div>
            <p className="line-clamp-2 text-[11.5px] leading-[1.35] text-muted-foreground">{item.example}</p>
          </Swap>
        </Stage>
        <Stage index={1} label="A public source records it">
          <div className="relative h-[4.75rem]">
            {phase >= 1 ? (
              <Swap id={item.id} className="flex h-full flex-col gap-1.5 p-2.5">
                <div className="flex items-center gap-1.5">
                  <Icons.Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                  <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{item.source}</p>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    <span className="max-sm:hidden">Filed </span>
                    {item.date}
                  </span>
                </div>
                <span className="w-fit rounded bg-muted px-1.5 py-0.5 font-mono text-[10.5px] text-foreground ring-1 ring-border">{item.document}</span>
                <Bar className="mt-0.5 w-4/5" />
              </Swap>
            ) : (
              <div className="flex h-full flex-col justify-center gap-2 p-2.5">
                <Bar className="h-2 w-1/3" />
                <Bar className="w-11/12" />
                <Bar className="w-3/5" />
              </div>
            )}
            {/* The record being read: a soft band sweeps down it while we read. */}
            {phase === 1 && (
              <motion.span
                key={item.id}
                className="pointer-events-none absolute inset-x-0 h-10 bg-linear-to-b from-transparent via-[color-mix(in_oklab,var(--primary)_14%,transparent)] to-transparent"
                initial={{ top: '-2.5rem' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
              />
            )}
          </div>
        </Stage>
        <Stage
          index={2}
          label="We read it"
          last
          aside={
            <AnimatePresence>
              {phase === 3 && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary"
                >
                  Added to the feed
                  <Icons.ArrowRight className="size-3 max-xl:rotate-90" />
                </motion.span>
              )}
            </AnimatePresence>
          }
        >
          <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2.5 gap-y-1.5 p-2.5 text-[11.5px]">
            {READ.map(([term, detail], index) => (
              <div key={term} className="contents">
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="flex h-4 min-w-0 items-center">
                  {phase >= 2 ? (
                    <motion.span
                      key={`${item.id}-${term}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: phase === 2 ? 0.15 + index * 0.2 : 0,
                        ease: EASE,
                      }}
                      className={cn('truncate', term === 'Document' ? 'font-mono text-[10.5px] text-foreground' : 'font-medium text-foreground')}
                    >
                      {detail}
                    </motion.span>
                  ) : (
                    <Bar className={index % 2 === 0 ? 'w-20' : 'w-14'} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Stage>
      </ol>
    </div>
  );
}

/** Tag colours per source (theme soft tones), as the list's tags and the sidebar's spaces. */
const SOURCE_TONE: Record<string, string> = {
  'Find a Tender': 'bg-selected text-primary',
  TED: 'bg-selected text-primary',
  'SAM.gov': 'bg-selected text-primary',
  'Companies House': 'bg-warning-soft text-warning-foreground',
  'SEC EDGAR': 'bg-success-soft text-success',
};
const sourceTone = (source: string) => SOURCE_TONE[source] ?? 'bg-muted text-muted-foreground';

/** The list's columns: status, name, source tag, date (the tag column from sm). */
const ROW = 'grid h-9 grid-cols-[0.875rem_minmax(0,1fr)_4.25rem] items-center gap-x-2 px-3 sm:grid-cols-[0.875rem_minmax(0,1fr)_6.5rem_4.25rem] sm:px-4';

const VIEWS = [
  ['List', Icons.ListChecks],
  ['Board', Icons.ChartColumn],
  ['Calendar', Icons.CalendarCheck],
] as const;

function GroupHeader({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <div className="flex h-7 items-center gap-1.5 px-3 sm:px-4">
      <Icons.ChevronDown className="size-3 text-muted-foreground" />
      <span className={cn('inline-flex h-4 items-center rounded px-1 text-[9.5px] font-semibold tracking-wide uppercase', tone)}>{label}</span>
      <span className="text-[10.5px] font-medium text-muted-foreground tabular-nums">{count}</span>
    </div>
  );
}

function FeedRow({ item, status, fresh = false }: { item: FeedItem; status: 'reading' | 'read'; fresh?: boolean }) {
  return (
    <>
      {status === 'reading' ? (
        <span className="size-3 rounded-full border-[1.5px] border-dashed border-primary motion-safe:animate-spin motion-safe:[animation-duration:3s]" />
      ) : (
        <Icons.Check className="size-3.5 text-success" strokeWidth={2.75} />
      )}
      <p className="flex min-w-0 items-center gap-1.5 text-xs">
        <span className="truncate font-medium text-foreground">{signalName(item.signal)}</span>
        {fresh && <span className="shrink-0 rounded bg-primary px-1 text-[9px] leading-[14px] font-semibold text-primary-foreground">New</span>}
      </p>
      <span className={cn('hidden h-4 w-fit max-w-full items-center truncate rounded px-1 text-[10px] font-medium sm:inline-flex', sourceTone(item.source))}>{item.source}</span>
      <span className="text-right font-mono text-[10px] text-muted-foreground">{item.date}</span>
    </>
  );
}

/**
 * The product's side, as a ClickUp-style list view: a collapsed sidebar whose "spaces" are the
 * sources (the one being read is ringed), a breadcrumb and view tabs, then the events grouped by
 * status. Each event waits in READING while it walks the explainer's stages, then moves (a shared
 * layout animation) to the top of READ. Both groups keep a fixed number of rows, so nothing moves
 * the page. The tabs and sidebar are pictures of controls, not controls: all aria-hidden.
 */
export function SignalFeed() {
  const { item, phase, feed, fresh, nextKey, animated, running, paused, togglePaused } = useStory();
  const waiting = phase < 3;
  const reading = phase === 1 || phase === 2;
  return (
    <>
      <div aria-hidden="true" className="hidden w-9 shrink-0 flex-col items-center gap-1 border-r bg-muted/50 py-2 sm:flex">
        <span className="mb-1 inline-flex size-6 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">{BRAND_NAME.charAt(0)}</span>
        {[Icons.Inbox, Icons.Radar].map((Icon, index) => (
          <span
            key={index}
            className={cn('inline-flex size-6 items-center justify-center rounded-md', index === 1 ? 'bg-card text-foreground ring-1 ring-border' : 'text-muted-foreground')}
          >
            <Icon className="size-3.5" />
          </span>
        ))}
        <span className="my-1 h-px w-4 bg-border" />
        {SOURCES.map((source) => (
          <span
            key={source}
            className={cn(
              'inline-flex size-5 items-center justify-center rounded text-[10px] font-semibold transition-shadow duration-300',
              sourceTone(source),
              reading && source === item.source && 'ring-2 ring-primary ring-offset-1 ring-offset-muted',
            )}
          >
            {source.charAt(0)}
          </span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b pr-1 pl-3 sm:pl-4">
          <p className="flex min-w-0 items-center gap-1.5 text-xs">
            <span className="hidden text-muted-foreground sm:inline">Signals</span>
            <Icons.ChevronRight aria-hidden="true" className="hidden size-3 text-muted-foreground sm:block" />
            <span className="truncate font-medium text-foreground">Reading the public record</span>
            <span aria-hidden="true" className="relative ml-1 flex size-1.5 shrink-0">
              {running && <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />}
              <span className={cn('relative inline-flex size-1.5 rounded-full', running ? 'bg-primary' : 'bg-control')} />
            </span>
          </p>
          {animated && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={togglePaused}
              aria-label={paused ? 'Play the example feed' : 'Pause the example feed'}
              className="size-7 shrink-0 rounded-lg text-muted-foreground [&_svg]:size-3.5"
            >
              {paused ? <Icons.Play aria-hidden="true" /> : <Icons.Pause aria-hidden="true" />}
            </Button>
          )}
        </div>
        <div aria-hidden="true" className="flex h-8 shrink-0 items-end justify-between gap-3 border-b px-3 sm:px-4">
          <div className="flex items-end gap-3.5 text-[11.5px] font-medium">
            {VIEWS.map(([label, Icon], index) => (
              <span
                key={label}
                className={cn(
                  '-mb-px inline-flex items-center gap-1 border-b-2 pb-1.5',
                  index === 0 ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground',
                )}
              >
                <Icon className="size-3" />
                {label}
              </span>
            ))}
          </div>
          <span className="mb-1 hidden items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] text-muted-foreground ring-1 ring-border sm:inline-flex">
            <Icons.Filter className="size-2.5" />
            Group: Status
          </span>
        </div>
        <div aria-hidden="true" className="min-h-0 flex-1 overflow-hidden">
          <div className={cn(ROW, 'h-7 border-b text-[9.5px] font-medium tracking-wide text-muted-foreground uppercase')}>
            <span />
            <span>Name</span>
            <span className="hidden sm:block">Source</span>
            <span className="text-right">Date</span>
          </div>
          <GroupHeader label="Reading" count={waiting ? 1 : 0} tone="bg-primary text-primary-foreground" />
          <ul className="h-9">
            {waiting ? (
              <motion.li
                key={`reading-${nextKey}`}
                layoutId={`event-${nextKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                className={cn(ROW, 'bg-selected/40')}
              >
                <FeedRow item={item} status="reading" />
              </motion.li>
            ) : (
              <li className={cn(ROW, 'text-[11px] text-muted-foreground')}>
                <span className="size-3 rounded-full border-[1.5px] border-border" />
                <span>Waiting for the next event</span>
              </li>
            )}
          </ul>
          <GroupHeader label="Read" count={feed.length} tone="bg-success-soft text-success" />
          {/* popLayout takes the row leaving at the bottom out of the flow, so the list never grows. */}
          <ul className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {feed.map((row, index) => (
                <motion.li
                  key={row.key}
                  layoutId={`event-${row.key}`}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className={cn(ROW, 'border-t transition-colors duration-1000', fresh && index === 0 ? 'bg-selected/70' : 'bg-card')}
                >
                  <FeedRow item={row.item} status="read" fresh={fresh && index === 0} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
        <p className="shrink-0 border-t px-3 py-2 text-[11px] text-muted-foreground sm:px-4">Example feed. Every event keeps its date and a link to its source.</p>
      </div>
    </>
  );
}
