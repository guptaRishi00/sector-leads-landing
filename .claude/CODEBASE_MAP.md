# Sector Leads landing — Codebase Map
_Last updated: 2026-09-29_

> **[v]** = verified against the files on 2026-09-29. **[inferred]** = reasoned, not observed — check before relying on it.
> `README.md` is the owner's brief and is authoritative; this map indexes it and the code.

## Identity
- The public marketing page of **Sector Leads** (a B2B lead engine), **lifted out of a private "main app" so it can be redesigned without access to that codebase** (README:3). A **design sandbox**: no database, no auth, no email, no secrets; the waitlist form posts to a mock. **[v]**
- Paths under `src/` match the main app one to one so changed files can be copied back by the main app's maintainer (README "Porting changes back"). **[v]** (Exception: the mock is `src/app/waitlist/route.ts`; the real one lives at `src/app/(marketing)/waitlist/route.ts` in the main app.)
- Git repo, branch `main`, remote `github.com/sidhartha8011/sector-leads-landing` — **someone else's repo**; one commit `df1120c` (2026-09-29, 40 files). Cloned here 2026-09-29. **[v]**
- Next **16.3.6** App Router, React **19.3.0**, TypeScript 5.9 (very strict: `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`), Tailwind **v4** CSS-first, zod 4.6, Radix + cva (shadcn-style), lucide-react. Deps are exact-pinned. **[v]**

