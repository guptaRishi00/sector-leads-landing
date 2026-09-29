'use client';

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Button, Icons, cn } from '@sl/ui';

type Autoplay = 'off' | 'on' | 'paused';

/**
 * WAI-ARIA tabs with roving focus (Arrow keys, Home, End). The panels are rendered on the server
 * and all stay in the HTML; only which one is visible is client state. `vertical` stacks the tabs
 * in a column from `lg` (arrow Up/Down) and scrolls them sideways below it.
 *
 * `autoAdvance` (ms) moves to the next tab on its own. The active tab's progress bar is the timer:
 * a Web Animation fills it and the next tab opens when it finishes, so pausing the bar pauses the
 * rotation. It holds while the pointer or focus is on the panel, while the tabs are off screen and
 * while the page is hidden; the button pauses it (WCAG 2.2.2); choosing a tab stops it for good;
 * reduced motion never starts it.
 */
export function Tabs({
  label,
  tabs,
  panels,
  vertical = false,
  autoAdvance,
  className,
}: {
  label: string;
  tabs: readonly ReactNode[];
  panels: readonly ReactNode[];
  vertical?: boolean;
  autoAdvance?: number;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState<Autoplay>('off');
  const [holds, setHolds] = useState({ pointer: false, focus: false, offscreen: true, hidden: false });
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const timer = useRef<Animation | null>(null);
  const base = useId();
  const held = holds.pointer || holds.focus || holds.offscreen || holds.hidden;
  const running = autoplay === 'on' && !held;
  const runningRef = useRef(running);
  runningRef.current = running;

  // Start on the client only, and never under reduced motion.
  useEffect(() => {
    if (autoAdvance === undefined || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAutoplay('on');
  }, [autoAdvance]);

  // Hold while off screen or while the page is hidden.
  useEffect(() => {
    if (autoplay === 'off' || root.current === null) return;
    const observer = new IntersectionObserver(([entry]) => setHolds((value) => ({ ...value, offscreen: entry?.isIntersecting !== true })), { threshold: 0.25 });
    observer.observe(root.current);
    const onVisibility = () => setHolds((value) => ({ ...value, hidden: document.hidden }));
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [autoplay]);

  // One fill of the active tab's bar per step; finishing it opens the next tab.
  useEffect(() => {
    const bar = bars.current[active];
    if (autoplay === 'off' || autoAdvance === undefined || bar === undefined || bar === null) return;
    const fill = bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: autoAdvance, fill: 'forwards' });
    // `finished` settles as soon as the fill ends, even before the next frame; cancelling (a new
    // step, a stop, unmount) rejects it, which is expected and ignored.
    fill.finished.then(() => setActive((index) => (index + 1) % tabs.length)).catch(() => undefined);
    if (!runningRef.current) fill.pause();
    timer.current = fill;
    return () => fill.cancel();
  }, [active, autoplay, autoAdvance, tabs.length]);

  useEffect(() => {
    if (running) timer.current?.play();
    else timer.current?.pause();
  }, [running]);

  // Keep the active tab in view in a sideways-scrolling strip, without scrolling the page.
  useEffect(() => {
    const strip = list.current;
    const tab = refs.current[active];
    if (autoplay === 'off' || strip === null || tab === undefined || tab === null || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: 'smooth' });
  }, [active, autoplay]);

  const choose = (index: number) => {
    setAutoplay('off');
    setActive((index + tabs.length) % tabs.length);
  };

  const focus = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    choose(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const move = moves[event.key];
    if (move !== undefined) {
      event.preventDefault();
      focus(move);
    }
  };

  const onPanelBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHolds((value) => ({ ...value, focus: false }));
  };

  return (
    <div ref={root} className={cn(vertical && 'grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-8', className)}>
      <div className={cn('flex min-w-0 items-center gap-2', vertical ? 'lg:flex-col lg:items-stretch lg:gap-3 lg:self-start' : 'border-b')}>
        <div
          ref={list}
          role="tablist"
          aria-label={label}
          aria-orientation={vertical ? 'vertical' : 'horizontal'}
          // Below lg the strip scrolls sideways: the right-edge fade says so, and the trailing
          // padding lets the last tab scroll clear of it.
          className={cn(
            'flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] max-lg:pr-12 max-lg:[mask-image:linear-gradient(to_right,black_85%,transparent)]',
            vertical ? 'lg:flex-col lg:overflow-visible' : 'snap-x',
          )}
        >
          {tabs.map((tab, index) => {
            const selected = index === active;
            return (
              <button
                key={index}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                id={`${base}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${base}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  'relative shrink-0 overflow-hidden text-sm whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring',
                  vertical
                    ? cn('rounded-lg px-3 py-2 text-left lg:whitespace-normal', selected ? 'bg-card font-medium text-foreground shadow-xs ring-1 ring-border' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground')
                    : cn('snap-start px-3 pt-2 pb-3.5 sm:px-4 lg:flex-1', selected ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'),
                )}
              >
                {tab}
                {/* The underline (horizontal) or bottom bar (vertical). While rotating it is the
                    progress bar, filled by the timer; once stopped it is simply shown in full. */}
                <span
                  aria-hidden="true"
                  ref={(node) => {
                    bars.current[index] = node;
                  }}
                  className={cn(
                    'absolute h-0.5 origin-left rounded-full bg-primary transition-opacity duration-200',
                    vertical ? 'inset-x-3 bottom-0.5' : 'inset-x-4 bottom-0',
                    selected && (!vertical || autoplay !== 'off') ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </button>
            );
          })}
        </div>
        {autoplay !== 'off' && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setAutoplay(autoplay === 'on' ? 'paused' : 'on')}
            aria-label={autoplay === 'on' ? `Pause: ${label} changes on its own` : `Play: let ${label} change on its own`}
            className={cn('shrink-0 text-muted-foreground', vertical ? 'lg:self-start' : 'mb-1.5')}
          >
            {autoplay === 'on' ? <Icons.Pause aria-hidden="true" /> : <Icons.Play aria-hidden="true" />}
          </Button>
        )}
      </div>
      <div
        className={cn(vertical && 'lg:h-full')}
        onMouseEnter={() => setHolds((value) => ({ ...value, pointer: true }))}
        onMouseLeave={() => setHolds((value) => ({ ...value, pointer: false }))}
        onFocus={() => setHolds((value) => ({ ...value, focus: true }))}
        onBlur={onPanelBlur}
      >
        {panels.map((panel, index) => (
          <div
            key={index}
            id={`${base}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${index}`}
            hidden={index !== active}
            className={cn(vertical ? 'lg:h-full' : 'mt-5 sm:mt-8', 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 duration-500')}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
