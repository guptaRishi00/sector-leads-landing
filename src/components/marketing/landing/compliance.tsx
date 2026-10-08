import { cn, Icons } from '@sl/ui';
import { SEND_GATES } from '@/lib/marketing/content';
import { RevealGroup, RevealItem } from '../reveal';
import { SendChart } from '../send-chart';
import { CONTENT_GAP, Section, SectionHeader } from './ui';

type LucideIcon = Icons.LucideIcon;

const GUARANTEES: readonly { title: string; icon: LucideIcon; body: string }[] = [
  {
    title: 'Your own database',
    icon: Icons.Database,
    body: 'Connect your own Postgres and your leads, contacts and messages are stored there. Every workspace is isolated by row-level security.',
  },
  {
    title: 'Lift you can measure',
    icon: Icons.ChartColumn,
    body: 'A holdout group, 12% of accounts by default, is never contacted. Results compares the two, so you see what outreach added.',
  },
  {
    title: 'Suppression that sticks',
    icon: Icons.Ban,
    body: 'Unsubscribes, complaints and hard bounces suppress the address. Every email carries a one-click unsubscribe and your postal address.',
  },
  {
    title: 'Inbound in the same inbox',
    icon: Icons.Inbox,
    body: 'Your website form, Meta and LinkedIn lead ads and WhatsApp land in one inbox, routed by your rules and answered within the same limits as outbound.',
  },
];

/** What each gate checks, in the words the rest of the page uses (the FAQ, the guarantees). */
const GATE_NOTES: Record<string, string> = {
  'Suppression lists': 'Unsubscribes, complaints and hard bounces are never emailed again.',
  'Legal basis for the country': 'Checks the basis for contact set for the recipient’s country.',
  'Fresh address verification': 'The address is verified again before it sends.',
  'Mailbox health and bounce breaker': 'Pauses your mailbox if its health drops or bounces climb.',
  'Daily caps': 'Keeps each mailbox within the daily limit you set.',
  'Complaint breaker': 'Stops sending if complaints rise.',
  'Business hours and holidays': 'Sends in the recipient’s business hours, never on a public holiday.',
};

const HOLIDAY_COUNTRIES = ['Australia', 'Canada', 'France', 'Germany', 'India', 'Ireland', 'Singapore', 'the UAE', 'the UK', 'the US'];

/** The figures under the chart, each a claim the page already makes. */
const FACTS: readonly { value: string; label: string; icon: LucideIcon }[] = [
  { value: String(SEND_GATES.length), label: 'gates on every send', icon: Icons.ShieldCheck },
  { value: '12%', label: 'holdout, never contacted', icon: Icons.ChartColumn },
  { value: '1-click', label: 'unsubscribe in every email', icon: Icons.Ban },
  { value: String(HOLIDAY_COUNTRIES.length), label: 'countries’ holidays built in', icon: Icons.CalendarCheck },
];

// An example month, shape only (the chart shows no values): weekdays busier than weekends, a few held each day.
const SEND_DAYS = Array.from({ length: 30 }, (_, day) => {
  const weekend = day % 7 >= 5;
  const sent = (60 + 14 * Math.sin(day * 0.9) + 8 * Math.cos(day * 0.37)) * (weekend ? 0.55 : 1);
  return { day: `Day ${day + 1}`, Sent: Math.round(sent), Held: Math.round(6 + 6 * Math.abs(Math.sin(day * 1.7))) };
});

/** A soft blue card, the same treatment as the Workspace's queue cards: no shadow. */
const CARD = 'rounded-2xl border border-selected-border/60 bg-linear-to-br from-selected via-selected/40 to-card';

const IconTile = ({ icon: Icon, className }: { icon: LucideIcon; className?: string }) => (
  <span className={cn('inline-flex shrink-0 items-center justify-center rounded-lg border border-selected-border/70 bg-card text-primary', className)}>
    <Icon aria-hidden="true" className="size-[45%]" strokeWidth={1.75} />
  </span>
);

export function Compliance() {
  return (
    // The guarantees as a row of cards, then the proof side by side: an example send overview (sent
    // against held by a gate, and the figures behind it) and the gates themselves as a checklist.
    <Section id="compliance" labelledBy="compliance-title">
      <SectionHeader
        eyebrow="Compliance"
        titleId="compliance-title"
        title="Built to send within the law,"
        accent="and to keep your data yours"
        lead="The rules are in the product, not in a policy document. When a check fails, the email waits."
      />
      <RevealGroup className={cn(CONTENT_GAP, 'flex flex-col gap-4')}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item) => (
            <RevealItem as="li" key={item.title} className={cn(CARD, 'flex flex-col gap-3 p-5')}>
              <IconTile icon={item.icon} className="size-10" />
              <h3 className="text-base font-medium text-foreground">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-pretty text-muted-foreground">{item.body}</p>
            </RevealItem>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* An example send overview: illustration only. */}
          <RevealItem aria-hidden className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-medium text-foreground">Send overview</p>
                <p className="text-[12px] text-muted-foreground">An example month, no real data</p>
              </div>
              <span className="flex gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  Sent
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground/25" />
                  Held by a gate
                </span>
              </span>
            </div>
            <SendChart data={SEND_DAYS} className="min-h-40 flex-1 sm:min-h-48" />
            <dl className="grid grid-cols-2 gap-3">
              {FACTS.map((fact) => (
                <div key={fact.label} className={cn(CARD, 'flex items-center gap-3 rounded-xl p-3')}>
                  <IconTile icon={fact.icon} className="size-9 max-sm:hidden" />
                  <div className="flex min-w-0 flex-col">
                    <dt className="order-2 text-[11.5px] leading-snug text-muted-foreground">{fact.label}</dt>
                    <dd className="order-1 font-display text-lg font-medium tracking-tight text-foreground tabular-nums">{fact.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </RevealItem>

          {/* The gates, as the product checks them before every send. */}
          <RevealItem className="flex flex-col rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-medium text-foreground">{SEND_GATES.length} send gates</p>
                <p className="text-[12px] text-muted-foreground">Checked in this order. One fails: the email waits.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-[12px] font-medium text-success">
                <Icons.CircleCheck aria-hidden="true" className="size-3.5" />
                All passed: sent
              </span>
            </div>
            <ol className="mt-4 flex flex-col divide-y">
              {SEND_GATES.map((gate, index) => (
                <li key={gate} className="grid grid-cols-[1.75rem_1.25rem_minmax(0,1fr)_auto] items-start gap-3 py-2.5">
                  <span className="mt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true" className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-success text-background">
                    <Icons.Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[13.5px] font-medium text-foreground">{gate}</span>
                    <span className="text-[12px] leading-snug text-pretty text-muted-foreground">{GATE_NOTES[gate]}</span>
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    <Icons.Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
                    Pass
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex gap-2 rounded-xl bg-selected px-3.5 py-3 text-[12px] leading-relaxed text-pretty text-muted-foreground">
              <Icons.Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                A send that fails more than one gate reports the first. Legal basis is set per country; public holidays are built in for {HOLIDAY_COUNTRIES.slice(0, -1).join(', ')}{' '}
                and {HOLIDAY_COUNTRIES.at(-1)}.
              </span>
            </p>
          </RevealItem>
        </div>
      </RevealGroup>
    </Section>
  );
}
