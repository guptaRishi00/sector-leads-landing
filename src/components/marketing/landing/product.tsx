import { cn, Icons } from '@sl/ui';
import { EvidencePanel } from '@/components/queue/evidence-panel';
import { BRAND_NAME } from '@/lib/marketing/brand';
import { EXAMPLE_LEAD, EXAMPLE_SCORE, INDUSTRY_PACKS, REJECT_EXAMPLES } from '@/lib/marketing/content';

/** The events feeding the queue, as the product logs them: source, event, what the rules did. From content only. */
export const HERO_FEED: readonly { source: string; event: string; outcome: string; lead?: boolean }[] = [
  { source: 'Companies House', event: EXAMPLE_LEAD.evidence.title ?? EXAMPLE_LEAD.evidence.trigger, outcome: `Lead, ${EXAMPLE_SCORE.text}`, lead: true },
  { source: 'Find a Tender', event: 'Tender published', outcome: 'Scoring' },
  { source: 'SEC EDGAR', event: 'Form D filed', outcome: 'Scoring' },
  ...REJECT_EXAMPLES.filter((reason) => reason.code === 'staffing_firm' || reason.code === 'own_industry').map((reason) => ({
    source: 'Rules',
    event: reason.label,
    outcome: 'Rejected',
  })),
];

const WORKSPACE_NAV: readonly { label: string; icon: keyof typeof WORKSPACE_ICONS; badge?: string }[] = [
  { label: 'Approval queue', icon: 'ListChecks', badge: '3' },
  { label: 'Inbox', icon: 'Inbox' },
  { label: 'Results', icon: 'ChartColumn' },
  { label: 'Industry packs', icon: 'Filter' },
  { label: 'Sending', icon: 'Send' },
];

const WORKSPACE_ICONS = { ListChecks: Icons.ListChecks, Inbox: Icons.Inbox, ChartColumn: Icons.ChartColumn, Filter: Icons.Filter, Send: Icons.Send } as const;

/**
 * The product's sidebar, shared by the hero window and the Workspace dashboard. Decorative. With
 * `chrome` (the hero) it takes Attio's app chrome: white, a workspace switcher with a collapse
 * control, then a quick-actions field and a search box above the navigation.
 */
export function AppSidebar({ packs = false, chrome = false, className }: { packs?: boolean; chrome?: boolean; className?: string }) {
  return (
    <aside aria-hidden="true" className={cn('shrink-0 flex-col gap-1 border-r p-3', chrome ? 'w-60 bg-card' : 'w-52 bg-sidebar', className)}>
      {chrome ? (
        <>
          <div className="flex items-center justify-between gap-2 px-1 pt-0.5 pb-3">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-foreground text-background">
                <Icons.Radar className="size-3.5" strokeWidth={2.25} />
              </span>
              {BRAND_NAME}
              <Icons.ChevronDown className="size-3.5 text-muted-foreground" />
            </p>
            <Icons.PanelLeft className="size-4 text-muted-foreground" />
          </div>
          <div className="mb-2 flex gap-1.5">
            <span className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border px-2 text-[13px] font-medium text-foreground">
              <span className="inline-flex size-4 shrink-0 items-center justify-center rounded border text-[9px] text-muted-foreground">K</span>
              <span className="truncate">Quick actions</span>
              <span className="ml-auto text-[11px] text-muted-foreground">{'\u2318K'}</span>
            </span>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border text-muted-foreground">
              <Icons.Search className="size-3.5" />
            </span>
          </div>
        </>
      ) : (
        <p className="flex items-center gap-2 px-2 pt-1 pb-3 text-sm font-medium text-foreground">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icons.Radar className="size-3.5" strokeWidth={2.25} />
          </span>
          {BRAND_NAME}
        </p>
      )}
      {WORKSPACE_NAV.map((item, index) => {
        const Icon = WORKSPACE_ICONS[item.icon];
        return (
          <span
            key={item.label}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]',
              index === 0 ? cn('font-medium text-foreground', chrome ? 'bg-muted' : 'bg-card shadow-xs ring-1 ring-border') : 'text-muted-foreground',
            )}
          >
            <Icon className="size-4" />
            {item.label}
            {item.badge !== undefined && <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{item.badge}</span>}
          </span>
        );
      })}
      {packs && (
        <>
          <p className="mt-5 px-2 pb-1 text-[11px] font-medium text-muted-foreground">Industry packs</p>
          {INDUSTRY_PACKS.slice(0, 3).map((pack) => (
            <span key={pack.id} className="truncate rounded-md px-2 py-1.5 text-[13px] text-muted-foreground">
              {pack.name}
            </span>
          ))}
        </>
      )}
    </aside>
  );
}

