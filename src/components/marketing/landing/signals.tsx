import type { ReactNode } from 'react';
import { cn } from '@sl/ui';
import { SIGNAL_TYPES, type SignalType } from '@/lib/marketing/content';
import * as Iconoir from '../iconoir';
import { LINE_ART } from '../iconoir';
import { Reveal } from '../reveal';
import { ActionLink, CONTENT_GAP, ICON_TILE, LEAD, NIGHT, NIGHT_MUTED, Section, SectionHeader, SIGNAL_ICONS } from './ui';

// A bento after Aceternity's wobble-card demo (still, no hover), with the page's own signals: a wide
// blue feature card and a dark card on the first row, six light cards in two rows of three, and a
// full-width dark card to close. The three coloured cards each carry a large Supabase-style
// outlined icon for their signal (a bank, a megaphone, a contract with a star), cropped by the
// card. Three columns on lg, two on sm (the dark side card goes full width there so the six light
// cards pair up), one on phones.
const FEATURED = 'secured-loan';
const SIDE = 'tender-notice';
const CLOSING = 'tender-award';

/** The lift under every card. */
const LIFT = 'shadow-[0_1px_2px_var(--shadow-color),0_24px_48px_-24px_var(--shadow-color)]';

/** The demo's soft light falling from the top of a coloured card. */
const GLOW = '[background-image:radial-gradient(88%_100%_at_top,color-mix(in_oklab,var(--primary-foreground)_22%,transparent),transparent)]';

const TITLE = 'text-balance font-semibold tracking-[-0.015em]';

/** Fine grain for the coloured cards, generated (an SVG turbulence filter), so it needs no image file. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * A still bento card (the wobble on hover was removed at the user's request): rounded, clipped so a
 * product view can bleed off its corner, with an optional faint grain masked to the middle.
 */
function BentoCard({ className, containerClassName, noise = false, children }: { className?: string; containerClassName?: string; noise?: boolean; children: ReactNode }) {
  return (
    <div className={cn('relative h-full overflow-hidden rounded-2xl', containerClassName)}>
      {noise && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 scale-[1.2] opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
          style={{ backgroundImage: NOISE, backgroundSize: '30%' }}
        />
      )}
      <div className={cn('relative isolate h-full', className)}>{children}</div>
    </div>
  );
}

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
    // Leadistry's statement band ("Pay for leads with intent."): a giant centred heading, the lead
    // and the action under it, then the bento.
    <Section id="signals" labelledBy="signals-title" band>
      <SectionHeader statement eyebrow="Signals" titleId="signals-title" title="What starts" accent="a lead" />
      <Reveal delay={0.08} className="mt-8 flex flex-col items-center gap-6 text-center">
        <p className={cn(LEAD, 'mx-auto')}>Each signal is a dated record in a public source. The examples describe kinds of companies, not real ones.</p>
        <ActionLink href="#evidence">See how a lead is scored</ActionLink>
      </Reveal>
      <Reveal className={CONTENT_GAP}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured !== undefined && (
            <li className="sm:col-span-2">
              <BentoCard noise containerClassName={cn('bg-primary text-primary-foreground', LIFT)} className={cn(GLOW, 'flex min-h-[24rem] flex-col p-7 sm:p-10 lg:min-h-[22rem]')}>
                <div className="relative z-10 flex max-w-sm flex-col gap-4">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
                    <SignalIcon signal={featured} />
                  </span>
                  <h3 className={cn(TITLE, 'text-2xl lg:text-3xl')}>{featured.name}</h3>
                  <p className="max-w-[36ch] text-base/6 font-medium text-primary-foreground/85">{featured.example}</p>
                  <p className="font-mono text-[12px] text-primary-foreground/75">{featured.sources}</p>
                </div>
                {/* Supabase-style line art: a large outlined bank (the lender behind the registered charge), cropped by the corner. */}
                <Iconoir.Bank className={cn(LINE_ART, '-right-10 -bottom-16 size-[20rem] text-primary-foreground/30 lg:size-[24rem]')} />
              </BentoCard>
            </li>
          )}
          {side !== undefined && (
            <li className="sm:col-span-2 lg:col-span-1">
              <BentoCard noise containerClassName={cn(NIGHT, LIFT)} className={cn(GLOW, 'flex min-h-[18rem] flex-col gap-4 p-7 sm:p-10')}>
                {/* Supabase-style line art: a large outlined megaphone, cropped by the card's corner. */}
                <Iconoir.Megaphone className={cn(LINE_ART, '-right-12 -bottom-14 size-72 text-background/30 dark:text-foreground/20')} />
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Iconoir.Megaphone className="size-5" />
                </span>
                <h3 className={cn(TITLE, 'text-xl lg:text-2xl')}>{side.name}</h3>
                <p className={cn('text-base/6 font-medium', NIGHT_MUTED)}>{side.example}</p>
                <p className={cn('mt-auto font-mono text-[12px]', NIGHT_MUTED)}>{side.sources}</p>
              </BentoCard>
            </li>
          )}
          {rest.map((item) => (
            <li key={item.id}>
              <BentoCard containerClassName={cn('border bg-card', LIFT)} className="flex min-h-[15rem] flex-col gap-4 p-7">
                <span className={ICON_TILE}>
                  <SignalIcon signal={item} />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className={cn(TITLE, 'text-lg text-foreground')}>{item.name}</h3>
                  <p className="text-[15px] leading-6 font-medium text-pretty text-muted-foreground">{item.example}</p>
                </div>
                <p className="mt-auto pt-1 font-mono text-[11px] text-muted-foreground">{item.sources}</p>
              </BentoCard>
            </li>
          ))}
          {closing !== undefined && (
            <li className="sm:col-span-2 lg:col-span-3">
              <BentoCard noise containerClassName={cn(NIGHT, LIFT)} className={cn(GLOW, 'min-h-[24rem] p-7 sm:p-10 lg:min-h-[18rem]')}>
                {/* Supabase-style line art: a large outlined contract with a star (awarded), cropped by the card's bottom edge. */}
                <Iconoir.PageStar
                  className={cn(LINE_ART, '-right-10 -bottom-20 size-[20rem] text-background/30 dark:text-foreground/20 lg:right-[8%] lg:-bottom-28 lg:size-[26rem]')}
                />
                <div className="relative z-10 flex max-w-sm flex-col gap-4 xl:max-w-md">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Iconoir.CheckCircle className="size-5" />
                  </span>
                  <h3 className={cn(TITLE, 'text-2xl lg:text-3xl')}>{closing.name}</h3>
                  <p className={cn('max-w-[40ch] text-base/6 font-medium', NIGHT_MUTED)}>{closing.example}</p>
                  <p className={cn('font-mono text-[12px]', NIGHT_MUTED)}>{closing.sources}</p>
                </div>
              </BentoCard>
            </li>
          )}
        </ul>
      </Reveal>
    </Section>
  );
}
