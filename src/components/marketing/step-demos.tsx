'use client';

import type { ReactNode } from 'react';
import { cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, EXAMPLE_SCORE, REJECT_EXAMPLES, SEND_GATES, SIGNAL_TYPES } from '@/lib/marketing/content';

/*
 * The five hand-coded demos in How it works, one per step, set as the video's translucent app window
 * floating on the step's picture. Each is a pure function of `tick` (0 → its LENGTH), which the
 * showcase advances every TICK_MS while the demo is in view; LENGTH is its finished frame (what the
 * server renders, and all reduced motion shows). Content comes from the page's own example data;
 * companies are kinds, never real ones. Illustrations only (the caller hides them from assistive tech).
 */

export type DemoId = 'signal' | 'evidence' | 'contact' | 'draft' | 'send';

/** The window: frosted card, a hairline, a soft drop onto the picture. */
function DemoWindow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-card/60 bg-card/85 text-foreground shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--foreground)_40%,transparent)] backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  );
}

const Spinner = ({ className }: { className?: string }) => <Icons.LoaderCircle className={cn('size-3 shrink-0 text-muted-foreground motion-safe:animate-spin', className)} />;

/** A small status chip, as the video's "Writing" / "Draft ready". */
function Chip({ tone = 'muted', children }: { tone?: 'muted' | 'accent' | 'success' | 'wait'; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1 rounded-md px-1.5 text-[10.5px] font-medium whitespace-nowrap',
        tone === 'muted' && 'bg-muted text-muted-foreground',
        tone === 'accent' && 'bg-selected text-primary',
        tone === 'success' && 'bg-success-soft text-success',
        tone === 'wait' && 'bg-highlight-soft text-highlight-foreground',
      )}
    >
      {children}
    </span>
  );
}

const Tile = ({ letter, tone }: { letter: string; tone: string }) => (
  <span className={cn('inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold', tone)}>{letter}</span>
);

const TONES = [
  'bg-primary text-primary-foreground',
  'bg-success text-primary-foreground',
  'bg-warning text-primary-foreground',
  'bg-foreground text-background',
  'bg-highlight text-primary-foreground',
];

const signal = (id: string) => SIGNAL_TYPES.find((item) => item.id === id);

/* 1. A dated event happens: the public record read, events found and dated. ------------------------- */

const EVENTS = [
  { id: 'tender-notice', date: '29 Sep' },
  { id: 'secured-loan', date: '30 Sep' },
  { id: 'new-leader', date: '1 Oct' },
  { id: 'tender-award', date: '2 Oct' },
].flatMap(({ id, date }) => {
  const item = signal(id);
  return item === undefined ? [] : [{ ...item, date, source: item.sources.split(', ')[0] ?? item.sources }];
});

function SignalDemo({ tick }: { tick: number }) {
  const total = 120;
  const read = Math.min(total, 18 + tick * 13);
  const done = tick >= SIGNAL_LENGTH;
  const dated = EVENTS.filter((_, index) => tick > index + 2).length;
  return (
    <DemoWindow>
      <div className="flex items-center justify-between gap-3 px-3.5 pt-3">
        <p className="flex items-center gap-2 text-[12.5px] font-medium">
          <Icons.Building2 className="size-3.5 text-muted-foreground" />
          Public record <span className="font-normal text-muted-foreground">· today</span>
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {done ? <Icons.Check className="size-3 text-success" strokeWidth={2.5} /> : <Spinner />}
          Read {read} of {total}
        </p>
      </div>
      <div className="mx-3.5 mt-2.5 h-0.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-success transition-[width] duration-500" style={{ width: `${(read / total) * 100}%` }} />
      </div>
      <ul className="flex flex-1 flex-col gap-1.5 overflow-hidden p-3">
        {EVENTS.map((event, index) =>
          tick > index ? (
            <li key={event.id} className="flex items-center gap-2.5 rounded-lg border bg-card px-2.5 py-1.5 motion-safe:animate-[step-in_0.4s_ease-out_both]">
              <Tile letter={event.source.charAt(0)} tone={TONES[index % TONES.length] ?? ''} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[12px] font-medium">{event.name}</span>
                <span className="truncate text-[10.5px] text-muted-foreground">{event.example}</span>
              </span>
              <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">{event.date}</span>
              {tick > index + 2 ? (
                <Chip tone="success">
                  <Icons.Check className="size-3" strokeWidth={2.5} />
                  Dated
                </Chip>
              ) : (
                <Chip tone="accent">
                  <Spinner className="text-primary" />
                  Reading
                </Chip>
              )}
            </li>
          ) : null,
        )}
      </ul>
      <p className="flex items-center justify-between gap-3 border-t px-3.5 py-2 text-[10.5px] text-muted-foreground">
        <span>
          <span className="font-medium text-foreground tabular-nums">{dated}</span> dated events found
        </span>
        <span>Each keeps its source and date</span>
      </p>
    </DemoWindow>
  );
}

