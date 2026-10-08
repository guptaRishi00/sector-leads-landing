'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BarChart } from './tremor-bar-chart';
import { usePrefersReducedMotion } from './use-autoplay';

/**
 * Send overview, drawn with Tremor's bar chart: each day's sends, stacked over the ones a gate held,
 * with no axis values. It mounts when it first comes into view, so the bars grow then; under reduced
 * motion it appears at once. The server renders the empty frame either way, so hydration matches.
 * Illustration only (the caller hides it from assistive tech).
 */
export function SendChart({ data, className }: { data: readonly { day: string; Sent: number; Held: number }[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = usePrefersReducedMotion();
  return (
    <div ref={ref} className={className}>
      {reduce || inView ? (
        <BarChart
          data={data}
          index="day"
          categories={['Sent', 'Held']}
          colors={['primary', 'muted']}
          type="stacked"
          showXAxis={false}
          showYAxis={false}
          barCategoryGap="22%"
          animate={!reduce}
          className="h-full"
        />
      ) : null}
    </div>
  );
}
