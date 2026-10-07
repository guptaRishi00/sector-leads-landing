'use client';

import type { MouseEvent, ReactNode } from 'react';
import { cn } from '@sl/ui';

/** Fine grain, generated (an SVG turbulence filter), so the card needs no image file. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const setOffset = (element: HTMLElement, x: number, y: number) => {
  element.style.setProperty('--wx', `${x}px`);
  element.style.setProperty('--wy', `${y}px`);
};

/**
 * Aceternity's WobbleCard, without its dependencies: on hover the card drifts towards the pointer
 * (a twentieth of the pointer's distance from its centre) while its content drifts the other way
 * and grows by 3%, a small parallax. The offset is written to CSS variables on the card (no React
 * state, no re-render per mouse move) and applied with a 100ms ease. `noise` lays a faint grain,
 * masked to the middle, over coloured cards. Pointer only and motion-safe: on touch, or with
 * reduced motion, it's a still card. Decorative motion, so it needs no keyboard equivalent.
 */
export function WobbleCard({ className, containerClassName, noise = false, children }: { className?: string; containerClassName?: string; noise?: boolean; children: ReactNode }) {
  return (
    <div
      onMouseMove={(event: MouseEvent<HTMLDivElement>) => {
        const card = event.currentTarget;
        const box = card.getBoundingClientRect();
        setOffset(card, (event.clientX - (box.left + box.width / 2)) / 20, (event.clientY - (box.top + box.height / 2)) / 20);
      }}
      onMouseLeave={(event: MouseEvent<HTMLDivElement>) => setOffset(event.currentTarget, 0, 0)}
      className={cn(
        'group/wobble relative h-full overflow-hidden rounded-2xl [--wx:0px] [--wy:0px] motion-safe:transition-transform motion-safe:duration-100 motion-safe:ease-out motion-safe:hover:[transform:translate3d(var(--wx),var(--wy),0)]',
        containerClassName,
      )}
    >
      <div className="relative h-full motion-safe:transition-transform motion-safe:duration-100 motion-safe:ease-out motion-safe:group-hover/wobble:[transform:translate3d(calc(-1*var(--wx)),calc(-1*var(--wy)),0)_scale3d(1.03,1.03,1)]">
        {noise && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 scale-[1.2] opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
            style={{ backgroundImage: NOISE, backgroundSize: '30%' }}
          />
        )}
        <div className={cn('relative h-full', className)}>{children}</div>
      </div>
    </div>
  );
}
