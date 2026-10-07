import { cn, Icons } from '@sl/ui';
import { SEND_GATES } from '@/lib/marketing/content';
import { ArcDraw } from '../arc-draw';
import { Reveal } from '../reveal';
import { CONTENT_GAP, EDGE, ICON_TILE, SCREEN_SHADOW, Section, SectionHeader } from './ui';

const GUARANTEES: readonly { title: string; icon: keyof typeof GUARANTEE_ICONS; body: string }[] = [
  {
    title: 'Your own database',
    icon: 'Database',
    body: 'Connect your own Postgres and your leads, contacts and messages are stored there. Every workspace is isolated by row-level security.',
  },
  {
    title: 'Lift you can measure',
    icon: 'ChartColumn',
    body: 'A holdout group, 12% of accounts by default, is never contacted. Results compares the two, so you see what outreach added.',
  },
  {
    title: 'Suppression that sticks',
    icon: 'Ban',
    body: 'Unsubscribes, complaints and hard bounces suppress the address. Every email carries a one-click unsubscribe and your postal address.',
  },
  {
    title: 'Inbound in the same inbox',
    icon: 'Inbox',
    body: 'Your website form, Meta and LinkedIn lead ads and WhatsApp land in one inbox, routed by your rules and answered within the same limits as outbound.',
  },
];

const GUARANTEE_ICONS = { Database: Icons.Database, ChartColumn: Icons.ChartColumn, Ban: Icons.Ban, Inbox: Icons.Inbox } as const;

export function Compliance() {
  return (
    // Attio's dark chapter: the same tokens, scoped dark (see Section). A centred statement over a
    // horizon line that draws itself on scroll, the send log under it, then the guarantees as one
    // wall of hairline cells.
    <Section id="compliance" labelledBy="compliance-title" dark>
      <SectionHeader
        center
        statement
        eyebrow="Compliance"
        titleId="compliance-title"
        title="Built to send within the law, and to keep your data yours"
        lead="The rules are in the product, not in a policy document. When a check fails, the email waits."
        className="max-w-4xl"
      />
      <ArcDraw className="mx-auto mt-12 h-24 w-full max-w-5xl sm:mt-16 sm:h-36" />
      <Reveal className="relative mx-auto -mt-10 flex max-w-2xl flex-col gap-4 sm:-mt-16">
        <div className={cn('overflow-hidden rounded-xl border bg-card', SCREEN_SHADOW, EDGE)}>
          <div className="flex items-center justify-between gap-3 border-b px-5 py-3 text-xs">
            <span className="font-medium text-foreground">Every send, from your own mailbox</span>
            <span className="text-muted-foreground">{SEND_GATES.length} gates, in order</span>
          </div>
          <ol className="flex flex-col px-5 py-3 font-mono text-[13px] text-foreground">
            {SEND_GATES.map((gate, index) => (
              <li key={gate} className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 py-1.5">
                <span className="text-muted-foreground tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <span className="truncate">{gate}</span>
                <span className="inline-flex items-center gap-1 text-success">
                  <Icons.Check aria-hidden="true" className="size-3.5" />
                  pass
                </span>
              </li>
            ))}
          </ol>
          <p className="flex items-center gap-2 border-t px-5 py-3 text-[13px] font-medium text-foreground">
            <Icons.Send aria-hidden="true" className="size-4" />
            All passed: sent. One fails: the email waits.
          </p>
        </div>
        <p className="px-1 text-center text-[13px] font-medium text-pretty text-muted-foreground">
          A send that fails more than one gate reports the first. Legal basis is set per country; public holidays are built in for Australia, Canada, France, Germany, India, Ireland, Singapore, the UAE, the UK and the US.
        </p>
      </Reveal>
      <Reveal className={CONTENT_GAP}>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item) => {
            const Icon = GUARANTEE_ICONS[item.icon];
            return (
              <li key={item.title} className="flex flex-col gap-10 bg-sidebar p-6 sm:p-7">
                <span className={ICON_TILE}>
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm leading-6 font-medium text-pretty text-muted-foreground">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
