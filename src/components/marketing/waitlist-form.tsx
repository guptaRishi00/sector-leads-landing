'use client';

import { Button, Field, Icons, Input, cn } from '@sl/ui';
import { HOVER_PLAIN, HOVER_PRIMARY } from './hover';
import { useId, useRef, useState, type ComponentProps, type FormEvent } from 'react';
import {
  WAITLIST_COMPANY_MAX,
  WAITLIST_COMPANY_SIZES,
  WAITLIST_CONSENT_TEXT,
  WAITLIST_CONSENT_VERSION,
  WAITLIST_EMAIL_MAX,
  WAITLIST_COUNTRIES,
  WAITLIST_FIELDS,
  WAITLIST_HONEYPOT_FIELD,
  WAITLIST_INDUSTRIES,
  WAITLIST_MESSAGES,
  WAITLIST_NAME_MAX,
  WAITLIST_ROLE_MAX,
  WAITLIST_SUCCESS,
  WAITLIST_USE_CASE_MAX,
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

/** The ui Input's look, for the native select and textarea (the ui package has neither). */
const CONTROL =
  'w-full min-w-0 rounded-md border border-input bg-card px-3 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/25';

function Choice({ name, options, ...rest }: { name: string; options: readonly { value: string; label: string }[] } & Omit<ComponentProps<'select'>, 'name' | 'children'>) {
  return (
    <select name={name} defaultValue="" className={cn(CONTROL, 'h-11 pr-8 text-foreground')} {...rest}>
      <option value="">Choose one</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Optional({ children }: { children: string }) {
  return (
    <>
      {children} <span className="font-normal text-muted-foreground">(optional)</span>
    </>
  );
}

/**
 * The waitlist form: every field in view, in a two-column grid from sm (one column on phones). The
 * work email is the only required field and leads, full width; then name and company, role and
 * company size, industry and country (fixed lists from the schema), what they would use it for,
 * the consent under a hairline, and a full-width button. `compact` (the closing call to action)
 * only enlarges the email field and the button. Field names and the JSON body follow
 * waitlist-schema.ts (the profile fields were added on 2026-10-13: a contract change).
 */
export function WaitlistForm({ token, source, compact = false, className }: { token: string; source: WaitlistSource; compact?: boolean; className?: string }) {
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
          companySize: text(data, 'companySize'),
          industry: text(data, 'industry'),
          country: text(data, 'country'),
          useCase: text(data, 'useCase'),
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
        className={cn(
          'flex items-center gap-4 rounded-xl border border-success/30 bg-success-soft p-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          className,
        )}
      >
        <span aria-hidden="true" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-success text-primary-foreground">
          <Icons.Check className="size-5" strokeWidth={2.75} />
        </span>
        <p className="text-[15px] font-medium text-pretty text-foreground">{WAITLIST_SUCCESS[done]}</p>
      </div>
    );
  }

  const consentErrorId = `${fieldId('consent')}-error`;

  const emailField = (
    <Field label="Work email" required error={errors.email} id={fieldId('email')}>
      <Input
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@company.com"
        maxLength={WAITLIST_EMAIL_MAX}
        className={cn('bg-card', compact ? 'h-12 rounded-lg px-4 text-base' : 'h-10')}
      />
    </Field>
  );

  const submitButton = (
    <Button
      type="submit"
      size="lg"
      loading={pending}
      className={cn(
        'group/cta w-full rounded-lg bg-primary font-medium text-primary-foreground shadow-none transition-[color,background-color,transform] motion-safe:active:scale-[0.98]',
        HOVER_PRIMARY,
        compact && 'h-12 px-6 text-[15px]',
      )}
    >
      Join the waitlist
      {!pending && <Icons.ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" />}
    </Button>
  );

  const profile = (
    <>
      <Field label={<Optional>Name</Optional>} error={errors.name} id={fieldId('name')}>
        <Input name="name" autoComplete="name" maxLength={WAITLIST_NAME_MAX} className="h-11 bg-card" />
      </Field>
      <Field label={<Optional>Company</Optional>} error={errors.company} id={fieldId('company')}>
        <Input name="company" autoComplete="organization" maxLength={WAITLIST_COMPANY_MAX} className="h-11 bg-card" />
      </Field>
      <Field label={<Optional>Role</Optional>} error={errors.role} id={fieldId('role')}>
        <Input name="role" autoComplete="organization-title" placeholder="Head of sales" maxLength={WAITLIST_ROLE_MAX} className="h-11 bg-card" />
      </Field>
      <Field label={<Optional>Company size</Optional>} error={errors.companySize} id={fieldId('companySize')}>
        <Choice name="companySize" options={WAITLIST_COMPANY_SIZES} />
      </Field>
      <Field label={<Optional>Industry</Optional>} error={errors.industry} id={fieldId('industry')}>
        <Choice name="industry" options={WAITLIST_INDUSTRIES} />
      </Field>
      <Field label={<Optional>Country</Optional>} error={errors.country} id={fieldId('country')}>
        <Choice name="country" options={WAITLIST_COUNTRIES} />
      </Field>
      <Field label={<Optional>What would you use it for?</Optional>} error={errors.useCase} id={fieldId('useCase')} className="sm:col-span-2">
        <textarea
          name="useCase"
          rows={3}
          maxLength={WAITLIST_USE_CASE_MAX}
          placeholder="The signals you'd watch, the companies you sell to…"
          className={cn(CONTROL, 'min-h-24 resize-y py-2.5 placeholder:text-muted-foreground')}
        />
      </Field>
    </>
  );

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(event) => void submit(event)}
      data-testid={`waitlist-form-${source}`}
      className={cn('relative flex flex-col gap-4 max-sm:gap-5', className)}
    >
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
              <Button variant="outline" size="sm" className={cn('shadow-none', HOVER_PLAIN)} onClick={() => window.location.reload()}>
                Reload the page
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <div className="sm:col-span-2">{emailField}</div>
        {profile}
      </div>

      <div aria-hidden="true" className="absolute top-auto -left-[10000px] size-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>Leave this field empty</label>
        <input id={`${id}-hp`} name={WAITLIST_HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5 border-t pt-5">
        <div className="flex items-start gap-2.5 max-sm:gap-3">
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
          {/* flex-1 + min-w-0: the text always fills the row beside the box (some phone browsers sized it to half the width with text-pretty, now from sm only). */}
          <label htmlFor={fieldId('consent')} className="min-w-0 flex-1 text-[13px] leading-snug text-muted-foreground max-sm:leading-relaxed sm:text-pretty">
            {WAITLIST_CONSENT_TEXT}
          </label>
        </div>
        {errors.consent !== undefined && (
          <p id={consentErrorId} className="pl-6.5 text-[13px] text-destructive">
            {errors.consent}
          </p>
        )}
      </div>

      {submitButton}
    </form>
  );
}
