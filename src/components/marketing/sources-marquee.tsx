'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Icons, cn } from '@sl/ui';

/**
 * The public sources, drifting slowly sideways (Web Animations API, no dependency). It pauses on
 * hover or keyboard focus and has a visible pause button (WCAG 2.2.2). Under reduced motion, or
 * before hydration, it's a static wrapped list, and the second copy that makes the loop seamless is
 * only rendered while it moves.
 */
export function SourcesMarquee({ sources }: { sources: readonly string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setMoving(true);
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!moving || element === null) return;
    const loop = element.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: sources.length * 5000, iterations: Infinity });
    animation.current = loop;
    return () => loop.cancel();
  }, [moving, sources.length]);

  const hold = (on: boolean) => {
    if (paused) return;
    if (on) animation.current?.pause();
    else animation.current?.play();
  };
  const toggle = () => {
    if (paused) animation.current?.play();
    else animation.current?.pause();
    setPaused(!paused);
  };

  const items = (copy: number) =>
    sources.map((source) => (
      <li key={`${copy}-${source}`} className="flex items-center gap-2 px-5 text-sm font-medium whitespace-nowrap text-muted-foreground sm:px-7">
        <span aria-hidden="true" className="size-1 rounded-full bg-primary/60" />
        {source}
      </li>
    ));

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn('min-w-0 flex-1', moving && 'overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]')}
        onMouseEnter={() => hold(true)}
        onMouseLeave={() => hold(false)}
        onFocus={() => hold(true)}
        onBlur={() => hold(false)}
      >
        <div ref={track} className={cn('flex', moving && 'w-max')}>
          <ul className={cn('flex', moving ? 'shrink-0' : 'flex-1 flex-wrap justify-center gap-y-3')}>{items(0)}</ul>
          {moving && (
            <ul aria-hidden="true" className="flex shrink-0">
              {items(1)}
            </ul>
          )}
        </div>
      </div>
      {moving && (
        <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label={paused ? 'Play the list of sources' : 'Pause the list of sources'} className="text-muted-foreground">
          {paused ? <Icons.Play aria-hidden="true" /> : <Icons.Pause aria-hidden="true" />}
        </Button>
      )}
    </div>
  );
}
