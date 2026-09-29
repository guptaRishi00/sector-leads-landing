import type { ReactNode } from 'react';
import { cn } from '@sl/ui';
import { CONTAINER, MarketingShell } from './marketing-shell';

/** A short public page: legal drafts and the waitlist's remove flow. */
export function SimplePage({ title, intro, draft = false, children }: { title: string; intro?: ReactNode; draft?: boolean; children?: ReactNode }) {
  return (
    <MarketingShell>
      <article className={cn(CONTAINER, 'flex max-w-3xl flex-col gap-6 py-16 sm:py-24')}>
        {draft && (
          <p className="w-fit rounded-md border border-warning-border bg-warning-soft px-2.5 py-1 text-[13px] font-medium text-warning-foreground">
            Draft: not yet in force
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h1>
        {intro !== undefined && <div className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{intro}</div>}
        {children !== undefined && <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-pretty text-foreground/90">{children}</div>}
      </article>
    </MarketingShell>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
