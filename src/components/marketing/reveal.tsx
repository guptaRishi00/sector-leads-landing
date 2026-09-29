'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@sl/ui';

const VARIANTS = { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0 } };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll reveal with Framer Motion: fades in and rises 28px, slowly, the first time the element is
 * about an eighth of the viewport into view. `delay` staggers siblings.
 *
 * Reduced motion is handled in CSS, not with useReducedMotion(): the server can't know the setting,
 * so branching `initial` on it made the client's first render disagree with the server HTML (a
 * hydration error). Instead both always render the hidden state, and the `motion-reduce:` overrides
 * keep the element visible and still, before and after JS. (The <noscript> rule in MarketingShell
 * does the same when JavaScript is off.)
 */
export function Reveal({ as = 'div', delay = 0, className, children }: { as?: 'div' | 'li'; delay?: number; className?: string; children: ReactNode }) {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      data-reveal=""
      className={cn('motion-reduce:transform-none! motion-reduce:opacity-100!', className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={VARIANTS}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
