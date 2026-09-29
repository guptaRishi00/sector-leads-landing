'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling for the public pages. Off under reduced motion. `anchors` makes in-page
 * links (the nav, "Join the waitlist", the skip link) glide too; Lenis honours each target's
 * scroll-margin-top, so the sticky header never covers a heading. It doesn't cancel the click, so
 * the hash and focus still move as they would natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 });
    return () => lenis.destroy();
  }, []);
  return null;
}
