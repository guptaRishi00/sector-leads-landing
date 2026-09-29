import { useId } from 'react';
import { Icons } from '@sl/ui';
import { hostOf } from '@/lib/leads/format';
import type { QueueCard } from '@/lib/queue/view';

export function EvidencePanel({ evidence }: { evidence: QueueCard['evidence'] }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <h3 id={titleId} className="text-sm font-semibold text-foreground">
        Evidence
      </h3>
      <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[13px]">
        <dt className="text-muted-foreground">Signal</dt>
        <dd className="text-foreground">{evidence.trigger}</dd>
        <dt className="text-muted-foreground">Source</dt>
        <dd className="text-foreground">{evidence.source}</dd>
        <dt className="text-muted-foreground">Happened</dt>
        <dd className="text-foreground">
          {evidence.happenedOn !== null && evidence.happenedAt !== null ? (
            <>
              <time dateTime={evidence.happenedAt}>{evidence.happenedOn}</time>
              {evidence.freshness !== null && (
                <span className="text-muted-foreground"> · {evidence.freshness}</span>
              )}
            </>
          ) : (
            'The source gave no date'
          )}
        </dd>
      </dl>
      {evidence.modelDecisions.length > 0 && (
        <div className="flex gap-2 rounded-lg border p-3 text-[13px]">
          <Icons.Info
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
          />
          <ul className="flex flex-col gap-1 text-foreground">
            {evidence.modelDecisions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
      {(evidence.title !== null || evidence.snippet !== null) && (
        <div className="flex flex-col gap-1 rounded-lg border bg-muted/50 p-3 text-[13px]">
          {evidence.title !== null && (
            <p className="font-medium break-words text-foreground">{evidence.title}</p>
          )}
          {evidence.snippet !== null && (
            <p className="break-words whitespace-pre-line text-foreground">{evidence.snippet}</p>
          )}
        </div>
      )}
      {evidence.href !== null ? (
        <a
          href={evidence.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-sm text-[13px] font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          <span className="min-w-0 break-all">Open the source on {hostOf(evidence.href)}</span>
          <Icons.ArrowRight aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <p className="text-[13px] text-muted-foreground">No link to the source was saved.</p>
      )}
    </section>
  );
}
