import type { Metadata } from 'next';
import { SimplePage } from '@/components/marketing/simple-page';
import { BRAND_NAME } from '@/lib/marketing/brand';

export const metadata: Metadata = {
  title: `Terms (draft) · ${BRAND_NAME}`,
  robots: { index: false, follow: false },
};

// A placeholder until the terms of service are written and reviewed.
export default function TermsPage() {
  // The main app checks page access here (await requireAccess('/terms')); the preview has none.
  return (
    <SimplePage
      draft
      title="Terms"
      intro={`This is a draft. The terms of service for ${BRAND_NAME} will be published here before access opens. Joining the waitlist does not create an account or any commitment on either side.`}
    />
  );
}
