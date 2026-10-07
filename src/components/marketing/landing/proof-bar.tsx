import { cn } from '@sl/ui';
import { BRAND_NAME } from '@/lib/marketing/brand';
import { EXAMPLE_SCORE, INDUSTRY_PACKS, SEND_GATES, SIGNAL_TYPES } from '@/lib/marketing/content';
import { GUTTER } from '../marketing-shell';
import { Reveal } from '../reveal';
import { SourceCarousel } from '../source-carousel';
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

/** How many lines each column's band holds (so a column is BAND_LINES + 1 gaps wide). */
const BAND_LINES = 20;
/** How many gaps wide each side gutter is on desktop (so it holds GUTTER_GAPS - 1 lines). */
const GUTTER_GAPS = 4;

/**
 * A band of thin (0.5px) vertical lines along the foot of a region: `count` lines, each at
 * (i + 1) / (count + 1) of the width, so the region's own edge lines are part of the rhythm (the
 * gap from each edge to the nearest line equals the gap between lines). `fromEdge` also draws a
 * line on the left edge itself: the right gutter's first beat, where the last column has no border
 * of its own.
 *
 * In a column (the `group`), hovering lays an ink copy of the lines over the hairline ones, masked
 * to fade out towards the right: darkest by the column's border, dissolving into the hairlines.
 */
function LinesBand({ count = BAND_LINES, fromEdge = false, className }: { count?: number; fromEdge?: boolean; className?: string }) {
  const lines = Array.from({ length: fromEdge ? count + 1 : count }, (_, index) => (
    <rect key={index} x={`${((fromEdge ? index : index + 1) / (count + 1)) * 100}%`} width="0.5" height="100%" fill="currentColor" />
  ));
  const box = cn('pointer-events-none absolute bottom-0 h-16', className ?? 'inset-x-0 w-full');
  return (
    <>
      <svg aria-hidden="true" className={cn(box, 'text-border')}>
        {lines}
      </svg>
      <svg
        aria-hidden="true"
        className={cn(box, 'text-foreground opacity-0 transition-opacity duration-300 [mask-image:linear-gradient(to_right,black,transparent)] group-hover:opacity-100')}
      >
        {lines}
      </svg>
    </>
  );
}

/**
 * Under the hero, Attio's logo strip: the public sources as an endless, self-moving row of hairline
 * cards (SourceCarousel; the plain two-by-five wall under reduced motion), then the product in four
 * numbers, set like Attio's changelog strip (LinesBand).
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
          <SourceCarousel sources={SOURCES} />
        </Reveal>
        {/* Attio's changelog strip: tall columns, each opened by a hairline on its left, the copy at
            the top (the number as the title, the label under it in grey) and a band of fine
            vertical lines along its foot. On desktop the band runs edge to edge: each side gutter
            is exactly GUTTER_GAPS line-gaps wide, so it carries the same rhythm out to the rail.
            A column is (BAND_LINES + 1) gaps, so with four columns the gutter is
            GUTTER_GAPS / (4 * (BAND_LINES + 1) + 2 * GUTTER_GAPS) = 4/92 = 1/23 of the rail's width,
            and padding percentages are of that width. The gutter bands sit outside the <dl>, which
            may only hold dt/dd groups. */}
        <div className="relative border-t">
          <dl className="grid grid-cols-1 px-5 pt-20 sm:grid-cols-2 sm:px-10 sm:pt-32 lg:grid-cols-4 lg:px-[calc(100%/23)]">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.08} className="group relative flex min-h-52 flex-col gap-2 border-l pt-2 pr-6 pb-24 pl-6 transition-colors duration-300 hover:border-foreground sm:min-h-72 sm:pl-8">
                <dt className="order-2 max-w-[24ch] text-[17px] leading-snug font-medium text-pretty text-muted-foreground">{stat.label}</dt>
                <dd className="order-1 text-4xl font-medium tracking-[-0.02em] text-foreground tabular-nums transition-colors duration-300 group-hover:text-primary">{stat.value}</dd>
                <LinesBand />
              </Reveal>
            ))}
          </dl>
          <LinesBand count={GUTTER_GAPS - 1} className="left-0 hidden w-[calc(100%/23)] lg:block" />
          <LinesBand count={GUTTER_GAPS - 1} fromEdge className="right-0 hidden w-[calc(100%/23)] lg:block" />
        </div>
      </div>
    </section>
  );
}
