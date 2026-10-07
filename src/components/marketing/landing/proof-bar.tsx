import { cn } from '@sl/ui';
import { BRAND_NAME } from '@/lib/marketing/brand';
import { EXAMPLE_SCORE, INDUSTRY_PACKS, SEND_GATES, SIGNAL_TYPES } from '@/lib/marketing/content';
import { GUTTER } from '../marketing-shell';
import { Reveal } from '../reveal';
import { INNER, RAIL } from './ui';

// Counted from the content itself, so a figure can't drift from the list it describes.
const STATS: readonly { value: number; label: string }[] = [
  { value: INDUSTRY_PACKS.length, label: 'industry packs, each with its own rules' },
  { value: SIGNAL_TYPES.length, label: 'kinds of dated public signal' },
  { value: EXAMPLE_SCORE.lines.length, label: 'parts to every score, each with a reason' },
  { value: SEND_GATES.length, label: 'gates before any email leaves' },
];

/** Every named source behind the signals, once each (the generic "news" is left out). */
const SOURCES: readonly string[] = [...new Set(SIGNAL_TYPES.flatMap((signal) => signal.sources.split(', ')))].filter((source) => source !== 'news');

/**
 * Under the hero, Attio's logo wall: the public sources as a wall of hairline cells (ten sources,
 * so two by five on desktop and two wide on phones, no empty cell), then the product in four
 * numbers, each on Attio's blue rule.
 */
export function ProofBar() {
  return (
    <section aria-labelledby="proof-bar-title" className={GUTTER}>
      <div className={cn(RAIL, 'border-b')}>
        <h2 id="proof-bar-title" className="sr-only">
          {BRAND_NAME} at a glance
        </h2>
        <Reveal>
          <p className={cn(INNER, 'border-b py-4 text-center text-[13px] font-medium text-muted-foreground')}>Reads the public record</p>
          <ul className="grid grid-cols-2 gap-px bg-border lg:grid-cols-5">
            {SOURCES.map((source) => (
              <li key={source} className="flex min-h-24 items-center justify-center bg-background px-4 py-6 text-center text-[15px] font-semibold tracking-[-0.01em] text-foreground/70">
                {source}
              </li>
            ))}
          </ul>
        </Reveal>
        <dl className={cn(INNER, 'grid grid-cols-2 gap-x-6 gap-y-10 border-t py-14 sm:py-16 lg:grid-cols-4')}>
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col gap-1.5 border-l-2 border-primary pl-4 sm:pl-5">
              <dt className="order-2 max-w-[24ch] text-sm font-medium text-pretty text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 text-4xl font-medium tracking-[-0.02em] text-foreground tabular-nums sm:text-5xl">{stat.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
