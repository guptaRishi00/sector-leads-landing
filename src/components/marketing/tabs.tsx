'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@sl/ui';

/**
 * WAI-ARIA tabs with roving focus (Arrow keys, Home, End). The panels are rendered on the server
 * and all stay in the HTML; only which one is visible is client state. `vertical` stacks the tabs
 * in a column from `lg` (arrow Up/Down) and scrolls them sideways below it.
 */
export function Tabs({
  label,
  tabs,
  panels,
  vertical = false,
  className,
}: {
  label: string;
  tabs: readonly ReactNode[];
  panels: readonly ReactNode[];
  vertical?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  const focus = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
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

  return (
    <div className={cn(vertical && 'grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-8', className)}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        // Below lg the strip scrolls sideways: the right-edge fade says so, and the trailing padding
        // lets the last tab scroll clear of it.
        className={cn(
          'flex gap-1 overflow-x-auto [scrollbar-width:none] max-lg:pr-12 max-lg:[mask-image:linear-gradient(to_right,black_85%,transparent)]',
          vertical ? 'lg:flex-col lg:self-start lg:overflow-visible' : 'snap-x border-b',
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
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'relative shrink-0 text-sm whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring',
                vertical
                  ? cn('rounded-lg px-3 py-2 text-left lg:whitespace-normal', selected ? 'bg-card font-medium text-foreground shadow-xs ring-1 ring-border' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground')
                  : cn('flex-1 snap-start px-4 pt-2 pb-3.5', selected ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'),
              )}
            >
              {tab}
              {!vertical && (
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-primary transition-opacity duration-200', selected ? 'opacity-100' : 'opacity-0')}
                />
              )}
            </button>
          );
        })}
      </div>
      {panels.map((panel, index) => (
        <div
          key={index}
          id={`${base}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${index}`}
          hidden={index !== active}
          className={cn(vertical ? 'lg:h-full' : 'mt-8', 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 duration-500')}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
