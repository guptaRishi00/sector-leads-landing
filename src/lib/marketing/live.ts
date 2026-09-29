import snapshot from './packs-snapshot.json';

// PREVIEW STAND-IN. In the main app this file wires the waitlist to the database, the mailer and
// a signed page-time token, and reads server secrets. None of that exists here: the token below
// is a placeholder that the mock /waitlist route ignores. Do not copy this file back.

/** The token the landing page's form carries. Real app: a signed "page served at" time. */
export function liveWaitlistFormToken(): string {
  return 'preview-token';
}

/** Where the site lives, for canonical and Open Graph URLs. Real app: read from its env. */
export function liveSiteUrl(): string {
  return 'http://localhost:3300';
}

export interface PackSnapshot {
  id: string;
  name: string;
  sectors: { id: string; label: string }[];
  /** The signals switched on by default for this industry. */
  defaultSignals: { id: string; label: string }[];
  /** The public sources the pack reads. */
  sources: { id: string; label: string }[];
}

/**
 * The 15 industry packs, as a static snapshot of public-facing fields. The current page renders
 * INDUSTRY_PACKS from content.ts (hand-written copy); this is here if a redesign wants to show
 * each industry's default signals and sources.
 */
export function livePacks(): readonly PackSnapshot[] {
  return snapshot.packs;
}
