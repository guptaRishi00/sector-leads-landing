'use client';

import { motion, type Variants } from 'framer-motion';
import { BRAND_NAME } from '@/lib/marketing/brand';

const EASE = [0.22, 1, 0.36, 1] as const;

const WORD: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.04 } } };
const LETTER: Variants = { hidden: { y: '110%' }, shown: { y: '0%', transition: { duration: 0.9, ease: EASE } } };

/**
 * The brand set giant across the footer, after SoftexEdge's footer: each letter rises out of its own
 * clipped box, one after another, the first time the word is half in view. Decoration (the name is
 * in the footer's text already), so hidden from assistive tech. Reduced motion and no-JS show it set.
 */
export function FooterWordmark() {
  const letters = [...BRAND_NAME].map((char, index) => ({ char: char === ' ' ? String.fromCharCode(0xa0) : char, id: `${char}-${index}` }));
  return (
    <motion.p
      aria-hidden="true"
      variants={WORD}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      className="flex justify-center font-display text-[min(16.5vw,15rem)] leading-[0.85] font-medium tracking-[-0.04em] whitespace-nowrap text-foreground select-none"
    >
      {letters.map(({ char, id }) => (
        // Room for the ink inside the clip (padding), cancelled by margins so the spacing is unchanged.
        <span key={id} className="-mx-[0.04em] -mb-[0.2em] inline-block overflow-hidden px-[0.04em] pb-[0.2em]">
          <motion.span data-reveal="" variants={LETTER} className="inline-block motion-reduce:transform-none!">
            {char}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}
