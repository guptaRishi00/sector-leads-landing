import type { Metadata } from 'next';
import { LegalSection, SimplePage } from '@/components/marketing/simple-page';
import { BRAND_NAME } from '@/lib/marketing/brand';

export const metadata: Metadata = {
  title: `Privacy (draft) · ${BRAND_NAME}`,
  robots: { index: false, follow: false },
};

// A placeholder until the real policy is written and reviewed. It describes only what the
// waitlist actually stores.
export default function PrivacyPage() {
  // The main app checks page access here (await requireAccess('/privacy')); the preview has none.
  return (
    <SimplePage
      draft
      title="Privacy"
      intro={`This is a draft. The full policy for ${BRAND_NAME} will replace it before access opens. Until then, this is what the waitlist keeps.`}
    >
      <LegalSection title="What the waitlist stores">
        <p>
          Your work email, and your name, company and role if you gave them. The wording you agreed to and when. Where on the page you signed up and any campaign tags in the link you followed. A keyed hash of your IP address (never the address itself) and your browser&apos;s user agent, to spot abuse.
        </p>
      </LegalSection>
      <LegalSection title="What we send">
        <p>A confirmation now, an invite when your access is ready, and product updates, at most two a month.</p>
      </LegalSection>
      <LegalSection title="Leaving the list">
        <p>Every email has a link that removes you. Confirming on that page deletes your signup.</p>
      </LegalSection>
    </SimplePage>
  );
}
