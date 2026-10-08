'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useId, useRef } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;
const DRAW = 1.8;

/** The y of a polyline's last point, as a share of the chart's height (for the end marker). */
const lastY = (points: string, height: number) => {
  const last = points.trim().split(/\s+/).at(-1)?.split(',')[1];
  return last === undefined ? 0 : Number(last) / height;
};

/**
 * Results, drawn: the contacted line with its shaded area and the dashed holdout line are revealed
 * from left to right (one clip that widens) when the chart first comes into view, then a dot
 * pulses on the contacted line's last point. Grid lines stay put. Under reduced motion it appears
 * at once, without the reveal (the server renders the same empty start either way, so hydration
 * matches). Illustration only (the caller hides it from assistive tech).
 */
export function ResultsChart({ contacted, holdout, className }: { contacted: string; holdout: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion() === true;
  const shown = reduce || inView;
  const clip = `results-${useId().replace(/:/g, '')}`;
  return (
    <div className={className}>
      <div className="relative h-full">
        <svg ref={ref} viewBox="0 0 100 90" preserveAspectRatio="none" className="size-full">
          <defs>
            <clipPath id={clip}>
              <motion.rect x="0" y="0" height="90" initial={{ width: 0 }} animate={{ width: shown ? 100 : 0 }} transition={{ duration: reduce ? 0 : DRAW, ease: EASE }} />
            </clipPath>
          </defs>
          {[20, 40, 60, 80].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} className="stroke-border" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <g clipPath={`url(#${clip})`}>
            <polyline points={`${contacted} 100,90 0,90`} className="fill-primary/10" />
            <polyline points={contacted} fill="none" className="stroke-primary" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            <polyline
              points={holdout}
              fill="none"
              className="stroke-muted-foreground/60"
              strokeWidth="2"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        {/* The latest point, once the line reaches it (HTML, so the stretched SVG doesn't squash the dot). */}
        <motion.span
          className="absolute right-0 flex size-2.5 translate-x-1/2 -translate-y-1/2"
          style={{ top: `${lastY(contacted, 90) * 100}%` }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.35, delay: reduce ? 0 : DRAW - 0.2, ease: EASE }}
        >
          <span className="absolute inline-flex size-full rounded-full bg-primary opacity-50 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2.5 rounded-full border-2 border-card bg-primary" />
        </motion.span>
      </div>
    </div>
  );
}
