import { cn } from '@sl/ui';
import { EXAMPLE_LEAD, SIGNAL_TYPES } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { ActionLink, CONTENT_GAP, ICON_TILE, NIGHT, NIGHT_LINE, NIGHT_MUTED, Section, SectionHeader, SIGNAL_ICONS } from './ui';

/** Three of the eight small cells get a surface of their own: two blue tints and one dot field (all opaque, so the hairlines stay hairlines). */
const BENTO_SURFACE: Partial<Record<number, string>> = {
  2: 'bg-selected',
  5: 'bg-selected',
  7: 'bg-background bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:14px_14px]',
};

export function Signals() {
  const featured = SIGNAL_TYPES.find((item) => item.id === 'secured-loan');
  const rest = SIGNAL_TYPES.filter((item) => item.id !== 'secured-loan');
  const FeaturedIcon = featured === undefined ? null : SIGNAL_ICONS[featured.icon];
  return (
    <Section id="signals" labelledBy="signals-title">
      <SectionHeader
        eyebrow="Signals"
        titleId="signals-title"
        title="What starts a lead"
        lead="Each signal is a dated record in a public source. The examples describe kinds of companies, not real ones."
        action={<ActionLink href="#evidence">See how a lead is scored</ActionLink>}
      />
      {/* Attio's cell wall: the cells share one hairline (a 1px gap over the border colour). The dark
          feature cell is 2x2 on lg (two columns on sm), so nine signals fill exactly 12 slots on lg
          and 10 on sm, with no empty cell. The wall reveals as one piece, so no cell shows the
          hairline colour through it while fading in. */}
      <Reveal className={CONTENT_GAP}>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {featured !== undefined && FeaturedIcon !== null && (
            <li className={cn('flex flex-col gap-6 p-6 sm:col-span-2 sm:p-9 lg:row-span-2', NIGHT)}>
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FeaturedIcon aria-hidden="true" className="size-[18px]" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-medium tracking-[-0.01em]">{featured.name}</h3>
                <p className={cn('max-w-[42ch] text-lg leading-7 font-medium text-pretty', NIGHT_MUTED)}>{featured.example}</p>
              </div>
              <figure className={cn('mt-auto flex flex-col gap-2 rounded-lg border p-4 font-mono text-[12px] leading-5', NIGHT_LINE)}>
                <figcaption className={NIGHT_MUTED}>{EXAMPLE_LEAD.evidence.source}</figcaption>
                <p>{EXAMPLE_LEAD.evidence.title}</p>
                <p className={NIGHT_MUTED}>{EXAMPLE_LEAD.evidence.snippet}</p>
              </figure>
            </li>
          )}
          {rest.map((item, index) => {
            const Icon = SIGNAL_ICONS[item.icon];
            return (
              <li key={item.id} className={cn('flex flex-col gap-4 p-6 sm:p-7', BENTO_SURFACE[index] ?? 'bg-background')}>
                <span className={ICON_TILE}>
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-medium text-foreground">{item.name}</h3>
                  <p className="text-[15px] leading-6 font-medium text-pretty text-muted-foreground">{item.example}</p>
                </div>
                <p className="mt-auto pt-1 font-mono text-[11px] text-muted-foreground">{item.sources}</p>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
