'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { AreaChart } from './tremor-area-chart';
import { usePrefersReducedMotion } from './use-autoplay';

/**
 * Results, drawn with Tremor's area chart: the contacted group (primary) against the holdout
 * (grey), each a gradient area, with no axis values. The chart mounts when it first comes into view,
 * so Recharts' left-to-right draw plays then; under reduced motion it appears without the draw. The
 * server renders the empty frame either way, so hydration matches. Illustration only (the caller
 * hides it from assistive tech).
 */
export function ResultsChart({ data, className }: { data: readonly { week: string; Contacted: number; Holdout: number }[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = usePrefersReducedMotion();
  return (
    <div ref={ref} className={className}>
      {reduce || inView ? (
        <AreaChart
          data={data}
          index="week"
          categories={['Contacted', 'Holdout']}
          colors={['primary', 'muted']}
          showXAxis={false}
          showYAxis={false}
          maxValue={90}
          animate={!reduce}
          className="h-full"
        />
      ) : null}
    </div>
  );
}
