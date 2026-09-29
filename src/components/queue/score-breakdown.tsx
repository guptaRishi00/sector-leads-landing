import { useId } from 'react';
import { pointsText } from '@/lib/leads/format';
import type { QueueCard } from '@/lib/queue/view';

function share(points: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (points / max) * 100));
}

export function ScoreBreakdown({ score }: { score: QueueCard['score'] }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-sm font-semibold text-foreground">
          Why it scored {score.text}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          <span className="font-mono text-base font-semibold text-foreground tabular-nums">
            {score.text}
          </span>{' '}
          of {score.max}
        </p>
      </div>
      {score.lines.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">No breakdown was saved for this score.</p>
      ) : (
        <ul aria-label="Score breakdown" className="flex flex-col gap-3">
          {score.lines.map((line) => (
            <li key={line.id} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="font-medium text-foreground">{line.label}</span>
                <span className="shrink-0 font-mono text-foreground tabular-nums">
                  {pointsText(line.points)}
                  <span className="text-muted-foreground"> of {line.max}</span>
                </span>
              </div>
              <div
                aria-hidden="true"
                className="h-1.5 overflow-hidden rounded-full bg-progress-track"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${share(line.points, line.max)}%` }}
                />
              </div>
              <p className="text-[13px] text-muted-foreground">{line.why}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
