'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

// Four soft colour fields mixed from the theme's own tokens (no raw colours), so the band follows
// light and dark mode. Oversized so it can drift without showing an edge.
const FIELDS: CSSProperties = {
  backgroundImage: [
    'radial-gradient(38% 55% at 22% 38%, color-mix(in oklch, var(--primary) 85%, transparent), transparent 70%)',
    'radial-gradient(34% 50% at 52% 18%, color-mix(in oklch, var(--primary) 55%, var(--destructive)), transparent 70%)',
    'radial-gradient(40% 55% at 80% 42%, color-mix(in oklch, var(--primary) 45%, var(--success)), transparent 70%)',
    'radial-gradient(36% 48% at 58% 78%, color-mix(in oklch, var(--warning) 70%, var(--destructive)), transparent 70%)',
  ].join(', '),
};

// Stripe-style: a band across the top that fades out towards the headline, so the text always
// sits on the plain page background and keeps its contrast. The lower edge is a slanted mask
// fade, not a clip, so it dissolves into the page instead of ending on a hard line.
const FADE = 'linear-gradient(to right, transparent 8%, black 55%), linear-gradient(172deg, black 30%, transparent 80%)';
const BAND: CSSProperties = {
  maskImage: FADE,
  maskComposite: 'intersect',
  WebkitMaskImage: FADE,
  WebkitMaskComposite: 'source-in',
};

/** The hero's animated colour band. Drifts slowly (transform only); still under reduced motion. */
export function HeroGradient({ className }: { className?: string }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layer.current;
    if (element === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const drift = element.animate(
      [
        { transform: 'translate3d(-6%, -2%, 0) rotate(0deg) scale(1)' },
        { transform: 'translate3d(4%, 3%, 0) rotate(4deg) scale(1.08)' },
        { transform: 'translate3d(-2%, 5%, 0) rotate(-3deg) scale(1.04)' },
      ],
      { duration: 22000, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
    );
    return () => drift.cancel();
  }, []);

  return (
    <div aria-hidden="true" className={className} style={BAND}>
      <div ref={layer} className="absolute -inset-[20%] opacity-80 will-change-transform dark:opacity-55" style={FIELDS} />
    </div>
  );
}
