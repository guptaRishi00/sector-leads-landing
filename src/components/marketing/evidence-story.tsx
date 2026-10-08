'use client';

import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useReducer, type ReactNode } from 'react';
import { Button, cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, EXAMPLE_SCORE, REJECT_EXAMPLES, SIGNAL_TYPES } from '@/lib/marketing/content';
import { useAutoplay } from './use-autoplay';

/**
 * How it works, step two, as one working screen: events arrive one at a time, the rules run down
 * them in order (a spinner, then a tick or a cross), and the decision lands on the right: a lead
 * with its score counting up and read line by line, or a rejection with its reason and code. It
 * loops over four examples, one lead and three rejections, each stopping at the rule it fails, so
 * the later rules show as skipped. The server renders the finished lead; it plays under the page's
 * autoplay rules (useAutoplay). Illustration only: the screen is aria-hidden, a sentence describes it.
 */

type RuleCode = 'low_resolution_confidence' | 'country_out_of_market' | 'stale_signal' | 'own_industry' | 'staffing_firm' | 'shell_or_spv';

/** The rules in the order they run, each the pass side of a reject reason the product records. */
const RULES: readonly { code: RuleCode; label: string; icon: Icons.LucideIcon }[] = [
  { code: 'low_resolution_confidence', label: 'Matched to one company', icon: Icons.Building2 },
  { code: 'country_out_of_market', label: 'In your markets', icon: Icons.Globe },
  { code: 'stale_signal', label: 'Inside the freshness window', icon: Icons.Clock },
  { code: 'own_industry', label: 'Not in your own industry', icon: Icons.Factory },
  { code: 'staffing_firm', label: 'Not a staffing firm', icon: Icons.Users },
  { code: 'shell_or_spv', label: 'Not a shell or holding vehicle', icon: Icons.Shield },
];

interface Case {
  id: string;
  signal: string;
  company: string;
  source: string;
  date: string;
  fails?: RuleCode;
}

// Kinds of companies only, never real ones. The lead is the page's example lead.
const CASES: readonly Case[] = [
  {
    id: 'lead',
    signal: 'secured-loan',
    company: EXAMPLE_LEAD.descriptor,
    source: EXAMPLE_LEAD.evidence.source ?? 'UK Companies House',
    date: EXAMPLE_LEAD.evidence.happenedOn ?? '',
  },
  { id: 'staffing', signal: 'tender-award', company: 'A recruitment agency, Yorkshire, UK', source: 'Find a Tender', date: '1 Oct 2026', fails: 'staffing_firm' },
  { id: 'stale', signal: 'new-leader', company: 'A logistics firm, Kent, UK', source: 'UK Companies House', date: '21 Jul 2026', fails: 'stale_signal' },
  { id: 'shell', signal: 'funding-round', company: 'A holding vehicle with no trading activity', source: 'SEC EDGAR', date: '2 Oct 2026', fails: 'shell_or_spv' },
];

const SIGNAL_ICON: Record<string, Icons.LucideIcon> = {
  'secured-loan': Icons.Database,
  'tender-award': Icons.CircleCheck,
  'new-leader': Icons.UserRound,
  'funding-round': Icons.ChartLine,
};

const signalName = (id: string) => SIGNAL_TYPES.find((signal) => signal.id === id)?.name ?? id;
const reasonFor = (code: RuleCode) => REJECT_EXAMPLES.find((reason) => reason.code === code)?.label ?? code;
const ruleFor = (code: RuleCode) => RULES.find((rule) => rule.code === code)?.label ?? code;

/** How many rules a case runs: all of them, or up to and including the one it fails. */
const ruleCount = (item: Case) => (item.fails === undefined ? RULES.length : RULES.findIndex((rule) => rule.code === item.fails) + 1);

export const EVIDENCE_STORY_DESCRIPTION = `Illustration, playing on a loop: each event is checked against ${RULES.length} rules in turn. A secured loan passes them all and becomes a lead scored ${EXAMPLE_SCORE.text} of ${EXAMPLE_SCORE.max}, line by line. A contract won by a staffing firm, a director appointment older than the freshness window and a funding filing by a holding vehicle are each rejected at the rule they fail, and keep that reason.`;

const EASE = [0.22, 1, 0.36, 1] as const;

// The clock. Step 0 the event arrives; step n (1..count) checks rule n - 1; step count + 1 is the
// decision. How long each holds (ms):
const ARRIVE = 600;
const CHECK = 280;
const DECIDED = 2600;

interface State {
  index: number;
  step: number;
  leads: number;
  rejected: number;
}

const FIRST: Case = CASES[0] ?? { id: 'none', signal: '', company: '', source: '', date: '' };
const caseAt = (index: number) => CASES[index] ?? FIRST;

const INITIAL: State = { index: 0, step: ruleCount(FIRST) + 1, leads: 1, rejected: 3 };

