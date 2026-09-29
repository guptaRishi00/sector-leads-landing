'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Starts the diagram's motion: marching dashes on every `[data-flow]` strip and travelling packets
 * on every `[data-packet]` track. Transform-only Web Animations (no CSS keyframes needed, no
 * dependency), so they stay on the compositor. They pause while the diagram is off screen and never
 * start under reduced motion, which leaves the static lines in place.
 */
export function FlowMotion({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (scope === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animations: Animation[] = [];

    for (const strip of scope.querySelectorAll<HTMLElement>('[data-flow]')) {
      const axis = strip.dataset.flow === 'y' ? 'Y' : 'X';
      const seconds = Number(strip.dataset.duration ?? '8');
      animations.push(
        strip.animate([{ transform: `translate${axis}(0)` }, { transform: `translate${axis}(80px)` }], {
          duration: seconds * 1000,
          iterations: Infinity,
          direction: strip.dataset.reverse === 'true' ? 'reverse' : 'normal',
        }),
      );
    }

    for (const track of scope.querySelectorAll<HTMLElement>('[data-packet]')) {
      const axis = track.dataset.packet === 'y' ? 'Y' : 'X';
      const reverse = track.dataset.reverse === 'true';
      const from = reverse ? '100%' : '-100%';
      animations.push(
        track.animate(
          [
            { transform: `translate${axis}(${from})`, opacity: 0 },
            { opacity: 1, offset: 0.1 },
            { opacity: 1, offset: 0.9 },
            { transform: `translate${axis}(0)`, opacity: 0 },
          ],
          { duration: 2400, delay: Number(track.dataset.delay ?? '0') * 1000, iterations: Infinity, easing: 'ease-in-out' },
        ),
      );
    }

    const observer = new IntersectionObserver(([entry]) => {
      for (const animation of animations) {
        if (entry?.isIntersecting === true) animation.play();
        else animation.pause();
      }
    });
    observer.observe(scope);
    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
