'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const REDUCE = '(prefers-reduced-motion: reduce)';

/** How much of an illustration must be on screen to count as in view. */
const IN_VIEW = 0.2;

const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * The rules every self-playing illustration on the page follows (How it works' steps, Automation):
 * it plays only with motion allowed (`animated` is false on the server and under reduced motion, so
 * the server's frame stays put), only while it is in view (at least IN_VIEW of it on screen), and
 * not while the visitor has paused it with its button (WCAG 2.2.2). It does not hold on hover or
 * focus: scrolling with the wheel brings it under a resting pointer, which froze it before it
 * started, and focus stayed on the play button after a resume. `started` turns true the first time
 * it comes into view with motion allowed: the caller restarts its loop from the beginning then, so
 * the animation starts in view rather than carrying on from the server's frame.
 * Put `ref` on the illustration's root; the caller advances its own clock while `running`.
 */
export function useAutoplay<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  const animated = useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(REDUCE).matches,
    () => false,
  );

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Observed at 0 and at IN_VIEW: it comes into view at IN_VIEW, and counts as gone only once
        // fully off screen (a single threshold never reports leaving below it).
        const ratio = entry?.intersectionRatio ?? 0;
        setVisible((wasVisible) => (wasVisible ? ratio > 0 : ratio >= IN_VIEW * 0.95));
        if (ratio >= IN_VIEW * 0.95) setSeen(true);
      },
      { threshold: [0, IN_VIEW] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    animated,
    running: animated && visible && !paused,
    started: animated && seen,
    paused,
    togglePaused: () => setPaused((on) => !on),
  };
}
