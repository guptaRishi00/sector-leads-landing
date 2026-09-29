import type { QueueCard } from '@/lib/queue/view';
import { BRAND_NAME } from './brand';

// Copy for the landing page. Every claim here is something the product does today; examples describe kinds of companies, never real ones.

export type StepIcon = 'Radar' | 'ListChecks' | 'UserRound' | 'MailCheck' | 'ShieldCheck';

export const STEPS: readonly { id: string; icon: StepIcon; title: string; body: string }[] = [
  {
    id: 'signal',
    icon: 'Radar',
    title: 'A dated event happens',
    body: 'A tender is published, a loan is registered, a director is appointed. We read it from the public source that recorded it.',
  },
  {
    id: 'evidence',
    icon: 'ListChecks',
    title: 'It becomes a lead, with evidence',
    body: 'Rules decide what counts. Each lead keeps its source, date and a score you can read line by line. Each rejection keeps its reason.',
  },
  {
    id: 'contact',
    icon: 'UserRound',
    title: 'You approve, then we find the buyer',
    body: 'Only after you approve a lead do we look for the right person and verify their address.',
  },
  {
    id: 'draft',
    icon: 'MailCheck',
    title: 'A short draft you approve',
    body: 'The draft cites the event and links to its source. Nothing leaves until a person approves it.',
  },
  {
    id: 'send',
    icon: 'ShieldCheck',
    title: 'Sent only through the gates',
    body: 'From your own mailbox, and only if every check passes: legal basis, suppression, caps, breakers, business hours.',
  },
];

export type SignalIcon = 'Megaphone' | 'CircleCheck' | 'ChartLine' | 'UserRound' | 'Users' | 'Database' | 'Shield' | 'Code' | 'Globe';

export interface SignalType {
  id: string;
  icon: SignalIcon;
  name: string;
  example: string;
  sources: string;
}

export const SIGNAL_TYPES: readonly SignalType[] = [
  {
    id: 'tender-notice',
    icon: 'Megaphone',
    name: 'Tender published',
    example: 'A county council opens a tender for IT support.',
    sources: 'Find a Tender, TED, SAM.gov',
  },
  {
    id: 'tender-award',
    icon: 'CircleCheck',
    name: 'Contract awarded',
    example: 'A mid-sized contractor wins a public roads contract and now needs suppliers.',
    sources: 'Find a Tender, TED, SAM.gov',
  },
  {
    id: 'secured-loan',
    icon: 'Database',
    name: 'Secured loan registered',
    example: 'A UK manufacturer registers a new secured loan against its assets.',
    sources: 'Companies House',
  },
  {
    id: 'funding-round',
    icon: 'ChartLine',
    name: 'Funding filed',
    example: 'A US software startup files a Form D for a new raise.',
    sources: 'SEC EDGAR, Companies House, news',
  },
  {
    id: 'new-leader',
    icon: 'UserRound',
    name: 'New director or leader',
    example: 'A UK logistics firm appoints a new director.',
    sources: 'Companies House, news',
  },
  {
    id: 'hiring-surge',
    icon: 'Users',
    name: 'Hiring surge or key role',
    example: 'A company posts five or more roles in a month, or opens its first head of finance role.',
    sources: 'Public Greenhouse and Lever job boards',
  },
  {
    id: 'regulator-action',
    icon: 'Shield',
    name: 'Regulator action',
    example: 'A data-protection regulator reprimands a company over a breach.',
    sources: 'FTC press releases, news',
  },
  {
    id: 'tech-change',
    icon: 'Code',
    name: 'Tech stack or code activity',
    example: 'A company you already track switches its site platform, or starts pushing to new public repositories.',
    sources: 'Company websites, GitHub organisations',
  },
  {
    id: 'news',
    icon: 'Globe',
    name: 'Company news',
    example: 'A distributor announces a new warehouse.',
    sources: 'GDELT news index',
  },
];

/** The 15 industries with a built-in pack (see packs-snapshot.json), and what starts a lead by default. */
export const INDUSTRY_PACKS: readonly { id: string; name: string; watches: string }[] = [
  { id: 'software-it-services', name: 'Software and IT services', watches: 'IT tenders, contract awards, new tech leaders, funding' },
  { id: 'cybersecurity-compliance', name: 'Cybersecurity and compliance', watches: 'Security tenders, new security leaders, regulator actions' },
  { id: 'government-tenders', name: 'Government tenders', watches: 'Tender notices and contract awards in any category' },
  { id: 'recruitment-staffing', name: 'Recruitment and staffing', watches: 'Hiring surges, new companies, staffing tenders' },
  { id: 'construction-contractors', name: 'Construction and contractors', watches: 'Construction tenders and contract awards' },
  { id: 'fractional-cfo', name: 'Fractional CFO', watches: 'Funding, finance leaders leaving, open finance roles' },
  { id: 'commercial-lending', name: 'Commercial lending', watches: 'Secured loans registered or cleared in the UK' },
  { id: 'b2b-saas', name: 'B2B SaaS', watches: 'New leaders, funding rounds, hiring surges' },
  { id: 'digital-marketing-agencies', name: 'Digital marketing agencies', watches: 'New marketing leaders, funding, open marketing roles' },
  { id: 'healthcare-b2b', name: 'Healthcare B2B', watches: 'Medical equipment and supply tenders' },
  { id: 'vc-pe-deal-sourcing', name: 'VC, PE and angel deal sourcing', watches: 'Go-to-market hiring at companies you track' },
  { id: 'commercial-insurance', name: 'Commercial insurance brokers', watches: 'Funding rounds that bring new cover needs' },
  { id: 'logistics-freight', name: 'Logistics, freight and 3PL', watches: 'Freight, storage and courier tenders' },
  { id: 'commercial-real-estate', name: 'Commercial real estate', watches: 'Hiring surges and funding rounds' },
  { id: 'commercial-solar-ev', name: 'Commercial solar and EV charging', watches: 'Solar, charging and efficiency tenders' },
];

