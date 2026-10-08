'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@sl/ui';

export interface StepCard {
  id: string;
  /** The short name on a closed card. */
  short: string;
  /** The step's sentence, on the open card and as the panel's heading. */
  title: string;
  body: string;
  icon: ReactNode;
}

/**
 * How it works, as Leadistry's "Five screens" row (from lg): the steps as a row of cards, the
 * chosen one widening (flex-grow) to show its sentence and body, and that step's view shown full
 * width under the row. The cards are buttons that show a panel (aria-controls, aria-current); the
 * panels are server-rendered, the others hidden from lg, so a hidden view's own loop pauses (it's
 * off screen). Below lg the row is hidden and the steps simply stack, each with its heading.
 */
export function StepCards({ label, steps, views }: { label: string; steps: readonly StepCard[]; views: readonly ReactNode[] }) {
  const [active, setActive] = useState(0);
  // The settle-in animations play only once the visitor picks a card (so nothing animates off screen on load).
  const [picked, setPicked] = useState(false);
  return (
    <div className="flex flex-col gap-20 lg:gap-8">
      <div role="group" aria-label={label} className="hidden gap-3 lg:flex">
        {steps.map((step, index) => {
          const current = index === active;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setActive(index);
                setPicked(true);
              }}
              aria-controls={`step-${step.id}`}
              aria-current={current ? 'step' : undefined}
              className={cn(
                'flex h-56 min-w-0 basis-0 flex-col justify-between overflow-hidden rounded-xl border p-5 text-left transition-[flex-grow,border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring motion-reduce:transition-none',
                current
                  ? 'grow-[2.6] border-primary/40 bg-card shadow-[0_1px_2px_var(--shadow-color),0_18px_40px_-20px_var(--shadow-color)]'
                  : 'grow bg-muted/70 hover:border-control/40 hover:bg-muted',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border',
                  current ? 'border-primary/30 bg-selected text-primary' : 'bg-card text-muted-foreground',
                )}
              >
                {step.icon}
              </span>
              <span className="flex min-w-0 flex-col gap-2">
                <span className={cn('font-display text-[17px] leading-snug font-medium text-foreground', !current && 'line-clamp-2')}>{current ? step.title : step.short}</span>
                {current && (
                  <span className={cn('line-clamp-4 text-sm leading-6 text-pretty text-muted-foreground', picked && 'motion-safe:animate-[step-in_0.5s_ease-out_both]')}>
                    {step.body}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {views.map((view, index) => {
        const step = steps[index];
        if (step === undefined) return null;
        return (
          <section
            key={step.id}
            id={`step-${step.id}`}
            aria-labelledby={`step-${step.id}-title`}
            className={cn('scroll-mt-28', index !== active ? 'lg:hidden' : picked && 'lg:motion-safe:animate-[step-in_0.45s_ease-out_both]')}
          >
            {/* Below lg each step carries its own heading; from lg the open card shows it, so it's for screen readers only. */}
            <div className="mb-7 flex max-w-2xl flex-col gap-4 lg:sr-only">
              <span aria-hidden="true" className="text-muted-foreground [&_svg]:-ml-0.5 [&_svg]:size-5">
                {step.icon}
              </span>
              <h3
                id={`step-${step.id}-title`}
                className="font-display text-[1.375rem] leading-[1.25] font-medium tracking-[-0.01em] text-balance sm:text-[1.75rem] sm:leading-[1.2]"
              >
                <span className="text-foreground">{step.title}</span>
                <span className="text-muted-foreground"> {step.body}</span>
              </h3>
            </div>
            {view}
          </section>
        );
      })}
    </div>
  );
}
