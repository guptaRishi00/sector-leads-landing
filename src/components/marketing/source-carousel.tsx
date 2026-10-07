'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Icons, cn } from '@sl/ui';

/**
 * The public sources as a self-moving, endless row of hairline cards: one copy of the list plus an
 * aria-hidden duplicate, slid left by exactly half the track (a Web Animation, transform-only, no
 * dependency), so the loop has no seam. It pauses on hover or keyboard focus, while off screen, and
 * with the visible pause button (WCAG 2.2.2).
 *
 * The server renders the row (so nothing shifts when the animation starts). Under reduced motion,
 * from the first paint, it's the plain wall instead: the cards wrap two by five on desktop and two
 * wide on phones, the duplicate and the button are hidden, and the animation never starts.
 */
export function SourceCarousel({ sources }: { sources: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef<Animation | null>(null);
  const holds = useRef({ hover: false, offscreen: false });
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const sync = () => {
    const animation = loop.current;
    if (animation === null) return;
    if (pausedRef.current || holds.current.hover || holds.current.offscreen) animation.pause();
    else animation.play();
  };

  useEffect(() => {
    const element = track.current;
    const scope = root.current;
    if (element === null || scope === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    loop.current = element.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: sources.length * 4000, iterations: Infinity });
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
  }, [sources.length]);

  useEffect(sync, [paused]);

  const hold = (on: boolean) => {
    holds.current.hover = on;
    sync();
  };

  const cards = (copy: number) =>
    sources.map((source) => (
      <li
        key={`${copy}-${source}`}
        className="flex min-h-24 w-56 shrink-0 items-center justify-center border-r bg-background px-4 py-6 text-center text-[15px] font-semibold tracking-[-0.01em] text-foreground/70 motion-reduce:w-auto motion-reduce:border-r-0 sm:w-60"
      >
        {source}
      </li>
    ));

  return (
    <div ref={root} className="relative">
      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:[mask-image:none]"
        onMouseEnter={() => hold(true)}
        onMouseLeave={() => hold(false)}
        onFocus={() => hold(true)}
        onBlur={() => hold(false)}
      >
        <div ref={track} className="flex w-max motion-reduce:w-full">
          <ul className="flex shrink-0 motion-reduce:grid motion-reduce:w-full motion-reduce:grid-cols-2 motion-reduce:gap-px motion-reduce:bg-border lg:motion-reduce:grid-cols-5">
            {cards(0)}
          </ul>
          <ul aria-hidden="true" className="flex shrink-0 motion-reduce:hidden">
            {cards(1)}
          </ul>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? 'Play the list of sources' : 'Pause the list of sources'}
        className={cn('absolute -top-11 right-3 rounded-[10px] text-muted-foreground motion-reduce:hidden sm:right-4')}
      >
        {paused ? <Icons.Play aria-hidden="true" /> : <Icons.Pause aria-hidden="true" />}
      </Button>
    </div>
  );
}
