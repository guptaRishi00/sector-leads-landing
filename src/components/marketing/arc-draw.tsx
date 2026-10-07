'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

/**
 * The dark chapter's horizon: a single thin arc (Attio's "Universal Context" rim, drawn as a line,
 * not a glow) that draws itself as it scrolls into view. The stroke offset is scrubbed by
 * ScrollTrigger; under reduced motion, or before JavaScript, the arc is simply drawn in full.
 */
export function ArcDraw({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = root.current;
    if (svg === null) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      for (const path of svg.querySelectorAll<SVGPathElement>('path')) {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: svg, start: 'top 90%', end: 'top 35%', scrub: 0.8 } },
        );
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <svg ref={root} aria-hidden="true" viewBox="0 0 1200 260" preserveAspectRatio="none" fill="none" className={className}>
      <path d="M0 258 C 260 20, 940 20, 1200 258" className="stroke-primary" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d="M90 258 C 330 70, 870 70, 1110 258" className="stroke-border" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
