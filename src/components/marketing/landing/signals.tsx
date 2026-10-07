import { cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, SIGNAL_TYPES, type SignalType } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { WobbleCard } from '../wobble-card';
import { ActionLink, CONTENT_GAP, ICON_TILE, Line, NIGHT, NIGHT_MUTED, Section, SectionHeader, SIGNAL_ICONS } from './ui';

// Aceternity's wobble-card bento, with the page's own signals: a wide feature card and a dark card
// on the first row, six light cards in two rows of three, and a full-width dark card to close, the
// two wide cards each with a product view bleeding off their bottom-right corner (the demo's
// screenshots). Three columns on lg, two on sm (the dark side card goes full width there so the
// six light cards pair up), one on phones.
const FEATURED = 'secured-loan';
const SIDE = 'tender-notice';
const CLOSING = 'tender-award';

/** The lift under every card. */
const LIFT = 'shadow-[0_1px_2px_var(--shadow-color),0_24px_48px_-24px_var(--shadow-color)]';

/** The demo's soft light falling from the top of a coloured card. */
const GLOW = '[background-image:radial-gradient(88%_100%_at_top,color-mix(in_oklab,var(--primary-foreground)_22%,transparent),transparent)]';

const TITLE = 'text-balance font-semibold tracking-[-0.015em]';

function SignalIcon({ signal, className }: { signal: SignalType; className?: string }) {
  const Icon = SIGNAL_ICONS[signal.icon];
  return <Icon aria-hidden="true" className={cn('size-[18px]', className)} />;
}

export function Signals() {
  const byId = (id: string) => SIGNAL_TYPES.find((item) => item.id === id);
  const featured = byId(FEATURED);
  const side = byId(SIDE);
  const closing = byId(CLOSING);
  const rest = SIGNAL_TYPES.filter((item) => item.id !== FEATURED && item.id !== SIDE && item.id !== CLOSING);
  return (
    <Section id="signals" labelledBy="signals-title">
      <SectionHeader
        eyebrow="Signals"
        titleId="signals-title"
        title="What starts a lead"
        lead="Each signal is a dated record in a public source. The examples describe kinds of companies, not real ones."
        action={<ActionLink href="#evidence">See how a lead is scored</ActionLink>}
      />
      <Reveal className={CONTENT_GAP}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured !== undefined && (
            <li className="sm:col-span-2">
              <WobbleCard
                noise
                containerClassName={cn('bg-primary text-primary-foreground', LIFT)}
                className={cn(GLOW, 'flex min-h-[32rem] flex-col p-7 sm:p-10 lg:min-h-[26.5rem]')}
              >
                <div className="relative z-10 flex max-w-sm flex-col gap-4">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
                    <SignalIcon signal={featured} />
                  </span>
                  <h3 className={cn(TITLE, 'text-2xl lg:text-3xl')}>{featured.name}</h3>
                  <p className="max-w-[36ch] text-base/6 font-medium text-primary-foreground/85">{featured.example}</p>
                  <p className="font-mono text-[12px] text-primary-foreground/75">{featured.sources}</p>
                </div>
                {/* The record itself, set like the demo's screenshot: off the card's bottom-right corner. */}
                <figure
                  className={cn(
                    'absolute -right-6 -bottom-10 flex w-[19rem] flex-col gap-2 rounded-xl border bg-card p-5 font-mono text-[12px] leading-5 text-foreground sm:w-[24rem] lg:-right-10',
                    LIFT,
                  )}
                >
                  <figcaption className="text-muted-foreground">{EXAMPLE_LEAD.evidence.source}</figcaption>
                  <p className="font-medium">{EXAMPLE_LEAD.evidence.title}</p>
                  <p className="text-muted-foreground">{EXAMPLE_LEAD.evidence.snippet}</p>
                  <p className="pb-8 text-muted-foreground">{EXAMPLE_LEAD.evidence.happenedOn}</p>
                </figure>
              </WobbleCard>
            </li>
          )}
          {side !== undefined && (
            <li className="sm:col-span-2 lg:col-span-1">
              <WobbleCard noise containerClassName={cn(NIGHT, LIFT)} className={cn(GLOW, 'flex min-h-[18rem] flex-col gap-4 p-7 sm:p-10')}>
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <SignalIcon signal={side} />
                </span>
                <h3 className={cn(TITLE, 'text-xl lg:text-2xl')}>{side.name}</h3>
                <p className={cn('text-base/6 font-medium', NIGHT_MUTED)}>{side.example}</p>
                <p className={cn('mt-auto font-mono text-[12px]', NIGHT_MUTED)}>{side.sources}</p>
              </WobbleCard>
            </li>
          )}
          {rest.map((item) => (
            <li key={item.id}>
              <WobbleCard containerClassName={cn('border bg-card', LIFT)} className="flex min-h-[15rem] flex-col gap-4 p-7">
                <span className={ICON_TILE}>
                  <SignalIcon signal={item} />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className={cn(TITLE, 'text-lg text-foreground')}>{item.name}</h3>
                  <p className="text-[15px] leading-6 font-medium text-pretty text-muted-foreground">{item.example}</p>
                </div>
                <p className="mt-auto pt-1 font-mono text-[11px] text-muted-foreground">{item.sources}</p>
              </WobbleCard>
            </li>
          ))}
          {closing !== undefined && (
            <li className="sm:col-span-2 lg:col-span-3">
              <WobbleCard noise containerClassName={cn(NIGHT, LIFT)} className={cn(GLOW, 'min-h-[30rem] p-7 sm:p-10 lg:min-h-[20rem]')}>
                <div className="relative z-10 flex max-w-sm flex-col gap-4 xl:max-w-md">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <SignalIcon signal={closing} />
                  </span>
                  <h3 className={cn(TITLE, 'text-2xl lg:text-3xl')}>{closing.name}</h3>
                  <p className={cn('max-w-[40ch] text-base/6 font-medium', NIGHT_MUTED)}>{closing.example}</p>
                  <p className={cn('font-mono text-[12px]', NIGHT_MUTED)}>{closing.sources}</p>
                </div>
                {/* A product view of award notices, one per source, off the bottom-right corner. */}
                <div
                  aria-hidden="true"
                  className={cn(
                    'absolute -right-3 -bottom-10 w-[17.5rem] overflow-hidden rounded-xl border bg-card text-foreground sm:-right-8 sm:w-[24rem] xl:right-[6%] xl:w-[28rem]',
                    LIFT,
                  )}
                >
                  <p className="flex items-center justify-between border-b px-4 py-3 text-xs font-medium text-muted-foreground">
                    Award notices
                    <span className="font-mono text-[11px]">{closing.sources.split(', ').length} sources</span>
                  </p>
                  <ul className="divide-y pb-10">
                    {closing.sources.split(', ').map((source) => (
                      <li key={source} className="flex items-center gap-3 px-4 py-3">
                        <Icons.CircleCheck className="size-4 shrink-0 text-primary" />
                        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <span className="text-[13px] font-medium">{closing.name}</span>
                          <Line className="w-3/4" />
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </WobbleCard>
            </li>
          )}
        </ul>
      </Reveal>
    </Section>
  );
}
