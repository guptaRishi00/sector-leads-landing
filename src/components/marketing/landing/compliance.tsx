import { cn } from '@sl/ui';
import { SEND_GATES } from '@/lib/marketing/content';
import * as Iconoir from '../iconoir';
import { Reveal } from '../reveal';
import { CONTENT_GAP, EDGE, SCREEN_SHADOW, Section, SectionHeader } from './ui';

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

/** Iconoir's thin line icons on the dark panel. */
const GUARANTEE_ICONS = { Database: Iconoir.Database, ChartColumn: Iconoir.StatUp, Ban: Iconoir.Prohibition, Inbox: Iconoir.MailIn } as const;

export function Compliance() {
  return (
    // Leadistry's dark panel ("It doesn't stop at send"): the header on the page, then one dark,
    // rounded panel (dark tokens scoped to it) with the guarantees as ruled steps on the left and
    // the send log on the right.
    <Section id="compliance" labelledBy="compliance-title">
      <SectionHeader
        eyebrow="Compliance"
        titleId="compliance-title"
        title="Built to send within the law,"
        accent="and to keep your data yours"
        lead="The rules are in the product, not in a policy document. When a check fails, the email waits."
      />
      <Reveal className={CONTENT_GAP}>
        <div
          data-theme="dark"
          className="grid grid-cols-1 items-center gap-10 rounded-2xl border bg-sidebar p-6 text-foreground sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-12"
        >
          <ul className="flex flex-col gap-8">
            {GUARANTEES.map((item) => {
              const Icon = GUARANTEE_ICONS[item.icon];
              return (
                <li key={item.title} className="flex flex-col gap-2 border-l-2 border-primary/60 pl-5">
                  <h3 className="flex items-center gap-2 text-lg font-medium text-foreground">
                    <Icon className="size-5 shrink-0 text-primary" />
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-pretty text-muted-foreground">{item.body}</p>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-4">
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
                      <Iconoir.Check className="size-3.5" strokeWidth={1.4} />
                      pass
                    </span>
                  </li>
                ))}
              </ol>
              <p className="flex items-center gap-2 border-t px-5 py-3 text-[13px] font-medium text-foreground">
                <Iconoir.Send className="size-4" />
                All passed: sent. One fails: the email waits.
              </p>
            </div>
            <p className="px-1 text-[13px] text-pretty text-muted-foreground">
              A send that fails more than one gate reports the first. Legal basis is set per country; public holidays are built in for Australia, Canada, France, Germany, India,
              Ireland, Singapore, the UAE, the UK and the US.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
