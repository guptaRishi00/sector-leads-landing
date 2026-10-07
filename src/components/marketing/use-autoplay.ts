'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const REDUCE = '(prefers-reduced-motion: reduce)';

const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * The rules every self-playing illustration on the page follows (How it works' steps): it plays
 * only with motion allowed (`animated` is false on the server and under reduced motion, so the
 * server's finished frame stays put), only while on screen, and it holds while hovered or focused
 * and while the visitor has paused it (WCAG 2.2.2). Put `ref` and `hold` on the illustration's root;
 * the caller advances its own clock while `running`.
 */
export function useAutoplay<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const animated = useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(REDUCE).matches,
    () => false,
  );

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting === true));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    animated,
    running: animated && visible && !paused && !held,
    paused,
    togglePaused: () => setPaused((on) => !on),
    hold: {
      onMouseEnter: () => setHeld(true),
      onMouseLeave: () => setHeld(false),
      onFocus: () => setHeld(true),
      onBlur: () => setHeld(false),
    },
  };
}
