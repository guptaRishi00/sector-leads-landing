import { AutomationFlow } from '../automation-flow';
import { Reveal } from '../reveal';
import { AppWindow, CONTENT_GAP, Painting, PAINTINGS, Section, SectionHeader } from './ui';

/** Automation: Attio's workflow canvas, run the way Attio runs it (AutomationFlow, a client island). */
export function Automation() {
  return (
    <Section id="automation" labelledBy="automation-title">
      <SectionHeader
        eyebrow="Automation"
        titleId="automation-title"
        title="The reading is automated."
        accent="The decisions stay with you."
        lead="Rules and a narrow model read the public record, check each event and score what qualifies. Then it stops: nothing moves past a lead or a draft until a person approves it."
      />
      <Reveal className={CONTENT_GAP}>
        <Painting src={PAINTINGS.lake}>
          <AppWindow>
            <AutomationFlow />
          </AppWindow>
        </Painting>
      </Reveal>
    </Section>
  );
}
