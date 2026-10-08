import { cn } from '@sl/ui';
import { GUTTER } from '../marketing-shell';
import { Reveal } from '../reveal';
import { WaitlistForm } from '../waitlist-form';
import { Chip, EDGE, INNER, LEAD, MONO_LABEL, RAIL, SCREEN_SHADOW, TRUST } from './ui';

export function FinalCta({ token }: { token: string }) {
  return (
    // The page's one form (the hero links here), as Leadistry's closing: a large centred heading
    // with its closing word in the accent, the lead, the email-first form in a card, and the promises as mono
    // fine print.
    <section id="join" aria-labelledby="final-title" className={cn('scroll-mt-18 border-b', GUTTER)}>
      <div className={RAIL}>
        <div className={cn(INNER, 'flex flex-col items-center gap-10 py-24 sm:gap-12 sm:py-32 lg:py-40')}>
          <Reveal className="flex max-w-3xl flex-col items-center gap-5 text-center">
            <Chip>Join the waitlist</Chip>
            <h2 id="final-title" className="font-display text-[2.75rem] leading-[1] font-medium tracking-[-0.025em] text-balance text-foreground sm:text-6xl lg:text-[4.5rem]">
              Get <span className="text-primary">early access</span>
            </h2>
            <p className={cn(LEAD, 'mx-auto')}>
              We haven&apos;t opened access yet. Leave your email and we&apos;ll write when yours is ready. You can remove yourself with one link.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="w-full max-w-2xl">
            <div className={cn('rounded-2xl border bg-card p-5 text-left sm:p-8', SCREEN_SHADOW, EDGE)}>
              <WaitlistForm token={token} source="landing-final" compact />
            </div>
          </Reveal>
          <p className={cn(MONO_LABEL, 'max-w-3xl text-center leading-[1.8] text-muted-foreground')}>{TRUST.join(' · ')}</p>
        </div>
      </div>
    </section>
  );
}
