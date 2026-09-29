# Sector Leads landing page (design sandbox)

This is the public marketing page of **Sector Leads**, lifted out of the main product so it can be redesigned without access to the main codebase. It has no database, no auth, no email and no secrets. The waitlist form posts to a mock endpoint.

## What the product is

Sector Leads is a B2B lead engine. It turns dated public events (tenders, contract awards, registered loans, funding filings, new directors, hiring surges, regulator actions) into leads you can check, each shown with its evidence: the source, the date and a score you can read line by line. A person approves every lead and every email draft, and approved emails are sent from the customer's own mailbox only after seven compliance gates pass. It ships with 15 industry packs that decide which signals count and which companies to leave out. Access is not open yet, so the page's job is to explain the product and collect waitlist signups.

## Run it

Requires Node 24 (`.nvmrc`) and pnpm 12.

```sh
pnpm i
pnpm dev          # http://localhost:3300
```

Other scripts: `pnpm build`, `pnpm start` (production server on :3300), `pnpm lint`, `pnpm typecheck`. Run `pnpm typecheck && pnpm lint && pnpm build` before handing work back.

Pages: `/` (the landing), `/privacy`, `/terms`. The header and footer "Sign in" link points at `/sign-in`, which exists only in the main app (it 404s here, which is expected).

## File map

Paths under `src/` match the main app one to one, so changed files can be copied straight back.