const SIGNAL_LENGTH = EVENTS.length + 3;

/* 2. It becomes a lead, with evidence: rules decide, the score reads line by line. ------------------- */

const CHECKED = [
  { id: 'secured-loan', outcome: 'lead' as const },
  { id: 'tender-award', outcome: 'staffing_firm' },
  { id: 'new-leader', outcome: 'stale_signal' },
  { id: 'funding-round', outcome: 'shell_or_spv' },
].flatMap(({ id, outcome }) => {
  const item = signal(id);
  return item === undefined ? [] : [{ name: item.name, outcome }];
});

function EvidenceDemo({ tick }: { tick: number }) {
  const checked = Math.min(tick, CHECKED.length);
  return (
    <DemoWindow>
      <div className="flex items-center justify-between gap-3 border-b px-3.5 py-2.5">
        <p className="flex items-center gap-2 text-[12.5px] font-medium">
          <Icons.ListChecks className="size-3.5 text-muted-foreground" />
          Rules and scoring
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {checked < CHECKED.length ? <Spinner /> : <Icons.Check className="size-3 text-success" strokeWidth={2.5} />}
          {checked} of {CHECKED.length} checked
        </p>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ul className="flex flex-col gap-1.5 p-3">
          {CHECKED.map((row, index) => {
            const reason = REJECT_EXAMPLES.find((item) => item.code === row.outcome);
            return (
              <li key={row.name} className="flex items-center justify-between gap-2 rounded-lg border bg-card px-2.5 py-1.5">
                <span className="truncate text-[12px] font-medium">{row.name}</span>
                {tick <= index ? (
                  <Chip>
                    <Spinner />
                    Checking
                  </Chip>
                ) : row.outcome === 'lead' ? (
                  <Chip tone="accent">Lead · {EXAMPLE_SCORE.text}</Chip>
                ) : (
                  <Chip>
                    <Icons.Ban className="size-3" />
                    {reason?.label ?? row.outcome}
                  </Chip>
                )}
              </li>
            );
          })}
        </ul>
        <div className="hidden flex-col gap-2 border-l p-3 sm:flex">
          <p className="flex items-baseline justify-between text-[12px] font-medium">
            Why it scored
            <span className="text-[18px] leading-none tabular-nums">
              {tick > 1 ? EXAMPLE_SCORE.text : '—'}
              <span className="text-[10.5px] font-normal text-muted-foreground"> of {EXAMPLE_SCORE.max}</span>
            </span>
          </p>
          {EXAMPLE_SCORE.lines.map((line, index) => (
            <div key={line.id} className="flex flex-col gap-1">
              <span className="flex justify-between text-[10.5px]">
                {line.label}
                <span className="font-mono text-muted-foreground">
                  {line.points} of {line.max}
                </span>
              </span>
              <span className="h-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary transition-[width] duration-700"
                  style={{ width: tick > index + 1 ? `${(line.points / line.max) * 100}%` : '0%' }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="border-t px-3.5 py-2 text-[10.5px] text-muted-foreground">
        <span className="font-medium text-foreground">{tick > 0 ? 1 : 0}</span> lead · <span className="font-medium text-foreground">{Math.max(0, checked - 1)}</span> rejected,
        each with its reason
      </p>
    </DemoWindow>
  );
}

const EVIDENCE_LENGTH = EXAMPLE_SCORE.lines.length + 2;

/* 3. You approve, then we find the buyer. --------------------------------------------------------------- */

const REACHABILITY = EXAMPLE_SCORE.lines.find((line) => line.id === 'reachability');

const CONTACT_STEPS = [
  { label: 'Lead approved by a person', detail: 'Nothing moves without you' },
  { label: 'The right person found', detail: REACHABILITY?.why ?? 'Named in the filing' },
  { label: 'Their address verified', detail: 'Verified again before it sends' },
];

function ContactDemo({ tick }: { tick: number }) {
  const approved = tick >= 1;
  return (
    <DemoWindow>
      <div className="flex items-start justify-between gap-3 border-b px-3.5 py-2.5">
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-[12.5px] font-medium">{EXAMPLE_LEAD.descriptor}</p>
          <p className="text-[10.5px] text-muted-foreground">
            {EXAMPLE_LEAD.evidence.trigger} · score {EXAMPLE_SCORE.text}
          </p>
        </div>
        {approved ? (
          <Chip tone="success">
            <Icons.Check className="size-3" strokeWidth={2.5} />
            Approved by you
          </Chip>
        ) : (
          <Chip tone="wait">Waiting for you</Chip>
        )}
      </div>
      <ol className="flex flex-col gap-1.5 p-3">
        {CONTACT_STEPS.map((step, index) => {
          const state = tick > index + 1 ? 'done' : tick === index + 1 ? 'now' : 'next';
          return (
            <li
              key={step.label}
              className={cn('flex items-center gap-2.5 rounded-lg border bg-card px-2.5 py-1.5 transition-opacity duration-300', state === 'next' && 'opacity-50')}
            >
              <span
                className={cn('inline-flex size-5 shrink-0 items-center justify-center rounded-full', state === 'done' ? 'bg-success text-primary-foreground' : 'border bg-card')}
              >
                {state === 'done' ? <Icons.Check className="size-3" strokeWidth={3} /> : state === 'now' ? <Spinner className="text-primary" /> : null}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[12px] font-medium">{step.label}</span>
                <span className="truncate text-[10.5px] text-muted-foreground">{step.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-auto px-3 pb-3">
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-lg border bg-selected/60 px-2.5 py-2 transition-[opacity,transform] duration-500',
            tick > CONTACT_STEPS.length ? 'opacity-100' : 'translate-y-1 opacity-0',
          )}
        >
          <Tile letter="D" tone="bg-primary text-primary-foreground" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[12px] font-medium">Director</span>
            <span className="truncate font-mono text-[10.5px] text-muted-foreground">d••••@company.example</span>
          </span>
          <Chip tone="success">Verified</Chip>
        </div>
      </div>
    </DemoWindow>
  );
}

const CONTACT_LENGTH = CONTACT_STEPS.length + 2;

/* 4. A short draft you approve: the first email typed out, citing the event. --------------------------- */

const CITED = `the new charge your company registered on ${EXAMPLE_LEAD.evidence.happenedOn}`;
const DRAFT_PARTS = ['Hello, I saw ', CITED, '. New finance often means new work, so a short note seemed worth it. Open to a quick call next week?'];
const DRAFT_TEXT = DRAFT_PARTS.join('');

function DraftDemo({ tick }: { tick: number }) {
  const typed = Math.min(DRAFT_TEXT.length, tick * 2);
  const writing = typed < DRAFT_TEXT.length;
  let left = typed;
  const pieces = DRAFT_PARTS.map((part, index) => {
    const shown = part.slice(0, Math.max(0, left));
    left -= part.length;
    return index === 1 && shown.length > 0 ? (
      <mark key={index} className="rounded-sm bg-selected px-0.5 text-foreground">
        {shown}
      </mark>
    ) : (
      <span key={index}>{shown}</span>
    );
  });
  return (
    <DemoWindow>
      <div className="flex items-center justify-between gap-3 border-b px-3.5 py-2.5">
        <p className="flex min-w-0 items-center gap-2 text-[12.5px] font-medium">
          <Icons.Mail className="size-3.5 shrink-0 text-muted-foreground" />
          Draft <span className="truncate font-normal text-muted-foreground">for the engineering manufacturer</span>
        </p>
        {writing ? (
          <Chip tone="accent">
            <Spinner className="text-primary" />
            Writing
          </Chip>
        ) : (
          <Chip tone="success">
            <Icons.Check className="size-3" strokeWidth={2.5} />
            Ready
          </Chip>
        )}
      </div>
      <dl className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-y-1.5 border-b px-3.5 py-2 text-[11.5px]">
        <dt className="text-muted-foreground">To</dt>
        <dd className="flex items-center gap-1.5">
          <Tile letter="D" tone="bg-primary text-primary-foreground" />
          Director
        </dd>
        <dt className="text-muted-foreground">Subject</dt>
        <dd className="truncate font-medium">Your new charge, registered {EXAMPLE_LEAD.evidence.happenedOn}</dd>
      </dl>
      <p className="flex-1 px-3.5 py-2.5 text-[12px] leading-relaxed">
        {pieces}
        {writing && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 bg-foreground motion-safe:animate-pulse" />}
      </p>
      <div className="flex items-center justify-between gap-3 border-t px-3.5 py-2">
        <span className={cn('inline-flex items-center gap-1 text-[10.5px] text-muted-foreground transition-opacity duration-300', writing ? 'opacity-0' : 'opacity-100')}>
          <Icons.FileText className="size-3" />
          Cites {EXAMPLE_LEAD.evidence.title}
        </span>
        <span className="flex gap-1.5">
          <span className="inline-flex h-6 items-center rounded-md border bg-card px-2 text-[11px] font-medium">Edit</span>
          <span
            className={cn(
              'inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium transition-colors duration-300',
              writing ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground',
            )}
          >
            Approve draft
          </span>
        </span>
      </div>
    </DemoWindow>
  );
}

const DRAFT_LENGTH = Math.ceil(DRAFT_TEXT.length / 2) + 4;

/* 5. Sent only through the gates. ------------------------------------------------------------------- */

function SendDemo({ tick }: { tick: number }) {
  const passed = Math.min(Math.max(tick - 1, 0), SEND_GATES.length);
  const sent = passed === SEND_GATES.length && tick > SEND_GATES.length + 1;
  return (
    <DemoWindow>
      <div className="flex items-center justify-between gap-3 border-b px-3.5 py-2.5">
        <p className="flex items-center gap-2 text-[12.5px] font-medium">
          <Icons.ShieldCheck className="size-3.5 text-muted-foreground" />
          Before it sends
        </p>
        <p className="text-[11px] text-muted-foreground tabular-nums">
          {passed} of {SEND_GATES.length} gates
        </p>
      </div>
      <ul className="flex flex-col gap-1 p-3">
        {SEND_GATES.map((gate, index) => {
          const state = index < passed ? 'pass' : index === passed && tick > 0 && !sent ? 'now' : 'next';
          return (
            <li
              key={gate}
              className={cn(
                'flex items-center justify-between gap-2 rounded-lg border bg-card px-2.5 py-1 font-mono text-[11px] transition-opacity duration-300',
                state === 'next' && 'opacity-50',
              )}
            >
              <span className="truncate">{gate}</span>
              {state === 'pass' ? (
                <span className="inline-flex shrink-0 items-center gap-1 text-success">
                  <Icons.Check className="size-3" strokeWidth={2.5} />
                  pass
                </span>
              ) : state === 'now' ? (
                <Spinner className="text-primary" />
              ) : (
                <span className="size-3 shrink-0 rounded-full border" />
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-auto px-3 pb-3">
        <p
          className={cn(
            'flex items-center gap-2 rounded-lg bg-selected px-2.5 py-2 text-[12px] font-medium ring-1 ring-selected-border transition-[opacity,transform] duration-500',
            sent ? 'opacity-100' : 'translate-y-1 opacity-0',
          )}
        >
          <Icons.Send className="size-3.5 text-primary" />
          Sent from your own mailbox
          <span className="ml-auto text-[10.5px] font-normal text-muted-foreground">One fails: the email waits</span>
        </p>
      </div>
    </DemoWindow>
  );
}

const SEND_LENGTH = SEND_GATES.length + 3;

/** Each demo, its finished frame (in ticks) and how long a tick lasts (ms). */
export const DEMOS: Record<DemoId, { Demo: (props: { tick: number }) => ReactNode; length: number; tickMs: number }> = {
  signal: { Demo: SignalDemo, length: SIGNAL_LENGTH, tickMs: 650 },
  evidence: { Demo: EvidenceDemo, length: EVIDENCE_LENGTH, tickMs: 600 },
  contact: { Demo: ContactDemo, length: CONTACT_LENGTH, tickMs: 750 },
  draft: { Demo: DraftDemo, length: DRAFT_LENGTH, tickMs: 45 },
  send: { Demo: SendDemo, length: SEND_LENGTH, tickMs: 380 },
};
