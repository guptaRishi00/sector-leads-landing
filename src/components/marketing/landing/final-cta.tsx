import { cn } from '@sl/ui';
import { GUTTER } from '../marketing-shell';
import { Reveal } from '../reveal';
import { WaitlistForm } from '../waitlist-form';
import { BEZEL, Chip, EDGE, INNER, LEAD, RAIL, SCREEN_SHADOW, TrustRow } from './ui';

export function FinalCta({ token }: { token: string }) {
  return (
    // The page's one form (the hero links here), in Attio's closing dark chapter: centred heading,
    // then the form in a bezel. Tokens are scoped dark, so the form keeps AA contrast as it does in
    // dark mode.
    <section id="join" aria-labelledby="final-title" data-theme="dark" className={cn('scroll-mt-18 bg-sidebar text-foreground', GUTTER)}>
      <div className={RAIL}>
        <div className={cn(INNER, 'flex flex-col items-center gap-10 py-20 sm:gap-14 sm:py-28 lg:py-32')}>
          <Reveal className="flex max-w-3xl flex-col items-center gap-5 text-center">
            <Chip>Join the waitlist</Chip>
            <h2 id="final-title" className="text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-[3.5rem] sm:leading-none">
              Get early access
            </h2>
            <p className={cn(LEAD, 'mx-auto')}>
              We haven&apos;t opened access yet. Leave your email and we&apos;ll write when yours is ready. You can remove yourself with one link.
            </p>
            <TrustRow className="justify-center" />
          </Reveal>
          <Reveal delay={0.08} className={cn(BEZEL, 'w-full max-w-2xl')}>
            <div className={cn('rounded-xl border bg-card p-5 sm:p-8', SCREEN_SHADOW, EDGE)}>
              <WaitlistForm token={token} source="landing-final" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