/** Where the loop starts when it first comes into view: the first case, arriving, no rule run yet. */
const RESTART: State = { ...INITIAL, index: 0, step: 0 };

type Action = 'advance' | 'restart';

const reduce = (state: State, action: Action): State => (action === 'restart' ? RESTART : advance(state));

function advance(state: State): State {
  const count = ruleCount(caseAt(state.index));
  if (state.step > count) return { ...state, index: (state.index + 1) % CASES.length, step: 0 };
  if (state.step < count) return { ...state, step: state.step + 1 };
  const lead = caseAt(state.index).fails === undefined;
  return { ...state, step: state.step + 1, leads: state.leads + (lead ? 1 : 0), rejected: state.rejected + (lead ? 0 : 1) };
}

type RuleState = 'pending' | 'checking' | 'pass' | 'fail' | 'skipped';

function ruleState(item: Case, step: number, rule: number): RuleState {
  const count = ruleCount(item);
  if (rule >= count) return step > count ? 'skipped' : 'pending';
  if (rule < step - 1) return RULES[rule]?.code === item.fails ? 'fail' : 'pass';
  return rule === step - 1 ? 'checking' : 'pending';
}

function RuleMark({ state }: { state: RuleState }) {
  switch (state) {
    case 'checking':
      return <Icons.LoaderCircle className="size-3.5 text-primary motion-safe:animate-spin" />;
    case 'pass':
      return <Icons.Check className="size-3.5 text-success" strokeWidth={2.75} />;
    case 'fail':
      return <Icons.X className="size-3.5 text-destructive" strokeWidth={2.75} />;
    case 'skipped':
      return <span className="text-[10px] text-muted-foreground">Skipped</span>;
    default:
      return <span className="size-3 rounded-full border-[1.5px] border-border" />;
  }
}

