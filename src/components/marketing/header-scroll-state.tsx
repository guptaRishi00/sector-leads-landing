'use client';

import { useEffect, useRef } from 'react';

/**
 * Marks the site header `data-scrolled` once the page is scrolled past `threshold` px, so its CSS
 * can shrink it into a floating pill (after SoftexEdge's resizable navbar, which flips at 80px).
 * A passive listener that writes the attribute only when the boolean changes: no React state, no
 * re-render while scrolling. Rendered inside the header; it finds the header itself.
 */
export function HeaderScrollState({ threshold = 80 }: { threshold?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const header = ref.current?.closest('header');
    if (header === null || header === undefined) return;
    let scrolled: boolean | null = null;
    const onScroll = () => {
      const next = window.scrollY > threshold;
      if (next === scrolled) return;
      scrolled = next;
      header.toggleAttribute('data-scrolled', next);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return <span ref={ref} hidden />;
}