/** Leads in the example queue that aren't rejected (the lead and the two being scored). */
const QUEUE_COUNT = HERO_FEED.filter((row) => !row.outcome.startsWith('Rejected')).length;

/** The example lead, framed as the product's approval queue. Illustration only: nothing in it is interactive. */
export function LeadWindow() {
  return (
    <section aria-labelledby="example-lead-title" className="flex min-w-0 flex-1 flex-col bg-card text-left">
      {/* Attio's two header rows: a breadcrumb with the utilities on the right, then tabs with the
          actions on the right. Decorative apart from the heading. */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-1.5 text-[13px]">
          <Icons.ListChecks aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <h2 id="example-lead-title" className="shrink-0 font-medium text-muted-foreground">
            Approval queue
          </h2>
          <span aria-hidden="true" className="flex min-w-0 items-center gap-1.5">
            <Icons.ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-medium text-foreground">Lead 1 of {QUEUE_COUNT}</span>
            <Icons.Star className="size-3.5 shrink-0 text-muted-foreground" />
          </span>
        </div>
        <span aria-hidden="true" className="flex shrink-0 items-center gap-3 text-muted-foreground">
          <Icons.CircleHelp className="size-4" />
          <Icons.EllipsisVertical className="size-4" />
        </span>
      </div>
      <div aria-hidden="true" className="flex h-12 shrink-0 items-center justify-between gap-3 border-b px-3 sm:px-4">
        <span className="flex items-center gap-1 text-[13px] font-medium">
          <span className="relative inline-flex h-8 items-center gap-1.5 rounded-lg bg-muted px-2.5 text-foreground">
            <Icons.Inbox className="size-3.5" />
            Waiting
            <span className="text-[11px] text-muted-foreground tabular-nums">{QUEUE_COUNT}</span>
            <span className="absolute inset-x-1 -bottom-2 h-0.5 rounded-full bg-foreground" />
          </span>
          <span className="hidden h-8 items-center gap-1.5 px-2.5 text-muted-foreground xl:inline-flex">
            <Icons.Check className="size-3.5" />
            Approved
          </span>
          <span className="hidden h-8 items-center gap-1.5 px-2.5 text-muted-foreground xl:inline-flex">
            <Icons.Ban className="size-3.5" />
            Rejected
          </span>
        </span>
        <span className="flex shrink-0 gap-1.5">
          <span className="inline-flex h-8 items-center rounded-lg border bg-card px-3 text-[13px] font-medium text-foreground">Reject</span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground">
            <Icons.Check className="size-3.5" />
            Approve
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-base font-medium text-pretty text-foreground sm:text-lg">{EXAMPLE_LEAD.descriptor}</p>
          <p className="flex shrink-0 flex-col items-end">
            <span className="font-mono text-2xl font-medium text-foreground tabular-nums">{EXAMPLE_SCORE.text}</span>
            <span className="text-xs text-muted-foreground">score of {EXAMPLE_SCORE.max}</span>
          </p>
        </div>
        <p className="flex items-center gap-2 rounded-lg border border-highlight/30 bg-highlight-soft px-3 py-2.5 text-[13px] text-highlight-foreground">
          <Icons.Inbox aria-hidden="true" className="size-4 shrink-0" />
          Waiting for a person to decide.
        </p>
        <div className="border-t pt-5">
          <EvidencePanel evidence={EXAMPLE_LEAD.evidence} />
        </div>
      </div>
    </section>
  );
}
