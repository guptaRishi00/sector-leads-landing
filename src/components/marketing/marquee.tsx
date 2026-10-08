'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@sl/ui';

/**
 * An endless, self-moving row: the items once plus an aria-hidden duplicate, slid left by exactly
 * half the track (a Web Animation, transform only, no dependency), so the loop has no seam. It
 * pauses on hover or keyboard focus and while off screen (no pause button, at the user's request).
 * The server renders the row, so nothing shifts when it starts; under reduced motion, from the
 * first paint, it's a still, wrapped, centred list with no duplicate.
 * `pixelsPerSecond` keeps the speed the same however long the row is.
 */
export function Marquee({
  items,
  pixelsPerSecond = 40,
  className,
  itemClassName,
}: {
  items: readonly ReactNode[];
  pixelsPerSecond?: number;
  className?: string;
  itemClassName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef<Animation | null>(null);
  const holds = useRef({ hover: false, offscreen: false });

  const sync = () => {
    const animation = loop.current;
    if (animation === null) return;
    if (holds.current.hover || holds.current.offscreen) animation.pause();
    else animation.play();
  };

  useEffect(() => {
    const element = track.current;
    const scope = root.current;
    if (element === null || scope === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const half = element.scrollWidth / 2;
    loop.current = element.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: (half / pixelsPerSecond) * 1000, iterations: Infinity });
    const observer = new IntersectionObserver(([entry]) => {
      holds.current.offscreen = entry?.isIntersecting !== true;
      sync();
    });
    observer.observe(scope);
    return () => {
      observer.disconnect();
      loop.current?.cancel();
      loop.current = null;
    };
  }, [pixelsPerSecond, items.length]);

  const hold = (on: boolean) => {
    holds.current.hover = on;
    sync();
  };

  const row = (copy: number) =>
    items.map((item, index) => (
      <li key={`${copy}-${index}`} className={cn('shrink-0', itemClassName)}>
        {item}
      </li>
    ));

  return (
    <div ref={root} className={cn('relative flex items-center', className)}>
      <div
        className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] motion-reduce:[mask-image:none]"
        onMouseEnter={() => hold(true)}
        onMouseLeave={() => hold(false)}
        onFocus={() => hold(true)}
        onBlur={() => hold(false)}
      >
        <div ref={track} className="flex w-max motion-reduce:w-full">
          <ul className="flex shrink-0 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">{row(0)}</ul>
          <ul aria-hidden="true" className="flex shrink-0 motion-reduce:hidden">
            {row(1)}
          </ul>
        </div>
      </div>
    </div>
  );
}
