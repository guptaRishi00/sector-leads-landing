'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@sl/ui';

const VARIANTS = { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } };
const FADE = { hidden: { opacity: 0 }, shown: { opacity: 1 } };
const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;
// Reduced motion: visible and still from the first paint (see Reveal).
const STILL = 'motion-reduce:transform-none! motion-reduce:opacity-100!';

/**
 * Scroll reveal with Framer Motion: fades in and rises 16px, smoothly, the first time the element is
 * about an eighth of the viewport into view. `delay` staggers siblings; `rise={false}` only fades
 * (for thin bands, where a lift would read as a jump).
 *
 * Reduced motion is handled in CSS, not with useReducedMotion(): the server can't know the setting,
 * so branching `initial` on it made the client's first render disagree with the server HTML (a
 * hydration error). Instead both always render the hidden state, and the `motion-reduce:` overrides
 * keep the element visible and still, before and after JS. (The <noscript> rule in MarketingShell
 * does the same when JavaScript is off.)
 */
export function Reveal({
  as = 'div',
  delay = 0,
  rise = true,
  className,
  children,
}: {
  as?: 'div' | 'li';
  delay?: number;
  rise?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      data-reveal=""
      className={cn(STILL, className)}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={rise ? VARIANTS : FADE}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

const GROUP_TAGS = { div: motion.div, ul: motion.ul, ol: motion.ol, dl: motion.dl } as const;

/**
 * A staggered reveal: the group itself doesn't move; when it comes into view its `RevealItem`s (at
 * any depth inside it) fade in and rise 12px one after another, `stagger` seconds apart. For rows of
 * cards and lists, so they arrive in reading order instead of as one block.
 */
export function RevealGroup({
  as = 'div',
  delay = 0,
  stagger = 0.08,
  className,
  children,
}: {
  as?: keyof typeof GROUP_TAGS;
  delay?: number;
  stagger?: number;
  className?: string;
  children: ReactNode;
}) {
  const Tag = GROUP_TAGS[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{ hidden: {}, shown: { transition: { delayChildren: delay, staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

const ITEM = { hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

/** One item of a RevealGroup: it takes its timing from the group. */
export function RevealItem({ as = 'div', className, children, ...aria }: { as?: 'div' | 'li'; className?: string; children: ReactNode; 'aria-hidden'?: true }) {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag data-reveal="" className={cn(STILL, className)} variants={ITEM} {...aria}>
      {children}
    </Tag>
  );
}
