'use client';

import { gsap } from 'gsap';
import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * The hero's entrance: every child marked `data-intro` fades in and rises, one after another, on a
 * slow GSAP timeline. The pieces are server-rendered with `motion-safe:opacity-0` so they never
 * flash before it starts; reduced motion skips both the hiding and the tween. (The <noscript>
 * rule in MarketingShell shows them when JavaScript is off.)
 */
export function HeroIntro({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scope = root.current;
    if (scope === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // The headline is hidden until this runs, so it must keep wall-clock time: with lag smoothing
    // a busy main thread during hydration would stretch the intro and keep the hero blank longer.
    gsap.ticker.lagSmoothing(0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-intro]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1.4, ease: 'power3.out', stagger: 0.14, delay: 0.1, clearProps: 'transform' },
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
