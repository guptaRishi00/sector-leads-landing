import { SEND_GATES, STEPS } from '@/lib/marketing/content';
import { StepShowcase, type ShowcaseStep, type UseIcon } from '../step-showcase';
import type { DemoId } from '../step-demos';
import { SOURCES } from './proof-bar';
import { Reveal } from '../reveal';
import { CONTENT_GAP, Section, SectionHeader, sentence } from './ui';

/** An icon per public source; any other source gets the globe. */
const SOURCE_ICONS: Partial<Record<string, UseIcon>> = {
  'Find a Tender': 'tender',
  TED: 'europe',
  'SAM.gov': 'government',
  'Companies House': 'registry',
  'SEC EDGAR': 'filings',
};

/**
 * Per step: what the person asks for (the dark bubble over the picture) and what the step uses, each
 * from claims the page already makes (the sources, the rules and the narrow model, the cited source,
 * the send gates and your own mailbox).
 */
const SHOWCASE: Record<DemoId, { prompt: string; uses: ShowcaseStep['uses'] }> = {
  signal: {
    prompt: 'Watch the public record for new tenders, registered loans and new directors.',
    uses: SOURCES.slice(0, 5).map((label) => ({ label, icon: SOURCE_ICONS[label] ?? 'europe' })),
  },
  evidence: {
    prompt: 'Score each event against my rules, and keep the reason for every rejection.',
    uses: [
      { label: 'Industry packs', icon: 'packs' },
      { label: 'Rules', icon: 'rules' },
      { label: 'A narrow model', icon: 'model' },
    ],
  },
  contact: {
    prompt: 'Once I approve a lead, find the right person and verify their address.',
    uses: [
      { label: 'The filing', icon: 'filing' },
      { label: 'Address verification', icon: 'verify' },
    ],
  },
  draft: {
    prompt: 'Draft a short first email that cites the event and links to its source.',
    uses: [
      { label: 'The event', icon: 'event' },
      { label: 'Its source link', icon: 'link' },
      { label: 'Your approval', icon: 'approval' },
    ],
  },
  send: {
    prompt: 'Send from my own mailbox, and only if every check passes.',
    uses: [
      { label: 'Your own mailbox', icon: 'mailbox' },
      { label: `${SEND_GATES.length} send gates`, icon: 'gates' },
    ],
  },
};

const isDemo = (id: string): id is DemoId => id in SHOWCASE;

export function HowItWorks() {
  const steps: ShowcaseStep[] = STEPS.flatMap((step) =>
    isDemo(step.id) ? [{ id: step.id, tab: step.title.split(',')[0] ?? step.title, title: sentence(step.title), body: step.body, ...SHOWCASE[step.id] }] : [],
  );
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <SectionHeader
        eyebrow="How it works"
        titleId="how-title"
        title="From public event"
        accent="to approved email"
        lead="Five steps, in this order. A person decides at every point that matters."
      />
      <Reveal className={CONTENT_GAP}>
        <StepShowcase label="How it works, step by step" steps={steps} />
      </Reveal>
    </Section>
  );
}
