import type { Metadata } from 'next';
import { Automation, Compliance, Faq, FinalCta, Hero, HowItWorks, Industries, Proof, ProofBar, Signals, Ticker, Workspace } from '@/components/marketing/landing';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { BRAND_NAME } from '@/lib/marketing/brand';
import { liveSiteUrl, liveWaitlistFormToken } from '@/lib/marketing/live';

const TITLE = `${BRAND_NAME}: leads from public events, with the proof attached`;
const DESCRIPTION = 'A B2B lead engine that turns tenders, filings, new directors, hiring and funding into leads you can check, then sends only what you approve, within the law.';

export function generateMetadata(): Metadata {
  let base: URL | undefined;
  try {
    base = new URL(liveSiteUrl());
  } catch {
    base = undefined;
  }
  return {
    ...(base !== undefined && { metadataBase: base }),
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: BRAND_NAME, title: TITLE, description: DESCRIPTION, locale: 'en_GB' },
    twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
  };
}

// In the main app this page first checks the session: a signed-in visitor (or a request with
// ?next=) is redirected into the app, and only signed-out visitors see the landing below.
// That branch is left out here; the JSX from <MarketingShell> down is identical.
export default function Page() {
  const token = liveWaitlistFormToken();
  return (
    <MarketingShell showNav>
      {/* Leadistry's order: the ticker and the hero, the product (how it works, the automation, the
          workspace), the dark panel (compliance), the figures band, the checks (evidence), the
          statement (signals), who it's for (industries), the questions, the close. */}
      <Ticker />
      <Hero />
      <HowItWorks />
      <Automation />
      <Workspace />
      <Compliance />
      <ProofBar />
      <Proof />
      <Signals />
      <Industries />
      <Faq />
      <FinalCta token={token} />
    </MarketingShell>
  );
}
