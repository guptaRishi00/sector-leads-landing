'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@sl/ui';

/**
 * Attio's chapter rail: a sticky list of the steps on the left (from lg) that follows the reader
 * down the stacked step blocks on the right. The block nearest the middle of the viewport is the
 * active one (IntersectionObserver on `[data-step]` children); the highlight slides between items
 * with a Framer Motion layout animation. Each item is a plain anchor to its block, so it works
 * without JavaScript and Lenis glides to it. Below lg the rail is hidden and the blocks just stack.
 */
export function StepRail({ label, items, children }: { label: string; items: readonly { id: string; title: string }[]; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const blocks = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = blocks.current;
    if (scope === null) return;
    const steps = [...scope.querySelectorAll<HTMLElement>('[data-step]')];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(steps.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const step of steps) observer.observe(step);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
      <nav aria-label={label} className="hidden lg:block">
        <ol className="sticky top-28 flex flex-col">
          {items.map((item, index) => {
            const current = index === active;
            return (
              <li key={item.id}>
                <a
                  href={`#step-${item.id}`}
                  aria-current={current ? 'step' : undefined}
                  className={cn(
                    'relative isolate flex items-center gap-3 rounded-[10px] px-3.5 py-3 text-sm font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring',
                    current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {current && (
                    <motion.span
                      layoutId={`${label}-active`}
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-[10px] bg-card shadow-xs ring-1 ring-border"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  {item.title}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
      <div ref={blocks} className="isolate flex min-w-0 flex-col gap-20 sm:gap-28">
        {children}
      </div>
    </div>
  );
}
