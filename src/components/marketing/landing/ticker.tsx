import { cn } from '@sl/ui';
import { GUTTER } from '../marketing-shell';
import { Marquee } from '../marquee';
import { Reveal } from '../reveal';
import { SOURCES, STATS } from './proof-bar';
import { MONO_LABEL, TRUST } from './ui';

/**
 * Leadistry's ticker: a dark band under the header with the product's figures, its three promises
 * and the sources it reads, in mono capitals, moving slowly (Marquee). Figures in the accent.
 * Dark tokens are scoped to it.
 */
export function Ticker() {
  const items = [
    ...STATS.map((stat) => (
      <span key={stat.label}>
        <span className="text-primary">{stat.value}</span> {stat.label}
      </span>
    )),
    ...TRUST.map((item) => <span key={item}>{item}</span>),
    <span key="sources">Reads {SOURCES.join(' · ')}</span>,
  ];
  return (
    <section aria-label="In short" data-theme="dark" className={cn('border-b bg-sidebar text-foreground', GUTTER)}>
      <Reveal rise={false}>
        <Marquee items={items} className="min-h-10" itemClassName={cn(MONO_LABEL, 'px-6 text-muted-foreground sm:px-8 motion-reduce:py-2')} />
      </Reveal>
    </section>
  );
}