/** A swap of one case's content for the next: the old one lifts out, the new one rises in. */
function Swap({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** The score, counted up from zero when it lands (shown as is on the server and without motion). */
function Score({ value, count }: { value: number; count: boolean }) {
  const shown = useMotionValue(value);
  const text = useTransform(shown, (latest) => Math.round(latest).toString());
  useEffect(() => {
    if (!count) return;
    const run = animate(shown, value, { from: 0, duration: 0.9, ease: EASE });
    return () => run.stop();
  }, [count, value, shown]);
  return <motion.span>{text}</motion.span>;
}

function LeadResult({ animated }: { animated: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
          <Icons.CircleCheck className="size-4 text-primary" />
          Lead
        </p>
        <p className="flex items-baseline gap-1">
          <span className="text-3xl leading-none font-medium tracking-[-0.02em] text-foreground tabular-nums">
            <Score value={EXAMPLE_SCORE.total} count={animated} />
          </span>
          <span className="text-xs text-muted-foreground">of {EXAMPLE_SCORE.max}</span>
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {EXAMPLE_SCORE.lines.map((line, index) => (
          <li key={line.id} className="grid grid-cols-[5.25rem_minmax(0,1fr)_4.25rem] items-center gap-2.5 text-[11.5px]">
            <span className="text-foreground">{line.label}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-progress-track">
              <motion.span
                className="block h-full origin-left rounded-full bg-primary"
                initial={animated ? { scaleX: 0 } : false}
                animate={{ scaleX: line.points / line.max }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.12, ease: EASE }}
              />
            </span>
            <span className="text-right font-mono text-[10.5px] whitespace-nowrap text-muted-foreground tabular-nums">
              {line.points} of {line.max}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-1 flex items-center gap-1.5 border-t pt-3 text-[11px] text-muted-foreground">
        <Icons.FileText className="size-3.5 shrink-0" />
        <span className="truncate text-foreground">{EXAMPLE_LEAD.evidence.title}</span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-primary">
          Source
          <Icons.ExternalLink className="size-3" />
        </span>
      </p>
    </div>
  );
}

function RejectResult({ code }: { code: RuleCode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
          <Icons.Ban className="size-4 text-muted-foreground" />
          Rejected
        </p>
        <span className="font-mono text-[10.5px] text-muted-foreground">{code}</span>
      </div>
      <p className="text-lg leading-snug font-medium text-foreground">{reasonFor(code)}</p>
      <p className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <Icons.X className="size-3.5 text-destructive" strokeWidth={2.75} />
        Failed: {ruleFor(code)}
      </p>
      <p className="mt-1 flex items-center gap-1.5 border-t pt-3 text-[11px] text-muted-foreground">
        <Icons.Inbox className="size-3.5 shrink-0" />
        Kept, not contacted. The reason stays on the record.
      </p>
    </div>
  );
}

export function EvidenceStory() {
  const [state, dispatch] = useReducer(reduce, INITIAL);
  const { ref, animated, running, started, paused, togglePaused } = useAutoplay<HTMLDivElement>();

  // The first time it comes into view, the loop starts over, so it runs from the beginning in view.
  useEffect(() => {
    if (started) dispatch('restart');
  }, [started]);
  const item = caseAt(state.index);
  const count = ruleCount(item);
  const decided = state.step > count;
  const checked = Math.min(Math.max(state.step - 1, 0), count);
  const SignalIcon = SIGNAL_ICON[item.signal] ?? Icons.Radar;

  useEffect(() => {
    if (!running) return;
    const delay = state.step === 0 ? ARRIVE : state.step > count ? DECIDED : CHECK;
    const timer = window.setTimeout(() => dispatch('advance'), delay);
    return () => window.clearTimeout(timer);
  }, [running, state, count]);

  return (
    <div ref={ref}>
      <p className="sr-only">{EVIDENCE_STORY_DESCRIPTION}</p>
      <div className="flex h-10 items-center justify-between gap-3 border-b pr-1 pl-3 sm:pl-4">
        <p aria-hidden="true" className="flex min-w-0 items-center gap-1.5 text-xs">
          <Icons.ListChecks className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="hidden text-muted-foreground sm:inline">Leads</span>
          <Icons.ChevronRight className="hidden size-3 text-muted-foreground sm:block" />
          <span className="truncate font-medium text-foreground">Rules and scoring</span>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <p aria-hidden="true" className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Icons.CircleCheck className="size-3.5 text-primary" />
              Leads <span className="font-medium text-foreground tabular-nums">{state.leads}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Icons.Ban className="size-3.5" />
              Rejected <span className="font-medium text-foreground tabular-nums">{state.rejected}</span>
            </span>
          </p>
          {animated && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={togglePaused}
              aria-label={paused ? 'Play the example scoring' : 'Pause the example scoring'}
              className="size-7 rounded-lg text-muted-foreground [&_svg]:size-3.5"
            >
              {paused ? <Icons.Play aria-hidden="true" /> : <Icons.Pause aria-hidden="true" />}
            </Button>
          )}
        </div>
      </div>
      <div aria-hidden="true" className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-3 border-b bg-muted/40 p-3 sm:border-r sm:border-b-0 sm:p-4">
          <div className="flex items-center justify-between text-[10.5px] font-medium tracking-wide text-muted-foreground uppercase">
            <span>Checking</span>
            <span className="normal-case tabular-nums">
              {checked} of {RULES.length} rules
            </span>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-card">
            <Swap id={item.id} className="flex flex-col gap-1.5 p-3">
              <p className="flex items-center gap-2 text-[12.5px] font-medium text-foreground">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-selected text-primary">
                  <SignalIcon className="size-3.5" />
                </span>
                <span className="truncate">{signalName(item.signal)}</span>
              </p>
              <p className="truncate text-[11.5px] text-muted-foreground">{item.company}</p>
              <p className="flex items-center gap-3 font-mono text-[10.5px] text-muted-foreground">
                <span className="inline-flex min-w-0 items-center gap-1">
                  <Icons.Building2 className="size-3 shrink-0" />
                  <span className="truncate">{item.source}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Icons.CalendarCheck className="size-3" />
                  {item.date}
                </span>
              </p>
            </Swap>
          </div>
          <ul className="flex flex-col">
            {RULES.map((rule, index) => {
              const status = ruleState(item, state.step, index);
              const Icon = rule.icon;
              return (
                <li
                  key={rule.code}
                  className={cn(
                    'flex h-7 items-center gap-2 rounded-md px-2 text-[12px] transition-colors duration-300',
                    status === 'fail' && 'bg-critical-soft',
                    status === 'checking' && 'bg-selected',
                  )}
                >
                  <Icon className={cn('size-3.5 shrink-0', status === 'pending' || status === 'skipped' ? 'text-muted-foreground/60' : 'text-muted-foreground')} />
                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate',
                      status === 'pending' || status === 'skipped' ? 'text-muted-foreground' : 'text-foreground',
                      status === 'fail' && 'font-medium',
                    )}
                  >
                    {rule.label}
                  </span>
                  <span className="inline-flex w-12 shrink-0 justify-end">
                    <RuleMark state={status} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative flex min-h-64 flex-col gap-3 p-3 sm:p-4">
          <div className="flex items-center justify-between text-[10.5px] font-medium tracking-wide text-muted-foreground uppercase">
            <span>Result</span>
            <span className="normal-case">{decided ? (item.fails === undefined ? 'Scored' : 'Decided') : 'Waiting for the rules'}</span>
          </div>
          <AnimatePresence initial={false} mode="wait">
            {decided ? (
              <motion.div
                key={`result-${item.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {item.fails === undefined ? <LeadResult animated={animated} /> : <RejectResult code={item.fails} />}
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col items-center justify-center gap-2 text-[11.5px] text-muted-foreground"
              >
                <Icons.ScanSearch className="size-5 motion-safe:animate-pulse" />
                Scored only if every rule passes
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
