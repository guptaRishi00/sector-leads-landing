import { cn } from '@sl/ui';
import { BRAND_NAME } from '@/lib/marketing/brand';
import { EXAMPLE_SCORE, INDUSTRY_PACKS, SEND_GATES, SIGNAL_TYPES } from '@/lib/marketing/content';
import { GUTTER } from '../marketing-shell';
import { RevealGroup, RevealItem } from '../reveal';
import { INNER, MONO_LABEL, RAIL } from './ui';

// Counted from the content itself, so a figure can't drift from the list it describes.
export const STATS: readonly { value: number; label: string }[] = [
  { value: INDUSTRY_PACKS.length, label: 'industry packs, each with its own rules' },
  { value: SIGNAL_TYPES.length, label: 'kinds of dated public signal' },
  { value: EXAMPLE_SCORE.lines.length, label: 'parts to every score, each with a reason' },
  { value: SEND_GATES.length, label: 'gates before any email leaves' },
];

/** Every named source behind the signals, once each (the generic "news" is left out). */
export const SOURCES: readonly string[] = [...new Set(SIGNAL_TYPES.flatMap((signal) => signal.sources.split(', ')))].filter((source) => source !== 'news');

/**
 * The product in four numbers, as Leadistry's figures band: a tinted full-bleed band, each figure
 * set large in the display face over a mono caption, divided by hairlines.
 */
export function ProofBar() {
  return (
    <section aria-labelledby="proof-bar-title" className={cn('border-b bg-muted', GUTTER)}>
      <div className={RAIL}>
        <h2 id="proof-bar-title" className="sr-only">
          {BRAND_NAME} at a glance
        </h2>
        <RevealGroup as="dl" className={cn(INNER, 'grid grid-cols-2 gap-y-12 py-20 sm:py-24 lg:grid-cols-4')}>
          {STATS.map((stat, index) => (
            <RevealItem key={stat.label} className={cn('flex flex-col items-center gap-4 px-4 text-center', index % 2 === 1 && 'border-l', index === 2 && 'lg:border-l')}>
              <dt className={cn(MONO_LABEL, 'order-2 max-w-[22ch] leading-[1.5] text-muted-foreground')}>{stat.label}</dt>
              <dd className="order-1 font-display text-6xl leading-none font-medium tracking-[-0.03em] text-foreground tabular-nums sm:text-7xl">{stat.value}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
