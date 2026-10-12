import type { ReactNode } from 'react';
import { cn, Icons } from '@sl/ui';
import { EXAMPLE_LEAD, SIGNAL_TYPES, type SignalType } from '@/lib/marketing/content';
import * as Iconoir from '../iconoir';
import { Reveal, RevealGroup, RevealItem } from '../reveal';
import { AppSidebar } from './product';
import { ActionLink, AppWindow, CONTENT_GAP, ICON_TILE, LEAD, Line, NIGHT, NIGHT_MUTED, Section, SectionHeader, SIGNAL_ICONS, Tag } from './ui';

// A bento after Aceternity's wobble-card demo (still, no hover), with the page's own signals: a wide
// blue feature card and a dark card on the first row, six light cards in two rows of three, and a
// full-width dark card to close. The three coloured cards each carry a cropped piece of the product's
// dashboard off their bottom-right corner (secured loans, tender notices, award notices), which
// replaced large outlined icons the client didn't like. Three columns on lg, two on sm (the dark side
// card goes full width there so the six light cards pair up), one on phones.
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

interface PieceRow {
  cells: readonly ReactNode[];
  highlight?: boolean;
}

const PIECE_GRID = 'grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.7fr)] items-center gap-4 px-5';

/**
 * A cropped piece of the product's dashboard: the whole app screen (the sidebar, a breadcrumb bar
 * and a table of records) drawn far wider and taller than the card, so the card's edges crop it and
 * only its top-left corner shows, as a screenshot would. `className` sizes the crop window, which
 * runs to the card's right and bottom edges. Phones drop the sidebar, which would fill the corner.
 * Illustration only.
 */