| Path | What it is | Copy back? |
| --- | --- | --- |
| `src/app/page.tsx` | The landing: metadata plus the section order | Yes, the JSX and metadata. The main app's version also has a signed-in redirect at the top; keep that. |
| `src/app/layout.tsx` | Root layout: Geist fonts, theme script | Only font/`<html>` changes; the main app's layout also has a CSP nonce and providers. |
| `src/app/globals.css` | Tailwind entry | Only changes below the imports. |
| `src/app/(marketing)/privacy/page.tsx`, `terms/page.tsx` | Draft legal pages | Yes (keep the main app's access check line). |
| `src/components/marketing/landing.tsx` | Every landing section: `Hero`, `HowItWorks`, `Signals`, `Proof`, `Industries`, `Compliance`, `Faq`, `FinalCta` | Yes |
| `src/components/marketing/marketing-shell.tsx` | Header, nav, footer, skip link, `CONTAINER` width | Yes |
| `src/components/marketing/simple-page.tsx` | Frame for the legal pages | Yes |
| `src/components/marketing/waitlist-form.tsx` | The waitlist form (client component) | Yes, within the rules below |
| `src/components/queue/evidence-panel.tsx`, `score-breakdown.tsx` | The product's own evidence and score components, reused in the hero card and the Proof section | Yes, but they are also used inside the app, so changes must work there too |
| `src/lib/marketing/brand.ts` | Product name and tagline | Yes |
| `src/lib/marketing/content.ts` | All landing copy and example data | Yes |
| `src/lib/marketing/waitlist-schema.ts` | Form limits, messages, consent text, validation | Only with sign-off (see below) |
| `src/lib/marketing/packs-snapshot.json` | Static snapshot of the 15 industry packs (name, sector, default signals, sources) | No, preview data |
| `src/lib/marketing/live.ts` | Preview stand-in for the server wiring | **No** |
| `src/app/waitlist/route.ts` | Mock waitlist endpoint | **No** |
| `src/lib/queue/view.ts`, `src/lib/leads/format.ts` | Trimmed copies (types and two helpers only) | No |
| `src/components/ui/**` | Copy of the shared UI package, see below | Changes go to the shared package |

### UI package mapping

The main app imports its components and tokens from a shared package, `@sl/ui`. Here, `tsconfig.json` maps `@sl/ui` to `src/components/ui/index.ts`, so the marketing files keep their original imports unchanged.

| Here | Main app |
| --- | --- |
| `src/components/ui/index.ts` | `@sl/ui` (subset of its exports) |
| `src/components/ui/components/{badge,button,field,input,label,separator,theme-toggle}.tsx` | `packages/ui/src/components/*` (unchanged copies) |
| `src/components/ui/icons.ts` | `packages/ui/src/icons.ts` (`Icons.*`, lucide-react) |
| `src/components/ui/theme.css` | `@sl/ui/theme.css`: colour tokens, dark palette, radii, shadows |
| `src/components/ui/theme-script.ts` | theme bootstrap script (`sl-theme` in localStorage) |
| `src/components/ui/lib/cn.ts` | `cn()` helper |

The shared components are used across the whole product, so prefer styling them through `className` at the call site. If you do change a token in `theme.css` or a shared component, list it in your handoff; it affects the app, not only this page. Any new icon must be added to `icons.ts` (it re-exports from lucide-react).

## Waitlist form and the mock endpoint

The form posts JSON to `POST /waitlist`. Here that is a mock (`src/app/waitlist/route.ts`) that validates with the same schema and returns the same shapes and status codes as the real handler, stores nothing, and ignores the `token` and honeypot fields.

Preview each state by what you type in the email field (the part before the `@`):

| Email contains | Response | What the form shows |
| --- | --- | --- |
| anything valid | 200 `{ ok: true, status: "joined" }` | "You're on the list..." |
| `already` | 200 `{ ok: true, status: "already" }` | "You're already on the list..." |
| `busy` | 429 | Too many requests |
| `stale` | 409 with `reload: true` | Page too old, with a Reload button |
| `changed` | 409 with `reload: true` | Consent wording changed, with a Reload button |
| `down` | 503 | Could not add you just now |
| `slow` | 200 after 2.5 s | Loading state on the button |

Field errors: submit with an invalid email or the box unticked (the browser catches these before sending), or put more than 120 characters in Name or Company, or more than 80 in Role (the server returns 422 with `fieldErrors`). "Couldn't reach the server": stop the dev server, or go offline in devtools, and submit.

## What you may change freely

- Layout, spacing, typography, colour use, section order and composition.
- Visuals: illustrations, product imagery, diagrams, backgrounds, icons (from lucide-react).
- Animations and transitions, as long as they respect reduced motion (below).
- New presentational components under `src/components/marketing/`.
- Copy: propose changes in `content.ts` and the components. Copy is reviewed before it ships, because every claim must be something the product does today.

## What must stay

- **The form contract.** Field `name`s (`email`, `name`, `company`, `role`, the honeypot `website`), the consent checkbox, and the JSON body the form sends to `POST /waitlist` (`token`, `website`, `email`, `name`, `company`, `role`, `consent`, `consentVersion`, `source`, `utm`). The reply shapes are in `WaitlistReply` in `waitlist-schema.ts`. The `source` values are `landing-hero` and `landing-final`.
- **The consent text** (`WAITLIST_CONSENT_TEXT`) shows word for word next to the box, and the box is unticked by default. Wording changes need sign-off and a new `WAITLIST_CONSENT_VERSION`.
- **The honeypot** stays visually hidden and out of the tab order; the `data-testid` attributes stay (the main app's end-to-end tests use them).
- **Accessibility:** every input has a visible `<label>`; errors are tied to fields (`aria-describedby`, `aria-invalid`); visible focus styles on everything interactive; text and UI contrast at WCAG AA in both light and dark themes; the skip link and landmark structure (`header`, `nav`, `main`, `footer`, one `h1`); animations respect `prefers-reduced-motion`; no horizontal scroll at 375 px wide.
- **Theming:** both themes must work with the footer toggle (Light / Dark / System). Use the tokens in `theme.css` (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`, ...) rather than raw colours, so dark mode keeps working.
- **The brand name** lives only in `brand.ts` (`BRAND_NAME`); never hard-code it. The name may still change.
- **No real company names** in examples or imagery. Examples describe kinds of companies ("a UK logistics firm"), never real ones. No real people either.
- No new runtime dependencies without asking; no external scripts, trackers, fonts or images loaded from third-party hosts (the main app runs a strict content security policy). Put images in `public/` or inline SVG.

## Porting changes back

Because the paths match, the main app's maintainer copies changed files from `src/components/marketing/`, `src/components/queue/`, `src/lib/marketing/{brand,content}.ts` and the JSX of `src/app/page.tsx` into the same paths in the main app, then runs its typecheck, lint and end-to-end tests. Never copied back: `src/lib/marketing/live.ts`, `src/app/waitlist/route.ts`, `packs-snapshot.json`, the trimmed `src/lib/queue/view.ts` and `src/lib/leads/format.ts`, and the config files. A short note listing which files you touched (and any change to `src/components/ui/**`) makes this quick.

## Known design gaps worth your attention

- **Plain hero.** A headline, a paragraph and the form, beside the example lead card. There's no visual hook, no proof point and no secondary call to action above the fold.
- **No product imagery** beyond the example lead card and the score breakdown. There are no screenshots of the approval queue, the send gates or results.
- **Text-heavy middle.** How it works, Signals, Industries and Compliance are all icon-plus-text grids with similar weight. Nothing breaks the rhythm.
- **Industries are a plain list.** Each industry is a name and one line. `packs-snapshot.json` has each pack's default signals and sources if you want to show more (for example on hover or in an expandable card).
- **Legal pages are narrower than the header.** `/privacy` and `/terms` use `max-w-3xl` while the header uses `max-w-6xl`, so the title does not line up with the logo.
- **Two identical forms.** The hero and the final call to action repeat the same four-field form. Consider an email-first variant (keeping the same fields and contract).
- **Mobile header.** Below `lg` the section nav disappears and there is no menu, and below `sm` the "Join the waitlist" button is hidden too, leaving only "Sign in".
- **No social or OG image.** Metadata has a title and description but no preview image.