## Stack & build
- **Package manager is pnpm 12.6** (`packageManager` field, committed `pnpm-lock.yaml`), **Node ≥ 24.11** (`engines`, `.nvmrc` = 24). **[v]**
- **This machine does not match:** Node is **v22.16.0**, and corepack's pnpm 12.6.0 shim is broken (`Cannot find module …\corepack\v1\pnpm\12.6.0\bin\pnpm.cjs`). The checkout was installed with **npm**: flat `node_modules/`, and an **untracked `package-lock.json`** that must not be committed (it is not in `.gitignore`). A dev server has already run on it (`.next/dev/` exists), so Next 16.3 does start on Node 22. **[v]** Transitive versions come from npm's resolution, not `pnpm-lock.yaml`. **[inferred]**
- The workspace-wide "use bun" rule does **not** apply here: the owner specifies pnpm.
- Config is deliberately minimal: `next.config.ts` = `poweredByHeader: false` only (the main app's CSP, security headers and standalone build were stripped). ESLint = typescript-eslint `recommendedTypeChecked`. No Prettier/Biome, and line width is inconsistent: ui/queue files ~100 cols, marketing files 160+. **[v]**

## Commands
| Action | Command |
|---|---|
| Install | `pnpm i` (owner); here `npm install` was used — see above |
| Run dev | `pnpm dev` → `next dev --port 3300` (npm: `npm run dev`). **No `launch.json` entry yet.** |
| Run all tests | none in this repo (the main app runs e2e against the `data-testid`s) |
| Lint | `pnpm lint` (`eslint .`) |
| Typecheck | `pnpm typecheck` (`tsc --noEmit`) |
| Build / start | `pnpm build` / `pnpm start` (:3300) |
| **Before handing work back** | `pnpm typecheck && pnpm lint && pnpm build` (README:18) |

## Bootstrap flow
`src/app/layout.tsx` — **IBM Plex Sans (400–700) + IBM Plex Mono (400–600)** via `next/font/google` since 2026-09-29 (was Geist). The variables keep the names `--font-geist-sans/-mono` because the shared `theme.css` reads them; the main app's layout needs the same swap, metadata `title: 'sector-leads'` (literal, no template), inline no-flash theme script in `<head>` (`theme-script.ts`: reads `localStorage['sl-theme']`, sets `data-theme` on `<html>` only for light/dark), `suppressHydrationWarning` on `<html>`. No providers (the main app adds a CSP nonce and toast/tooltip providers — comment at :23-25). **[v]**
→ `src/app/globals.css` = `@import 'tailwindcss'` + `../components/ui/theme.css`.
→ `src/app/page.tsx:31` renders `<MarketingShell showNav>` (`components/marketing/marketing-shell.tsx:108`: skip link, sticky header, `<main id="main">`, footer with theme toggle) wrapping the landing sections.

## Directory layout
- `src/app/` — `page.tsx` (landing), `(marketing)/{privacy,terms}/page.tsx` (draft legal pages), `waitlist/route.ts` (mock), `layout.tsx`, `globals.css`.
- `src/components/marketing/` — `landing.tsx` (all 8 sections), `marketing-shell.tsx`, `simple-page.tsx` (legal page layout), `waitlist-form.tsx` (the only client component outside ui/).
- `src/components/queue/` — `evidence-panel.tsx`, `score-breakdown.tsx`: **real product components** from the main app's lead-queue UI, used as demo visuals. They also run inside the app, so changes must still work there.
- `src/components/ui/` — vendored shadcn new-york-v4 kit, a copy of the main app's `packages/ui/src`, exported through the `@sl/ui` barrel (`index.ts`); `theme.css` holds every token.
- `src/lib/marketing/` — `brand.ts` (`BRAND_NAME`, `BRAND_TAGLINE`), `content.ts` (list/data copy), `waitlist-schema.ts` (form contract + zod), `live.ts` (preview stubs), `packs-snapshot.json` (unused data).
- `src/lib/queue/view.ts`, `src/lib/leads/format.ts` — **trimmed** copies (types only / `hostOf` + `pointsText` only).
- No `public/` yet; images go there or inline as SVG (README).

## Surfaces
No middleware, no server actions (`'use server'` nowhere), no `process.env` anywhere in `src/`. **[v]**

| Name | Type | File:Line | Auth | Purpose |
|---|---|---|---|---|
| `/` | page | src/app/page.tsx:31 (`generateMetadata` :11) | public | landing; passes `liveWaitlistFormToken()` to both forms |
| `/privacy` | page | src/app/(marketing)/privacy/page.tsx:12 | public, noindex | draft; main app's `requireAccess('/privacy')` removed |
| `/terms` | page | src/app/(marketing)/terms/page.tsx:11 | public, noindex | draft; `requireAccess` removed |
| `POST /waitlist` | route (**mock**) | src/app/waitlist/route.ts:45 | none, no rate limit | validates with zod, **stores nothing**; see below |
| `/sign-in` | link only | marketing-shell.tsx:49, :79 | — | route doesn't exist here → 404, expected (README:20) |

**`POST /waitlist` mock** (never copied back):
- 415 if the content-type isn't JSON.
- 413 if the body is over 4096 (`WAITLIST_BODY_MAX_BYTES`; this compares `text.length`, not bytes).
- 400 on bad JSON.
- 422 `{ok:false, formError, fieldErrors}` on zod failure (`waitlistSchema`, waitlist-schema.ts:84).
- Otherwise the **email local part triggers a scripted reply**:
  - `stale` → 409 `reload`
  - `changed`, or a `consentVersion` ≠ `WAITLIST_CONSENT_VERSION` → 409 `reload`
  - `busy` → 429 with `Retry-After: 600`
  - `down` → 503
  - `slow` → waits 2.5 s, then joins
  - `already` → 200 `already`
  - anything else → 200 `joined`
- Ignores `token`, the honeypot, `source` and `utm`. Replies carry `Cache-Control: no-store`. **[v]**
- Client: `waitlist-form.tsx:98` does a same-origin `fetch('/waitlist')` (`credentials:'omit'`). The form is `noValidate`, so the email/consent checks run in JS (`localErrors` :29), **not the browser as README:77 says**. **[v]**

## Data
- All page content is hard-coded; no persistence.
- `content.ts` holds the **lists** only:
  - `STEPS` :8, `SIGNAL_TYPES` :51, `INDUSTRY_PACKS` :118, `SEND_GATES` :137, `REJECT_EXAMPLES` :148, `FAQ` :187
  - `EXAMPLE_LEAD` :158 and `EXAMPLE_SCORE` :174, typed as `QueueCard`
- **Headlines, section h2/lead text and the Compliance tile bodies are hard-coded JSX in `landing.tsx`**, despite README calling `content.ts` "all landing copy": hero h1 at :66, subcopy :69. SEO title/description at `page.tsx:7-9`, header `NAV` at `marketing-shell.tsx:11`, footer links at :76-94. **[v]**
- `packs-snapshot.json` has 15 packs `{id,name,sectors,defaultSignals,sources}`. It is only reachable via `livePacks()` in `live.ts`, which **has no caller**. It exists for a richer Industries section (README "Known design gaps"), and its ids match `INDUSTRY_PACKS`.
- `live.ts` stubs: `liveWaitlistFormToken()` returns `'preview-token'`; `liveSiteUrl()` returns `http://localhost:3300`, so it is the `metadataBase`.

## Assets
- Source only: no `public/`, no images, no OG image (a known gap).
- **Favicon (2026-09-29):** `src/app/icon.svg` is the source: the BrandMark Radar in white on `#434db7` (= `oklch(0.475 0.165 274)`), rx 7. `favicon.ico` (16/32/48, transparent corners) and `apple-icon.png` (180, full-bleed square) are rasterised from it with headless Edge + PIL; regenerate both if the SVG changes. Next.js links all three automatically. These are app files, so list them in the handoff.
- Fonts come via `next/font/google`, which Next self-hosts at build time, so no third-party request happens at runtime. **[inferred]**

## External services
None. The only external URL is an `href` to gov.uk (`content.ts:165`).

## Conventions
- **Files and names:**
  - kebab-case files, PascalCase components
  - named exports everywhere except Next `page`/`layout`
  - SCREAMING_SNAKE for content constants and reusable class strings (`CONTAINER`, `FOCUS`, `H2`, `LEAD`, `NAV`)
- **Content data:** arrays are `readonly {...}[]`; icon names are string unions (`StepIcon`, `SignalIcon`) mapped to components in JSX (`STEP_ICONS`, `SIGNAL_ICONS`).
- **Aliases:** `@/*` → `src/*`; `@sl/ui` → `src/components/ui/index.ts`. Inside `ui/` imports are relative.
- **`'use client'`** only in `waitlist-form.tsx` and `ui/components/{field,label,separator,theme-toggle}.tsx`. Everything else is a server component.
- **Styling:** tokens only, never raw colours (`bg-card`, `text-muted-foreground`, …, via `cn()` = `twMerge(cx())`).
  - Dark mode = `@custom-variant dark` on `[data-theme='dark']`, or OS-dark unless `data-theme='light'`. "System" removes the attribute.
  - Frequent arbitrary sizes (`text-[13px]`, `text-[15px]`); `tabular-nums font-mono` for numbers.
- **Landing design language (2026-09-29):**
  - Constants in `landing.tsx`: `SectionHeader` (eyebrow with a primary dot, then `H2`, then `LEAD`), `CONTENT_GAP` (`mt-12 sm:mt-14`) from header to content, `CARD` + `CARD_HOVER` (lifts 2px, border turns `selected-border`, `shadow-md`), and `ICON_TILE` (`bg-selected text-primary ring-selected-border`).
  - `Section band` = `border-y bg-muted/40`. Bands alternate strictly: How plain → Signals band → Proof plain → Industries band → Compliance plain → FAQ band → CTA plain.
  - Accent (primary) only on eyebrows, icon tiles, numbers and CTAs.
  - Decoration (grid plus a primary glow via `color-mix`) only on the hero and the final CTA.
  - CTAs are the ui `Button` with an arrow that nudges right on `group-hover/cta`.
- **Motion (2026-09-29, v2)** uses three runtime deps the user asked for: `framer-motion` 13.4.6, `gsap` 3.15.0 and `lenis` 1.3.26. **They are not yet approved by the owner (README: ask first), and `pnpm-lock.yaml` is stale because they were installed with npm.** Each has one job:
  - **GSAP:** `hero-intro.tsx`, client. `HeroIntro` wraps the hero grid. Every `data-intro` child (pill, h1, lead, form, card) runs `fromTo` autoAlpha 0→1, y 24→0 over 1.4s, `power3.out`, 0.14s stagger. It uses `gsap.context` + `revert` rather than `@gsap/react`, to save a dependency.
    - The pieces are server-rendered with `INTRO` = `motion-safe:opacity-0` (in `landing.tsx`), so there's no flash. The catch: the hero stays blank until hydration.
    - `gsap.ticker.lagSmoothing(0)` is global, so a janky hydration can't stretch the intro.
  - **Framer:** `reveal.tsx`, client. `<Reveal as="div"|"li" delay>` fades in and rises from y 28 over 1.1s, `[0.22,1,0.36,1]`, `whileInView once` with margin −12% at the bottom. `useReducedMotion` renders it static. Grid siblings are staggered with `(index % cols) * 0.08`.
  - **Lenis:** `smooth-scroll.tsx`, mounted in `MarketingShell`. It uses `autoRaf`, `anchors` and lerp 0.09, and is off under reduced motion. It respects `scroll-margin-top` and doesn't cancel the click (hash and focus still move). Its CSS isn't in the package exports, and isn't needed here.
  - **No-JS fallback:** `MarketingShell` renders a `<noscript><style>` that forces `[data-intro],[data-reveal]` visible.
  - **Gotcha:** never export non-component values from a `'use client'` file into a server component; they arrive as client references, not values. That's why `INTRO` lives in `landing.tsx`.
  - **Gotcha:** hover lifts use `translate` (the Tailwind v4 `-translate-y-*` utilities), so they don't fight the `transform` that Framer and GSAP animate.
- **Icons:** only through the `Icons` namespace (`ui/icons.ts`); add new lucide icons there.
- **Comments:** `//` explains *why*, often noting how the main app differs; `/** */` one-liners on exports; British spelling.
- **TypeScript strictness** means conditional spreads for optional props (`page.tsx:19`, `field.tsx:290`) and explicit `!== undefined` checks.

## Where to add a thing
- **Landing section:**
  1. Export a function from `landing.tsx` using `<Section id labelledBy>` (:22) plus the `H2`/`LEAD` class constants.
  2. Put its list data in `content.ts`.
  3. Insert it in `page.tsx:34-43`.
  4. Add it to `NAV` if it needs a header link.
  - A larger section can go in its own file under `components/marketing/` (explicitly allowed).
- **UI primitive:** `src/components/ui/components/<name>.tsx` (cva + `cn` + `data-slot`), re-exported from `ui/index.ts`. **But ui/** mirrors a shared package**, so prefer `className` overrides at the call site, and list any ui/token change in the handoff.
- **Page:** `src/app/(marketing)/<slug>/page.tsx` with `SimplePage`/`LegalSection` (see `terms`), or `<MarketingShell>` directly.

## Hard rules (from README — the owner's contract)
- **May change:** layout, visuals, animation (respecting reduced motion), new components under `components/marketing/`, and proposed copy (copy is reviewed; every claim must be true of the product today).
- **Form contract is frozen:**
  - Field names: `email`, `name`, `company`, `role`, honeypot `website`.
  - JSON body keys: `token`, `website`, `email`, `name`, `company`, `role`, `consent`, `consentVersion`, `source`, `utm`.
  - `source` values: `landing-hero` / `landing-final`.
  - `WaitlistReply` shapes stay as defined.
  - `waitlist-schema.ts` changes only with sign-off.
- **Consent text:** `WAITLIST_CONSENT_TEXT` shows word for word and the box is unticked by default. A wording change needs sign-off and a new `WAITLIST_CONSENT_VERSION`.
- **Honeypot and tests:** the honeypot stays hidden and out of the tab order; **`data-testid`s stay** (the main app's e2e tests use them).
- **Accessibility:**
  - labelled inputs, with errors tied to fields via `aria-describedby`/`aria-invalid`
  - visible focus styles on everything interactive
  - WCAG AA in both themes
  - skip link plus landmarks, and exactly one `h1`
  - `prefers-reduced-motion` respected
  - no horizontal scroll at 375 px
- **Theming:** both themes plus the footer Light/Dark/System toggle work; tokens only.
- **Brand name** only via `BRAND_NAME`. **No real company or person names** in examples.
- **No new runtime deps without asking. No third-party scripts, fonts, trackers or images** (the main app has a strict CSP).
- **Never copied back** (so edits there are sandbox-only): `live.ts`, `waitlist/route.ts`, `packs-snapshot.json`, the trimmed `queue/view.ts` and `leads/format.ts`, and the config files.

## Risks & gotchas
- **Toolchain mismatch:** Node 22 against a required ≥ 24.11, and pnpm is broken, so npm was used. Don't commit `package-lock.json`. `pnpm build` can't run here as specified. **[v]**
- **Hard-coded counts drift from the data:** "Fifteen industries" (`landing.tsx:228`), "Seven gates" (:270), "Five steps" (:95), "Five parts" (:197). Update them if you change the arrays.
- **Featured signal:** chosen by a hard-coded id `'secured-loan'` (`landing.tsx:136-140`).
- **Join link:** `#join` (not `/#join`) only works because it renders on `/`.
- **Legal pages:** `simple-page.tsx:9` applies both `max-w-6xl` (`CONTAINER`) and `max-w-3xl`; tailwind-merge keeps 3xl, so the title misaligns with the logo (a known gap).
- **Focus ring:** the focus-ring class string is repeated in ~5 places. (The header's hand-rolled glass and join link were fixed 2026-09-29: now the `glass` utility and `<Button asChild>`.)
- **Visual verification:**
  - **GSAP can't be observed here:** the pane's document is `hidden` (rAF fires 0 times), and headless Edge barely fires rAF (5 frames in 2s real time, 2 frames under `--virtual-time-budget`). Framer and CSS animations still progress because they run on the compositor and timers. To check a GSAP timeline, temporarily drive `setInterval(() => gsap.ticker.tick(), 16)` with `lagSmoothing(0)`, capture with `--virtual-time-budget`, then remove it.
  - The browser pane's screenshots time out and its renderer freezes animations: hero opacity reads 0, and `innerWidth` is sometimes 0. It is still fine for computed-style and overflow checks after `resize_window` to mobile.
  - For real screenshots, use headless Edge: `msedge --headless=new --user-data-dir=<scratch> --blink-settings=preferredColorScheme=1` (0 = dark) `--window-size=1280,6800 --virtual-time-budget=6000 --screenshot=<png> http://localhost:3300/`, then slice the PNG with PIL.
  - Headless Edge has a minimum width of about 500px, so a 390px capture shows clipping that isn't real.
- **Unused here, probably used in the main app [inferred]:**
  - `TierChip`/`Tier` (badge.tsx)
  - `FieldGroup`/`FieldSet`/`FieldLegend`/`FieldTitle`/`FieldSeparator`
  - ~27 of ~47 icons
  - `--sidebar-*` / `--critical-soft` / `--control` tokens
  - the `animate-in`/`slide`/`zoom`/`glass` utilities
  - **Don't delete** — ui/ mirrors a shared package.
- **Browser extensions:** a hydration warning in `.next/dev/logs` comes from extensions (`cz-shortcut-listen`, `fdprocessedid`), not the code.
- **Mobile header (fixed 2026-09-29):** below `lg` there is `mobile-nav.tsx` (a toggle button plus a panel under the header, closed by a link, Escape or resizing to `lg`). "Join the waitlist" shows at every width; below `sm`, "Sign in" moves into the menu. The mobile gutter is `px-3` (12px); cards use `p-4`/`p-5` below `sm`.

## Open questions
1. What is your role here — redesigning it for the owner (`sidhartha8011`), and handing back a list of touched files?
2. Install Node 24 + pnpm 12 to match the brief, or keep npm/Node 22 and `.git/info/exclude` the `package-lock.json`?
3. Add a `sector-leads-dev` entry (:3300) to the workspace `.claude/launch.json` so the preview tools can run it?
4. Should `.claude/` (this map) stay out of the owner's repo? It is untracked; `.git/info/exclude` would keep it local.