/** The send gates, in the order they run. */
export const SEND_GATES: readonly string[] = [
  'Suppression lists',
  'Legal basis for the country',
  'Fresh address verification',
  'Mailbox health and bounce breaker',
  'Daily caps',
  'Complaint breaker',
  'Business hours and holidays',
];

/** Reject reasons as the product records them, a few of them. */
export const REJECT_EXAMPLES: readonly { code: string; label: string }[] = [
  { code: 'own_industry', label: 'Works in your own industry' },
  { code: 'staffing_firm', label: 'A staffing firm' },
  { code: 'stale_signal', label: 'Older than the freshness window' },
  { code: 'shell_or_spv', label: 'A shell or holding vehicle' },
  { code: 'country_out_of_market', label: 'Outside your markets' },
  { code: 'low_resolution_confidence', label: 'Could not match one company' },
];

/** The example lead shown in the hero, rendered with the app's own evidence panel. */
export const EXAMPLE_LEAD: { descriptor: string; evidence: QueueCard['evidence'] } = {
  descriptor: 'Precision engineering manufacturer, West Midlands, UK',
  evidence: {
    source: 'UK Companies House',
    trigger: 'Secured loan registered',
    title: 'Charge registered (MR01)',
    snippet: 'A new charge over the company’s assets, registered in favour of a clearing bank.',
    href: 'https://www.gov.uk/get-information-about-a-company',
    happenedOn: '23 Sep 2026',
    happenedAt: '2026-09-23',
    freshness: '6 days ago',
    modelDecisions: [],
  },
};

/** The example score, worked through the real weights. */
export const EXAMPLE_SCORE: QueueCard['score'] = {
  total: 79.6,
  max: 100,
  text: '80',
  lines: [
    { id: 'signal', label: 'Signal', points: 30, max: 30, why: 'A registered charge is strong evidence, so full points.' },
    { id: 'freshness', label: 'Freshness', points: 16, max: 20, why: 'Registered 6 days ago, in a 30-day window.' },
    { id: 'fit', label: 'Fit', points: 20.8, max: 25, why: 'Country and industry match. Employee count unknown, so half credit for size.' },
    { id: 'evidence', label: 'Evidence', points: 6.8, max: 10, why: 'Links to the filing. Matched to one company with 95% confidence.' },
    { id: 'reachability', label: 'Reachability', points: 6, max: 15, why: 'A director is named in the filing. No verified address yet.' },
  ],
};

export const FAQ: readonly { id: string; question: string; answer: string }[] = [
  {
    id: 'signal',
    question: 'What counts as a signal?',
    answer:
      'A dated public event that suggests a company is about to buy: a tender, a contract award, a registered loan, a funding filing, a new director, a hiring surge, a regulator action, a change to its website stack or public code, or a news item. Each industry pack decides which of these start a lead, and you can switch each one on or off.',
  },
  {
    id: 'sources',
    question: 'Where does the data come from?',
    answer:
      'Official registers and public sources: Companies House, SEC EDGAR, SAM.gov, TED, Find a Tender, public job boards, GitHub organisations and a public news index. Some sources need a free key of your own. Personal details a lead does not need, such as officers’ home addresses, are dropped before anything is stored.',
  },
  {
    id: 'ai',
    question: 'What does the AI do?',
    answer:
      'Very little, on purpose. Rules decide which events count. A model may answer narrow questions (is this company in your own industry, is it a staffing firm, which of these records is the same company) and writes the first draft of an email. It cannot approve a lead or a message.',
  },
  {
    id: 'sending',
    question: 'Will it send email on its own?',
    answer:
      'No. A person approves every lead and every draft. Approved drafts go from your own mailbox, and only if every gate passes: suppression, legal basis for the recipient’s country, fresh verification, mailbox health, caps, complaint and bounce breakers, and the recipient’s business hours and public holidays.',
  },
  {
    id: 'lift',
    question: 'How do I know it works?',
    answer:
      'A share of accounts (12% by default) goes into a holdout group that is never contacted. Results compares meetings from the contacted group against the holdout, so you see lift, not just activity.',
  },
  {
    id: 'data',
    question: 'Can we keep our data in our own database?',
    answer:
      'Yes. A workspace can connect its own Postgres, and its leads, contacts and messages are stored there instead of ours. Every workspace is isolated with row-level security, and its secrets are encrypted.',
  },
  {
    id: 'pricing',
    question: 'When can I use it, and what does it cost?',
    answer: `We have not opened access or set pricing yet. Join the waitlist and we will email you when your access is ready.`,
  },
  {
    id: 'leave',
    question: 'How do I leave the waitlist?',
    answer: `Every email from ${BRAND_NAME} has a link that removes you. Opening it and confirming deletes your signup.`,
  },
];
