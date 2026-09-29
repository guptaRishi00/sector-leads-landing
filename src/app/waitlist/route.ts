import {
  WAITLIST_BODY_MAX_BYTES,
  WAITLIST_CONSENT_VERSION,
  WAITLIST_MESSAGES,
  waitlistFieldErrors,
  waitlistSchema,
  type WaitlistReply,
} from '@/lib/marketing/waitlist-schema';

/*
 * MOCK waitlist endpoint for design previews. Nothing is stored and no email is sent.
 *
 * The real handler lives in the main app (src/app/(marketing)/waitlist/route.ts). It also checks
 * same origin, rate limits, the honeypot field and the signed page-time token, and stores the
 * signup. This mock ignores the token and honeypot, validates with the same schema, and answers
 * with the same JSON shapes and status codes, so the form behaves exactly as it will live.
 * Do not copy this file back.
 *
 * Preview any form state by typing a trigger word into the email (checked on the part before @):
 *   anything valid            -> 200 { ok: true, status: 'joined' }   "You're on the list"
 *   contains "already"        -> 200 { ok: true, status: 'already' }  "already on the list"
 *   contains "busy"           -> 429 too many requests
 *   contains "stale"          -> 409 page too old, with a Reload button
 *   contains "changed"        -> 409 consent wording changed, with a Reload button
 *   contains "down"           -> 503 could not add you just now
 *   contains "slow"           -> joins after 2.5 s, to see the loading state
 * Field errors: an invalid email, an unticked box, or a name/company/role over its length limit
 * (or containing control characters) -> 422 with fieldErrors. The browser checks the email and
 * the box first, so to see server-side field errors use an over-long name, company or role.
 * "Couldn't reach the server": stop the dev server (or go offline in devtools) and submit.
 */

function reply(body: WaitlistReply | { error: string }, status: number, extra: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...extra } });
}

function refuse(formError: string, status: number, extra: Omit<Extract<WaitlistReply, { ok: false }>, 'ok' | 'formError'> = {}) {
  return reply({ ok: false, formError, ...extra }, status);
}

function field(body: Record<string, unknown>, name: string): unknown {
  return Object.hasOwn(body, name) ? body[name] : undefined;
}

export async function POST(request: Request): Promise<Response> {
  if (request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
    return reply({ error: 'unsupported' }, 415);
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > WAITLIST_BODY_MAX_BYTES) return reply({ error: 'too_large' }, 413);
    body = JSON.parse(text);
  } catch {
    return refuse(WAITLIST_MESSAGES.refused, 400);
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return refuse(WAITLIST_MESSAGES.refused, 400);
  const fields = body as Record<string, unknown>;

  const parsed = waitlistSchema.safeParse({
    email: field(fields, 'email'),
    name: field(fields, 'name'),
    company: field(fields, 'company'),
    role: field(fields, 'role'),
    consent: field(fields, 'consent'),
  });
  if (!parsed.success) {
    return refuse(WAITLIST_MESSAGES.invalid, 422, { fieldErrors: waitlistFieldErrors(parsed.error) });
  }

  const local = parsed.data.email.split('@')[0] ?? '';
  if (local.includes('stale')) return refuse(WAITLIST_MESSAGES.stale, 409, { reload: true });
  if (local.includes('changed') || field(fields, 'consentVersion') !== WAITLIST_CONSENT_VERSION) {
    return refuse(WAITLIST_MESSAGES.changed, 409, { reload: true });
  }
  if (local.includes('busy')) return reply({ ok: false, formError: WAITLIST_MESSAGES.tooMany }, 429, { 'Retry-After': '600' });
  if (local.includes('down')) return refuse(WAITLIST_MESSAGES.unavailable, 503);
  if (local.includes('slow')) await new Promise((resolve) => setTimeout(resolve, 2500));

  return reply({ ok: true, status: local.includes('already') ? 'already' : 'joined' }, 200);
}
