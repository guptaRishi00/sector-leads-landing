import { cn, Icons } from '@sl/ui';
import { EXAMPLE_SCORE, REJECT_EXAMPLES } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { AppWindow, FrameTitle, MONO_LABEL, Section, SectionHeader, Tag } from './ui';

/**
 * Evidence, as Leadistry's "Every lead is checked before you pay": the header and the example
 * lead's score as a ticked checklist (each part with its points and its reason) on the left, the
 * records kept with their reject reason in a product window on the right.
 */
export function Proof() {
  return (
    <Section id="evidence" labelledBy="proof-title">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-20">
        <div className="flex flex-col gap-10">
          <SectionHeader
            eyebrow="Evidence"
            titleId="proof-title"
            title="Every lead"
            accent="shows its work"
            lead="Five parts add up to the score, and each one says why. Records that don't qualify are kept with the reason, so you can check the rules instead of trusting them."
          />
          <Reveal delay={0.08} className="flex flex-col gap-5">
            <p className={cn(MONO_LABEL, 'text-muted-foreground')}>
              Example lead · {EXAMPLE_SCORE.text} of {EXAMPLE_SCORE.max}
            </p>
            <ul className="flex flex-col gap-4">
              {EXAMPLE_SCORE.lines.map((line) => (
                <li key={line.id} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3">
                  <Icons.Check aria-hidden="true" className="mt-0.5 size-4 text-primary" strokeWidth={2.5} />
                  <div className="flex flex-col gap-1">
                    <p className="flex items-baseline justify-between gap-4 font-medium text-foreground">
                      {line.label}
                      <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                        {line.points} of {line.max}
                      </span>
                    </p>
                    <p className="text-sm leading-6 text-pretty text-muted-foreground">{line.why}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        {/* From lg the window is as tall as the column beside it; its rows share the height. */}
        <Reveal delay={0.12} className="lg:h-full">
          <AppWindow shadow className="lg:h-full" innerClassName="flex flex-col">
            <FrameTitle aside={<Tag>Kept, not contacted</Tag>}>Rejected, with the reason</FrameTitle>
            <ul className="flex flex-1 flex-col divide-y">
              {REJECT_EXAMPLES.map((reason) => (
                <li key={reason.code} className="flex items-center gap-3 px-5 py-3.5 sm:px-6 lg:flex-1">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icons.Ban aria-hidden="true" className="size-3.5" />
                  </span>
                  <p className="min-w-0 flex-1 text-sm text-foreground">{reason.label}</p>
                  <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{reason.code}</span>
                </li>
              ))}
            </ul>
          </AppWindow>
        </Reveal>
      </div>
    </Section>
  );
}
