import { Icons } from '@sl/ui';
import { livePacks } from '@/lib/marketing/live';
import { INDUSTRY_PACKS } from '@/lib/marketing/content';
import { Reveal } from '../reveal';
import { Tabs } from '../tabs';
import { AppWindow, ActionLink, CONTENT_GAP, FrameTitle, Painting, PAINTINGS, Section, SectionHeader } from './ui';

const PackChip = ({ children }: { children: string }) => <li className="rounded-md border bg-card px-2 py-1 text-[13px] text-foreground">{children}</li>;

export function Industries() {
  const packs = livePacks();
  const industries = INDUSTRY_PACKS.map((copy) => ({ ...copy, pack: packs.find((pack) => pack.id === copy.id) }));
  return (
    <Section id="industries" labelledBy="industries-title">
      <SectionHeader
        eyebrow="Industries"
        titleId="industries-title"
        title="Fifteen industries,"
        accent="each with its own rules"
        lead="A pack decides which signals count for your industry, which sources to read and which companies to leave out, such as your competitors and staffing firms."
        action={<ActionLink href="#join">Join the waitlist</ActionLink>}
      />
      <Reveal className={CONTENT_GAP}>
        <Tabs
          vertical
          label="Industry packs"
          autoAdvance={4000}
          tabs={industries.map((industry) => industry.name)}
          panels={industries.map((industry) => (
            <Painting key={industry.id} src={PAINTINGS.lake} className="flex h-full flex-col">
              <AppWindow className="flex-1" innerClassName="flex flex-col">
                <FrameTitle>Industry pack</FrameTitle>
                <div className="flex flex-1 flex-col gap-6 p-4 sm:gap-7 sm:p-8">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-[510] tracking-[-0.022em] text-foreground">{industry.name}</h3>
                    <p className="text-[15px] leading-7 text-pretty text-muted-foreground">
                      <span className="text-foreground">Starts a lead:</span> {industry.watches}
                    </p>
                  </div>
                  {industry.pack !== undefined && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2.5">
                        <h4 className="text-[13px] font-medium text-muted-foreground">Signals on by default</h4>
                        <ul className="flex flex-wrap gap-1.5">
                          {industry.pack.defaultSignals.map((item) => (
                            <PackChip key={item.id}>{item.label}</PackChip>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <h4 className="text-[13px] font-medium text-muted-foreground">Sources it reads</h4>
                        <ul className="flex flex-wrap gap-1.5">
                          {industry.pack.sources.map((item) => (
                            <PackChip key={item.id}>{item.label}</PackChip>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <p className="mt-auto flex items-center gap-2 border-t pt-5 text-[13px] text-muted-foreground">
                    <Icons.Filter aria-hidden="true" className="size-4 shrink-0" />
                    Each signal can be switched on or off, and your competitors and staffing firms are left out.
                  </p>
                </div>
              </AppWindow>
            </Painting>
          ))}
        />
      </Reveal>
    </Section>
  );
}
