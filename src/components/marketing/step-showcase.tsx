'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cn, Icons } from '@sl/ui';
import { DEMOS, type DemoId } from './step-demos';
import { useAutoplay } from './use-autoplay';

export interface ShowcaseStep {
  id: DemoId;
  /** The short name on the tab. */
  tab: string;
  /** The step's sentence and its explanation, on the card's left. */
  title: string;
  body: string;
  /** What the person asks for, in the dark bubble over the picture. */
  prompt: string;
  /** What the step uses, from the page's own content, under "Uses", each with its icon. */
  uses: readonly { label: string; icon: UseIcon }[];
}

/** The icons the "Uses" chips can carry, by name (a server component passes the name, not the component). */
const USE_ICONS = {
  tender: Icons.Megaphone,
  europe: Icons.Globe,
  government: Icons.Landmark,
  registry: Icons.Building2,
  filings: Icons.ChartLine,
  packs: Icons.Package,
  rules: Icons.ListChecks,
  model: Icons.ScanSearch,
  filing: Icons.FileText,
  verify: Icons.MailCheck,
  event: Icons.CalendarCheck,
  link: Icons.ExternalLink,
  approval: Icons.UserRoundCheck,
  mailbox: Icons.Inbox,
  gates: Icons.ShieldCheck,
} as const;

export type UseIcon = keyof typeof USE_ICONS;

/** The painting behind each step's demo, from public/how-it-works/. There are four for five steps, so the last step reuses the second. */
const IMAGES: Record<DemoId, string> = {
  signal: '/how-it-works/1.webp',
  evidence: '/how-it-works/2.webp',
  contact: '/how-it-works/3.webp',
  draft: '/how-it-works/4.webp',
  send: '/how-it-works/2.webp',
};

/** Plays one demo: its tick counts up to its finished frame while `running`. Remount it (a new key) to replay. */
function DemoPlayer({ id, running, animated }: { id: DemoId; running: boolean; animated: boolean }) {
  const { Demo, length, tickMs } = DEMOS[id];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!running || tick >= length) return;
    const timer = window.setTimeout(() => setTick((value) => value + 1), tickMs);
    return () => window.clearTimeout(timer);
  }, [running, tick, length, tickMs]);
  // The server and reduced motion show the finished frame.
  return <Demo tick={animated ? tick : length} />;
}

/**
 * How it works, as the video's desktop: the steps as a pill tab row, then one card per step: the
 * step in words on the left (its sentence, its explanation, what it uses, and "Replay demo"), and on
 * the right its picture with the request in a dark bubble and a hand-coded demo running in a
 * frosted app window over it. The demo starts when the card is in view (useAutoplay) and replays
 * from the start when the tab changes or "Replay demo" is pressed. WAI-ARIA tabs (Arrow keys, Home,
 * End); the demo itself is an illustration, hidden from assistive tech.
 */
export function StepShowcase({ label, steps }: { label: string; steps: readonly ShowcaseStep[] }) {
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);
  const { ref, running, started, animated } = useAutoplay<HTMLDivElement>();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const step = steps[active] ?? steps[0];
  if (step === undefined) return null;

  const choose = (index: number, focus = false) => {
    const next = (index + steps.length) % steps.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: steps.length - 1 };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    choose(move, true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto [scrollbar-width:none] max-sm:-mx-1 max-sm:px-1">
        {steps.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              id={`${base}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'inline-flex h-9 shrink-0 items-center rounded-[10px] px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring',
                selected ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      <div
        ref={ref}
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${step.id}`}
        className="grid grid-cols-1 overflow-hidden rounded-2xl border bg-card lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
      >
        <div className="flex flex-col p-6 sm:p-8">
          <h3 className="font-display text-[1.375rem] leading-tight font-medium tracking-[-0.01em] text-balance text-foreground sm:text-2xl">{step.title}</h3>
          <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-pretty text-muted-foreground">{step.body}</p>
          <div className="mt-10 flex flex-col gap-3 lg:mt-auto">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] text-muted-foreground">Uses</span>
              <button
                type="button"
                onClick={() => setReplay((value) => value + 1)}
                className="inline-flex items-center gap-1.5 rounded-md text-[12px] font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring"
              >
                <Icons.RotateCcw aria-hidden="true" className="size-3.5" />
                Replay demo
              </button>
            </div>
            <ul className="flex flex-wrap items-center gap-1.5">
              {step.uses.map(({ label, icon }) => {
                const Icon = USE_ICONS[icon];
                return (
                  <li key={label} className="inline-flex h-8 items-center gap-2 rounded-lg border bg-card py-1 pr-2.5 pl-1 text-[12.5px] text-foreground">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-6 items-center justify-center rounded-md bg-linear-to-b from-selected to-selected/40 text-primary ring-1 ring-primary/15 ring-inset"
                    >
                      <Icon className="size-3.5" strokeWidth={1.75} />
                    </span>
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* The picture, the request in a dark bubble, and the demo window floating over it. */}
        <div aria-hidden="true" className="relative min-h-[36rem] overflow-hidden sm:min-h-[33rem]">
          <Image src={IMAGES[step.id]} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          <p className="absolute top-4 right-4 left-4 ml-auto w-fit max-w-[34rem] rounded-lg bg-foreground px-3 py-2 text-[12px] leading-snug font-medium text-background shadow-lg sm:top-5 sm:right-6">
            {step.prompt}
          </p>
          <div className="absolute inset-x-4 top-20 bottom-4 sm:inset-x-8 sm:top-[5.5rem] sm:bottom-6">
            {/* Remounted (a new key) on a tab change, a replay, and its first time in view, so it plays from the start. */}
            <DemoPlayer key={`${step.id}-${replay}-${started ? 'live' : 'still'}`} id={step.id} running={running} animated={animated} />
          </div>
        </div>
      </div>
    </div>
  );
}
