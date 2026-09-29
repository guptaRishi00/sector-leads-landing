'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const VARIANTS = { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0 } };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll reveal with Framer Motion: fades in and rises 28px, slowly, the first time the element is
 * about an eighth of the viewport into view. `delay` staggers siblings. Under reduced motion it
 * renders in place without animating. (The <noscript> rule in MarketingShell shows it when
 * JavaScript is off.)
 */
export function Reveal({ as = 'div', delay = 0, className, children }: { as?: 'div' | 'li'; delay?: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      data-reveal=""
      className={className}
      initial={reduce === true ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={VARIANTS}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
