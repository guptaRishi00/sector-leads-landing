import { z } from 'zod';
import { BRAND_NAME } from './brand';

// Shared by the waitlist form (browser) and its route handler (server). Nothing here reads
// secrets or Node APIs.

export const WAITLIST_EMAIL_MAX = 254;
export const WAITLIST_NAME_MAX = 120;
export const WAITLIST_COMPANY_MAX = 120;
export const WAITLIST_ROLE_MAX = 80;
export const WAITLIST_TAG_MAX = 100;
export const WAITLIST_BODY_MAX_BYTES = 4 * 1024;
export const WAITLIST_HONEYPOT_FIELD = 'website';
/** Sooner than this after the page was served, the form was not filled in by a person. */
export const WAITLIST_MIN_FILL_MS = 3_000;
/** Older than this, the page is stale and must be reloaded. */
export const WAITLIST_MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * What a person agrees to by ticking the box, word for word. Bump the version whenever the
 * wording changes (including a new BRAND_NAME), so each stored signup names what it agreed to.
 */
export const WAITLIST_CONSENT_VERSION = 'waitlist-2026-09-29';
export const WAITLIST_CONSENT_TEXT = `Email me about ${BRAND_NAME}: a confirmation now, an invite when my access is ready, and product updates, at most two a month. Every email has a link that removes me from the list.`;

/** Where on the page the form was sent from. */
export const WAITLIST_SOURCES = ['landing-hero', 'landing-final'] as const;
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];

export const WAITLIST_UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const;
export type WaitlistUtmKey = (typeof WAITLIST_UTM_KEYS)[number];

export const WAITLIST_FIELDS = ['email', 'name', 'company', 'role', 'consent'] as const;
export type WaitlistField = (typeof WAITLIST_FIELDS)[number];

export const WAITLIST_MESSAGES = {
  email: 'Enter your work email, such as ana@yourcompany.com.',
  name: `Keep your name to ${WAITLIST_NAME_MAX} characters, without special characters.`,
  company: `Keep the company name to ${WAITLIST_COMPANY_MAX} characters, without special characters.`,
  role: `Keep your role to ${WAITLIST_ROLE_MAX} characters, without special characters.`,
  consent: 'Tick the box to join. It is how we know you want these emails.',
  invalid: 'Some answers need another look. Fix the ones marked and try again.',
  tooMany: "We've had a lot of requests from you in a short time. Wait a few minutes and try again.",
  stale: 'This page has been open for a long time. Reload it and try again.',
  changed: 'The wording of the agreement has changed. Reload the page, read it and try again.',
  unavailable: "We couldn't add you just now. Try again in a few minutes.",
  refused: "We couldn't accept this form. Reload the page and try again.",
  offline: "We couldn't reach the server. Check your connection and try again.",
} as const;

export const WAITLIST_SUCCESS = {
  joined: "You're on the list. We've sent a confirmation to your inbox.",
  already: "You're already on the list. We'll email you when your access is ready.",
} as const;

// C0 and C1 controls, and bidirectional overrides that could disguise text in the admin table.
const UNSAFE_TEXT = /[\u0000-\u001f\u007f-\u009f‪-‮⁦-⁩]/;

function optionalText(max: number, message: string) {
  return z
    .unknown()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === null) return null;
      if (typeof value !== 'string') {
        ctx.addIssue({ code: 'custom', message });
        return z.NEVER;
      }
      const text = value.normalize('NFC').trim();
      if (text === '') return null;
      if (text.length > max || UNSAFE_TEXT.test(text)) {
        ctx.addIssue({ code: 'custom', message });
        return z.NEVER;
      }
      return text;
    });
}

/** Trimmed and lower-cased, as it is stored and compared. */
export function normaliseEmail(value: string): string {
  return value.normalize('NFC').trim().toLowerCase();
}

export const waitlistSchema = z.object({
  email: z
    .unknown()
    .optional()
    .transform((value, ctx) => {
      const text = typeof value === 'string' ? normaliseEmail(value) : '';
      const ok =
        text.length >= 3 &&
        text.length <= WAITLIST_EMAIL_MAX &&
        !UNSAFE_TEXT.test(text) &&
        z.email().safeParse(text).success;
      if (!ok) {
        ctx.addIssue({ code: 'custom', message: WAITLIST_MESSAGES.email });
        return z.NEVER;
      }
      return text;
    }),
  name: optionalText(WAITLIST_NAME_MAX, WAITLIST_MESSAGES.name),
  company: optionalText(WAITLIST_COMPANY_MAX, WAITLIST_MESSAGES.company),
  role: optionalText(WAITLIST_ROLE_MAX, WAITLIST_MESSAGES.role),
  consent: z.unknown().optional().refine((value) => value === true, { message: WAITLIST_MESSAGES.consent }),
});

export type WaitlistForm = z.output<typeof waitlistSchema>;

/** The first message for each field; nothing from the input is ever echoed. */
export function waitlistFieldErrors(error: z.ZodError): Partial<Record<WaitlistField, string>> {
  const errors: Partial<Record<WaitlistField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== 'string' || !(WAITLIST_FIELDS as readonly string[]).includes(field)) continue;
    errors[field as WaitlistField] ??= issue.message;
  }
  return errors;
}

/** A source tag, kept only when it is one of ours. */
export function readSource(value: unknown): WaitlistSource | null {
  return typeof value === 'string' && (WAITLIST_SOURCES as readonly string[]).includes(value)
    ? (value as WaitlistSource)
    : null;
}

/** One UTM value, kept only when it is short, printable text; anything else is dropped, not cut. */
export function readTag(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = value.normalize('NFC').trim();
  if (text === '' || text.length > WAITLIST_TAG_MAX || UNSAFE_TEXT.test(text)) return null;
  return text;
}

export function readUtm(value: unknown): Record<WaitlistUtmKey, string | null> {
  const bag = value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const utm = {} as Record<WaitlistUtmKey, string | null>;
  for (const key of WAITLIST_UTM_KEYS) utm[key] = readTag(Object.hasOwn(bag, key) ? bag[key] : undefined);
  return utm;
}

/** What the form gets back. Nothing in it comes from the request. */
export type WaitlistReply =
  | { ok: true; status: 'joined' | 'already' }
  | {
      ok: false;
      formError: string;
      fieldErrors?: Partial<Record<WaitlistField, string>>;
      /** The page is out of date: reload it before trying again. */
      reload?: true;
    };
