import { Icons } from '@sl/ui';
import { FAQ } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { Section, SectionHeader } from './ui';

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <SectionHeader eyebrow="FAQ" titleId="faq-title" title="Questions" className="lg:sticky lg:top-28 lg:self-start" />
        <Reveal delay={0.08} className="divide-y">
          {FAQ.map((item) => (
            <details key={item.id} name="faq" className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-6 text-[17px] font-medium text-foreground transition-colors outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                {item.question}
                <Icons.Plus aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-open:text-primary motion-reduce:transition-none" />
              </summary>
              <p className="max-w-[65ch] pb-6 text-[15px] leading-relaxed font-medium text-pretty text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
