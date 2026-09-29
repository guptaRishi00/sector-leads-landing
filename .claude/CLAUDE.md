# Sector Leads landing (design sandbox)

Read `.claude/CODEBASE_MAP.md` first, then `README.md` — the README is the owner's brief and wins over the map.

## Hard rules
- **Sandbox of a private main app.** Paths mirror the main app so files get copied back. Never-copied-back files (`src/lib/marketing/live.ts`, `src/app/waitlist/route.ts`, `packs-snapshot.json`, trimmed `src/lib/queue/view.ts` + `src/lib/leads/format.ts`, configs) are sandbox-only.
- **Frozen form contract:** field names, JSON body keys, `source` values (`landing-hero`/`landing-final`), `WaitlistReply` shapes, `data-testid`s. `waitlist-schema.ts` changes need sign-off; consent wording change ⇒ new `WAITLIST_CONSENT_VERSION`.
- **Theme tokens only** (no raw colours), both themes + System must work. Brand name only via `BRAND_NAME`. No real company/person names.
- **No new runtime dependencies and no third-party scripts/fonts/images/trackers** without asking (main app has a strict CSP).
- `src/components/ui/**` mirrors a shared package — prefer `className` overrides; list any ui/token change in the handoff. Don't delete "unused" ui exports.
- Accessibility is part of the contract: labels, `aria-describedby`/`aria-invalid`, focus styles, WCAG AA both themes, one `h1`, skip link + landmarks, reduced motion, no horizontal scroll at 375 px.
- **Package manager is pnpm (not bun), Node ≥ 24.11.** This machine has Node 22 and a broken pnpm shim, so npm was used — never commit `package-lock.json`.
- Before handing back: `pnpm typecheck && pnpm lint && pnpm build` (npm: `npm run typecheck && npm run lint && npm run build`).
- Session log: `.claude/SESSION_LOG.md` (append at EOF).
