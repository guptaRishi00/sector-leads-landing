'use client';

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@sl/ui';

type Autoplay = 'off' | 'on';

/**
 * WAI-ARIA tabs with roving focus (Arrow keys, Home, End). The panels are rendered on the server
 * and all stay in the HTML; only which one is visible is client state. `vertical` stacks the tabs
 * in a column from `lg` (arrow Up/Down) and scrolls them sideways below it.
 *
 * `autoAdvance` (ms) moves to the next tab on its own. The active tab's progress is the timer: a
 * Web Animation draws it (vertical tabs: a border tracing round the tab, clockwise from its top
 * left; horizontal tabs: a bar) and the next tab opens when it completes, so pausing it pauses the
 * rotation. It holds while keyboard focus is in the panel (not on hover: resting the pointer on the
 * panel while reading must not freeze it), while the tabs are off screen and while the page is
 * hidden; choosing a tab stops it for good; reduced motion never starts it. There is no pause
 * button (removed at the user's request).
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
  const [holds, setHolds] = useState({ focus: false, offscreen: true, hidden: false });
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const bars = useRef<(Element | null)[]>([]);
  const timer = useRef<Animation | null>(null);
  const base = useId();
  const held = holds.focus || holds.offscreen || holds.hidden;
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
    // Observed at 0 and at 25%: it counts as on screen from 25% visible, and as off screen only once
    // fully gone (a single threshold never reports leaving below it).
    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        setHolds((value) => ({ ...value, offscreen: value.offscreen ? ratio < 0.24 : ratio === 0 }));
      },
      { threshold: [0, 0.25] },
    );
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
    const keyframes = vertical ? [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }] : [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }];
    const fill = bar.animate(keyframes, { duration: autoAdvance, fill: 'forwards' });
    // `finished` settles as soon as the fill ends, even before the next frame; cancelling (a new
    // step, a stop, unmount) rejects it, which is expected and ignored.
    fill.finished.then(() => setActive((index) => (index + 1) % tabs.length)).catch(() => undefined);
    if (!runningRef.current) fill.pause();
    timer.current = fill;
    return () => fill.cancel();
  }, [active, autoplay, autoAdvance, tabs.length, vertical]);

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
                    ? cn(
                        'rounded-lg px-3 py-2 text-left lg:whitespace-normal',
                        selected ? 'bg-card font-medium text-foreground shadow-xs ring-1 ring-border' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
                      )
                    : cn('snap-start px-3 pt-2 pb-3.5 sm:px-4 lg:flex-1', selected ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'),
                )}
              >
                {tab}
                {/* Horizontal tabs: the active one always carries a soft full-width underline, so it
                    reads as selected even while the progress bar above it is still empty. */}
                {!vertical && (
                  <span
                    aria-hidden="true"
                    className={cn('absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-primary/25 transition-opacity duration-200', selected ? 'opacity-100' : 'opacity-0')}
                  />
                )}
                {/* The progress. Vertical: a border that traces round the tab (an SVG outline on the
                    tab's edge, clipped by its rounded corners to a 1.5px line inside them), shown
                    while it rotates. Horizontal: a bar drawn over the underline, shown in full once
                    stopped. While rotating the timer draws it. */}
                {vertical ? (
                  <svg
                    aria-hidden="true"
                    className={cn('pointer-events-none absolute inset-0 size-full transition-opacity duration-200', selected && autoplay !== 'off' ? 'opacity-100' : 'opacity-0')}
                  >
                    <rect
                      ref={(node) => {
                        bars.current[index] = node;
                      }}
                      width="100%"
                      height="100%"
                      rx="8"
                      pathLength={1}
                      fill="none"
                      strokeWidth={3}
                      strokeDasharray="1 1"
                      strokeDashoffset={1}
                      className="stroke-primary"
                    />
                  </svg>
                ) : (
                  <span
                    aria-hidden="true"
                    ref={(node) => {
                      bars.current[index] = node;
                    }}
                    className={cn('absolute inset-x-4 bottom-0 h-0.5 origin-left rounded-full bg-primary transition-opacity duration-200', selected ? 'opacity-100' : 'opacity-0')}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className={cn(vertical && 'lg:h-full')} onFocus={() => setHolds((value) => ({ ...value, focus: true }))} onBlur={onPanelBlur}>
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
