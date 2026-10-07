'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling for the public pages, driven by GSAP's ticker so the scroll-linked GSAP
 * animations (ScrollTrigger, see HeroStage and ArcDraw) read the same smoothed position every frame.
 * Off under reduced motion. `anchors` makes in-page links (the nav, "Join the waitlist", the step
 * rail, the skip link) glide too; Lenis honours each target's scroll-margin-top, so the sticky header
 * never covers a heading. It doesn't cancel the click, so the hash and focus still move natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.09 });
    lenis.on('scroll', () => ScrollTrigger.update());
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
