import { Icons } from '@sl/ui';
import { ScoreBreakdown } from '@/components/queue/score-breakdown';
import { EXAMPLE_SCORE, REJECT_EXAMPLES } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { AppWindow, CONTENT_GAP, FrameTitle, Section, SectionHeader, Tag } from './ui';

export function Proof() {
  return (
    <Section id="evidence" labelledBy="proof-title" band>
      <SectionHeader
        eyebrow="Evidence"
        titleId="proof-title"
        title="Every lead shows its work"
        lead="Five parts add up to the score, and each one says why. Records that don't qualify are kept with the reason, so you can check the rules instead of trusting them."
      />
      <Reveal className={CONTENT_GAP}>
        <AppWindow shadow innerClassName="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col">
            <FrameTitle aside={<Tag tone="accent">Example lead</Tag>}>Score, line by line</FrameTitle>
            <div className="p-4 sm:p-7">
              <ScoreBreakdown score={EXAMPLE_SCORE} />
            </div>
          </div>
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l">
            <FrameTitle aside={<Tag>Kept, not contacted</Tag>}>Rejected, with the reason</FrameTitle>
            <ul className="flex flex-1 flex-col divide-y">
              {REJECT_EXAMPLES.map((reason) => (
                <li key={reason.code} className="flex flex-1 items-center gap-3 px-5 py-3.5 sm:px-7">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icons.Ban aria-hidden="true" className="size-3.5" />
                  </span>
                  <p className="min-w-0 flex-1 text-sm text-foreground">{reason.label}</p>
                  <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{reason.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </AppWindow>
      </Reveal>
    </Section>
  );
}