function DashboardPiece({
  section,
  title,
  aside,
  columns,
  rows,
  className,
}: {
  section: string;
  title: string;
  aside: ReactNode;
  columns: readonly string[];
  rows: readonly PieceRow[];
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn('relative -mr-7 -mb-7 sm:-mr-10 sm:-mb-10', className)}>
      <div className="absolute top-0 left-0 w-[36rem] text-foreground sm:w-[46rem]">
        <AppWindow shadow innerClassName="flex">
          <AppSidebar className="flex max-sm:hidden" />
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="flex h-11 items-center gap-1.5 border-b px-5 text-[12px] text-muted-foreground">
              {section}
              <Icons.ChevronRight className="size-3" />
              <span className="font-medium text-foreground">{title}</span>
            </p>
            <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
              <p className="text-[15px] font-medium">{title}</p>
              {aside}
            </div>
            <div className={cn(PIECE_GRID, 'border-y bg-muted/50 py-2 font-mono text-[10.5px] text-muted-foreground uppercase')}>
              {columns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
            <ul className="divide-y pb-24">
              {rows.map((row, index) => (
                <li key={index} className={cn(PIECE_GRID, 'py-3 text-[12.5px]', row.highlight === true && 'bg-selected')}>
                  {row.cells.map((cell, column) => (
                    <span key={column} className="min-w-0 truncate">
                      {cell}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </AppWindow>
      </div>
    </div>
  );
}

/** A row still loading: grey bars in each column but the source. */
const skeleton = (source: ReactNode, widths: readonly [string, string, string] = ['w-4/5', 'w-3/5', 'w-1/2']): PieceRow => ({
  cells: [<Line key="a" className={widths[0]} />, <Line key="b" className={widths[1]} />, source, <Line key="d" className={widths[2]} />],
});

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
      <RevealGroup as="ul" className={cn(CONTENT_GAP, 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3')}>
        {featured !== undefined && (
          <RevealItem as="li" className="sm:col-span-2">
            <BentoCard
              noise
              containerClassName={cn('bg-primary text-primary-foreground', LIFT)}
              className={cn(GLOW, 'flex min-h-[24rem] flex-col gap-8 p-7 sm:p-10 lg:min-h-[22rem] lg:flex-row lg:justify-between')}
            >
              <div className="relative z-10 flex max-w-sm flex-col gap-4 lg:w-sm lg:shrink-0">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <SignalIcon signal={featured} />
                </span>
                <h3 className={cn(TITLE, 'text-2xl lg:text-3xl')}>{featured.name}</h3>
                <p className="max-w-[36ch] text-base/6 font-medium text-primary-foreground/85">{featured.example}</p>
                <p className="font-mono text-[12px] text-primary-foreground/75">{featured.sources}</p>
              </div>
              <DashboardPiece
                section="Signals"
                title="Secured loans"
                aside={<Tag tone="success">Companies House</Tag>}
                columns={['Company', 'Event', 'Registered', 'Status']}
                rows={[
                  {
                    highlight: true,
                    cells: [
                      EXAMPLE_LEAD.descriptor.split(',')[0],
                      EXAMPLE_LEAD.evidence.title,
                      EXAMPLE_LEAD.evidence.happenedOn,
                      <Tag key="s" tone="success">
                        Dated
                      </Tag>,
                    ],
                  },
                  skeleton(<Line className="w-2/3" />),
                  skeleton(<Line className="w-3/4" />, ['w-2/3', 'w-4/5', 'w-2/5']),
                  skeleton(<Line className="w-1/2" />),
                ]}
                className="mt-auto ml-4 h-64 sm:ml-8 lg:mt-10 lg:ml-0 lg:h-auto lg:flex-1 lg:self-stretch"
              />
            </BentoCard>
          </RevealItem>
        )}
        {side !== undefined && (
          <RevealItem as="li" className="sm:col-span-2 lg:col-span-1">
            <BentoCard noise containerClassName={cn(NIGHT, LIFT)} className={cn(GLOW, 'flex min-h-[18rem] flex-col gap-4 p-7 sm:p-10')}>
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Iconoir.Megaphone className="size-5" />
              </span>
              <h3 className={cn(TITLE, 'text-xl lg:text-2xl')}>{side.name}</h3>
              <p className={cn('text-base/6 font-medium', NIGHT_MUTED)}>{side.example}</p>
              <p className={cn('font-mono text-[12px]', NIGHT_MUTED)}>{side.sources}</p>
              <DashboardPiece
                section="Signals"
                title="Tender notices"
                aside={<Tag tone="accent">New</Tag>}
                columns={['Buyer', 'Notice', 'Source', 'Status']}
                rows={[
                  {
                    highlight: true,
                    cells: [
                      'County council',
                      'IT support',
                      'Find a Tender',
                      <Tag key="s" tone="accent">
                        New
                      </Tag>,
                    ],
                  },
                  skeleton('TED'),
                  skeleton('SAM.gov', ['w-2/3', 'w-4/5', 'w-2/5']),
                ]}
                className="mt-auto ml-4 h-52"
              />
            </BentoCard>
          </RevealItem>
        )}
        {rest.map((item) => (
          <RevealItem as="li" key={item.id}>
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
          </RevealItem>
        ))}
        {closing !== undefined && (
          <RevealItem as="li" className="sm:col-span-2 lg:col-span-3">
            <BentoCard
              noise
              containerClassName={cn(NIGHT, LIFT)}
              className={cn(GLOW, 'flex min-h-[24rem] flex-col gap-8 p-7 sm:p-10 lg:min-h-[18rem] lg:flex-row lg:justify-between')}
            >
              <div className="relative z-10 flex max-w-sm flex-col gap-4 lg:w-sm lg:shrink-0 xl:w-md xl:max-w-md">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Iconoir.CheckCircle className="size-5" />
                </span>
                <h3 className={cn(TITLE, 'text-2xl lg:text-3xl')}>{closing.name}</h3>
                <p className={cn('max-w-[40ch] text-base/6 font-medium', NIGHT_MUTED)}>{closing.example}</p>
                <p className={cn('font-mono text-[12px]', NIGHT_MUTED)}>{closing.sources}</p>
              </div>
              <DashboardPiece
                section="Signals"
                title="Award notices"
                aside={<span className="font-mono text-[11px] text-muted-foreground">{closing.sources.split(', ').length} sources</span>}
                columns={['Supplier', 'Contract', 'Source', 'Status']}
                rows={[
                  {
                    highlight: true,
                    cells: [
                      'Mid-sized contractor',
                      'Public roads',
                      'Find a Tender',
                      <Tag key="s" tone="success">
                        Awarded
                      </Tag>,
                    ],
                  },
                  skeleton('TED'),
                  skeleton('SAM.gov', ['w-2/3', 'w-4/5', 'w-2/5']),
                ]}
                className="mt-auto ml-4 h-64 sm:ml-8 lg:mt-10 lg:ml-0 lg:h-auto lg:w-[36rem] lg:self-stretch"
              />
            </BentoCard>
          </RevealItem>
        )}
      </RevealGroup>
    </Section>
  );
}
