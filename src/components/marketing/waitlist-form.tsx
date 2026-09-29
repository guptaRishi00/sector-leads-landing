'use client';

import { Button, Field, Icons, Input, cn } from '@sl/ui';
import { useId, useRef, useState, type FormEvent } from 'react';
import {
  WAITLIST_COMPANY_MAX,
  WAITLIST_CONSENT_TEXT,
  WAITLIST_CONSENT_VERSION,
  WAITLIST_EMAIL_MAX,
  WAITLIST_FIELDS,
  WAITLIST_HONEYPOT_FIELD,
  WAITLIST_MESSAGES,
  WAITLIST_NAME_MAX,
  WAITLIST_ROLE_MAX,
  WAITLIST_SUCCESS,
  WAITLIST_UTM_KEYS,
  type WaitlistField,
  type WaitlistReply,
  type WaitlistSource,
} from '@/lib/marketing/waitlist-schema';

type FieldErrors = Partial<Record<WaitlistField, string>>;

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
}

function localErrors(data: FormData, consent: boolean): FieldErrors {
  const errors: FieldErrors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(data, 'email').trim())) errors.email = WAITLIST_MESSAGES.email;
  if (!consent) errors.consent = WAITLIST_MESSAGES.consent;
  return errors;
}

function asReply(body: unknown): WaitlistReply {
  if (body !== null && typeof body === 'object') {
    const reply = body as Record<string, unknown>;
    if (reply.ok === true && (reply.status === 'joined' || reply.status === 'already')) return { ok: true, status: reply.status };
    if (typeof reply.formError === 'string') return body as WaitlistReply;
  }
  return { ok: false, formError: WAITLIST_MESSAGES.refused, reload: true };
}

function utmFromLocation(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of WAITLIST_UTM_KEYS) {
    const value = params.get(`utm_${key}`);
    if (value !== null && value !== '') utm[key] = value.slice(0, 200);
  }
  return utm;
}

function Optional({ children }: { children: string }) {
  return (
    <>
      {children} <span className="font-normal text-muted-foreground">(optional)</span>
    </>
  );
}

export function WaitlistForm({ token, source, className }: { token: string; source: WaitlistSource; className?: string }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<'joined' | 'already' | null>(null);
  const fieldId = (name: WaitlistField) => `${id}-${name}`;

  function show(next: FieldErrors, message: string) {
    setErrors(next);
    setFormError(message);
    const first = WAITLIST_FIELDS.find((name) => next[name] !== undefined);
    requestAnimationFrame(() => {
      (first === undefined ? errorRef.current : document.getElementById(fieldId(first)))?.focus();
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || formRef.current === null) return;
    const data = new FormData(formRef.current);
    const local = localErrors(data, consent);
    if (Object.keys(local).length > 0) {
      show(local, WAITLIST_MESSAGES.invalid);
      return;
    }
    setPending(true);
    setReload(false);
    let result: WaitlistReply;
    try {
      const response = await fetch('/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        cache: 'no-store',
        body: JSON.stringify({
          token,
          [WAITLIST_HONEYPOT_FIELD]: text(data, WAITLIST_HONEYPOT_FIELD),
          email: text(data, 'email'),
          name: text(data, 'name'),
          company: text(data, 'company'),
          role: text(data, 'role'),
          consent,
          consentVersion: WAITLIST_CONSENT_VERSION,
          source,
          utm: utmFromLocation(),
        }),
      });
      result = asReply(await response.json());
    } catch {
      setPending(false);
      show({}, WAITLIST_MESSAGES.offline);
      return;
    }
    setPending(false);
    if (result.ok) {
      setErrors({});
      setFormError(null);
      setDone(result.status);
      requestAnimationFrame(() => doneRef.current?.focus());
      return;
    }
    setReload(result.reload === true);
    show(result.fieldErrors ?? {}, result.formError);
  }

  if (done !== null) {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        data-testid="waitlist-done"
        className={cn('flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring', className)}
      >
        <Icons.CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />
        <p className="text-sm text-pretty text-foreground">{WAITLIST_SUCCESS[done]}</p>
      </div>
    );
  }

  const consentErrorId = `${fieldId('consent')}-error`;

  return (
    <form ref={formRef} noValidate onSubmit={(event) => void submit(event)} data-testid={`waitlist-form-${source}`} className={cn('relative flex flex-col gap-4', className)}>
      <div
        ref={errorRef}
        tabIndex={-1}
        role="alert"
        className={cn(
          'rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          formError === null && 'hidden',
        )}
      >
        {formError !== null && (
          <div className="flex flex-col items-start gap-2">
            <p>{formError}</p>
            {reload && (
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Reload the page
              </Button>
            )}
          </div>
        )}
      </div>

      <Field label="Work email" required error={errors.email} id={fieldId('email')}>
        <Input name="email" type="email" autoComplete="email" inputMode="email" maxLength={WAITLIST_EMAIL_MAX} className="h-10 bg-card" />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label={<Optional>Name</Optional>} error={errors.name} id={fieldId('name')}>
          <Input name="name" autoComplete="name" maxLength={WAITLIST_NAME_MAX} className="bg-card" />
        </Field>
        <Field label={<Optional>Company</Optional>} error={errors.company} id={fieldId('company')}>
          <Input name="company" autoComplete="organization" maxLength={WAITLIST_COMPANY_MAX} className="bg-card" />
        </Field>
        <Field label={<Optional>Role</Optional>} error={errors.role} id={fieldId('role')}>
          <Input name="role" autoComplete="organization-title" maxLength={WAITLIST_ROLE_MAX} className="bg-card" />
        </Field>
      </div>

      <div aria-hidden="true" className="absolute top-auto -left-[10000px] size-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>Leave this field empty</label>
        <input id={`${id}-hp`} name={WAITLIST_HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            id={fieldId('consent')}
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            aria-required="true"
            aria-invalid={errors.consent !== undefined}
            aria-describedby={errors.consent === undefined ? undefined : consentErrorId}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <label htmlFor={fieldId('consent')} className="text-[13px] leading-snug text-pretty text-muted-foreground">
            {WAITLIST_CONSENT_TEXT}
          </label>
        </div>
        {errors.consent !== undefined && (
          <p id={consentErrorId} className="pl-6.5 text-[13px] text-destructive">
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" loading={pending} className="group/cta w-full sm:w-auto sm:self-start">
        Join the waitlist
        {!pending && <Icons.ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />}
      </Button>
    </form>
  );
}
