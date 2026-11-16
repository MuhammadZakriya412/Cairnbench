# 05 — Task Cards (one card = one chat = one commit)

Order matters: do cards in ID order unless STATE.md says otherwise. Each card lists **Read first**, **Files**, **Steps**, **Do not**, **Checks**, **User actions**. "Checks" are commands whose pasted output proves the card. Standard scripts (created in card 0.1): `npm run dev`, `build`, `typecheck`, `lint`, `test`, `test:e2e`, `sloplint`.

"Gate" = the card is done only when the user confirms GitHub Actions is green for that commit.

---

## PHASE 0 — Foundations

### Card 0.0 — Environment probe (no product code)
- **Goal:** record what this AI Studio workspace can really do, so no later card relies on a guess.
- **Read first:** `docs/RULES.md`, `01`.
- **Files:** create `docs/ENVIRONMENT.md`, `docs/STATE.md` (empty tables per 01 §11).
- **Steps:** run and paste raw output of: `uname -a`; `node -v`; `npm -v`; `git --version`; `which docker rustc cargo wasm-pack supabase playwright-cli bun`; `ls -la`; `cat package.json`; `npm run` (list scripts); `npm view react version`; try launching a headless Chromium via whatever browser tool exists and report the exact command and result, or `CANNOT RUN HERE`; try `git remote -v` and `git status`. Then write `ENVIRONMENT.md` containing **only** facts from that pasted output, each with the command that produced it.
- **Do not:** install anything, edit any other file, infer a capability that was not shown.
- **Checks:** every line of ENVIRONMENT.md maps to pasted output.
- **User actions:** confirm the GitHub repo is connected in AI Studio's GitHub settings; paste the repo URL into STATE.md.

### Card 0.1 — Repo hygiene, scripts, CI, state files
- **Read first:** 01 (all), 00.
- **Files:** `.gitignore`, `package.json` (scripts), `tsconfig.json` (strict), ESLint config, Vitest config, `.github/workflows/ci.yml`, `public/_redirects` (SPA fallback for Cloudflare Pages: one rule sending every path to `/index.html` with status 200), `docs/RULES.md` (copy of 00's prompt), `docs/BACKLOG.md`, `docs/DEPENDENCIES.md`, `src/config/brand.ts`, `src/config/limits.ts`, `src/config/public.ts` (empty-string constants), `src/lib/errors.ts` (`AppError` + code list stub with the codes already named in 04).
- **Steps:** (1) keep the scaffold's React/Vite/TS versions; (2) add only: `vitest`, `zod`, and for lint `eslint`, `@eslint/js`, `typescript-eslint` (these three are approved here; check each is on npm with `npm view <name> version` and paste it); run `npm install` once so `package-lock.json` exists; ask before adding anything else (for example `@testing-library/react`); (3) strict TS options incl. `noUncheckedIndexedAccess`; (4) ESLint rule set forbidding `any`, `@ts-ignore`, `eslint-disable` and `console`; (5) CI workflow: checkout, setup Node with the **same major version `ENVIRONMENT.md` recorded**, `npm ci`, typecheck, lint, test, build; (6) first test: `limits.ts` exports the L10 numbers (512 KB etc.) — write it, show it fail, implement, show pass.
- **Do not:** add any library not named here; edit `package-lock.json` by hand; add a Dockerfile; add Cloud Run files.
- **Checks:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` all exit 0 (outputs pasted); a deliberately added `any` makes lint fail (show, then remove).
- **User actions:** sync the project to GitHub from AI Studio (Gemini cannot push); open the repo's Actions tab; confirm the first run is green. Create a free Cloudflare Pages project from the repo (build command `npm run build`, output `dist`) and paste the `*.pages.dev` URL into STATE.md.

### Card 0.2 — Design tokens, themes, contrast test
- **Read first:** 03 §3–4.
- **Files:** `src/design/tokens.css` (spacing, radius, shadow, type scale), `src/design/themes.css` (2 themes, `cairn-dusk` and `cairn-daylight`, via `[data-theme]`; plus `--ease-calm`), `src/design/fonts.ts`, `src/design/theme.ts` (read/write the theme, density, motion attributes on the root; default from `prefers-color-scheme`), tests.
- **Steps:** (1) define every token from 03 §3 exactly; (2) fonts via the three `@fontsource` packages (`newsreader` 400/500, `plus-jakarta-sans`, `jetbrains-mono`; import only the weights used); (3) write a **contrast test** that parses the CSS variables for each theme and asserts every pair listed in 03 §3 meets its minimum; (4) test that `theme.ts` sets and restores attributes and ignores unknown values.
- **Do not:** invent colors, add a third theme, hardcode any hex outside `themes.css`.
- **Checks:** tests green; deliberately change one token to a failing value → contrast test fails (show), restore.

### Card 0.3a — Form components
- **Read first:** 03 §4–5, §9.
- **Files:** `src/ui/Button`, `InputField`, `TextAreaField`, `SelectField`, `Switch`, `Checkbox` (each folder with component, test, `index.ts`), `src/ui/copy.ts` (strings from 03 §8).
- **Steps:** first install the five component-test packages approved in 01 §4 (no need to ask) and configure vitest to use `jsdom` for component tests; also install the allowlisted `@playwright/test` and `@axe-core/playwright` and check whether a browser is available in this container (report the command and output). If the axe run cannot work here, write the test anyway, mark that check CANNOT RUN HERE, and list it under USER ACTIONS: it must be run in CI (Card 0.5 adds the CI job) before the card counts as done. Then: build all five states for each; tests with Testing Library asserting label association, `aria-describedby` for errors, disabled/loading behavior (button is disabled and shows progress while `loading`), keyboard activation.
- **Do not:** add a component outside the list; use raw hex or px values; use placeholder as the label.
- **Checks:** unit tests green; axe via Playwright on a temporary `/__kit` route in both themes: 0 serious/critical (paste); remove the route before the commit, or keep it only if guarded behind `import.meta.env.DEV`.

### Card 0.3b — Overlay and feedback components
- **Files:** `InfoPopover`, `ModalDrawer`, `Tabs`, `Badge`, `Toast` (+ live region), `Skeleton`, `EmptyState`, `ErrorState`, `CopyButton`, `Kbd`.
- **Steps:** use Radix Popover/Dialog (read their type definitions first). `InfoPopover` rules in 03 §5. Tests: opens by click/Enter/Space; closes by Esc and outside click; focus returns to the trigger; link opens `/docs/:topicId` in a new tab with `rel="noopener"`.
- **Checks:** unit tests + axe as in 0.3a.

### Card 0.3c — Layout components
- **Files:** `SplitPane`, `ToolRow`, `FeatureRow`, `DiffView`, `SiteHeader`, `SiteFooter`, `TrustStrip`.
- **Steps:** `SplitPane` uses `react-resizable-panels`, keyboard resizing documented in its README (read it, quote). `DiffView` uses `diff`; both modes; tests with a 3-line before/after.
- **Checks:** unit tests + axe.

### Card 0.4 — Application shell and routing
- **Read first:** 03 §6–7, 01 §7.
- **Files:** `src/shell/*`, `src/pages/*/index.tsx` (placeholder pages that render a real heading and an `EmptyState` — not lorem ipsum), logo SVG component `src/ui/Logo`, `src/shell/CommandPalette`.
- **Steps:** top bar per 03 §6; routes per 01 §7; `?docs=x` redirect; command palette with the actions listed in 03 §6; mobile menu under 768 px; theme menu with System, Dusk (dark) and Daylight (light); org switcher renders "Personal" only until Phase 2.
- **Also:** create `src/apps/registry.ts` per 01 §5.1 with the four launch apps as manifests whose `workspace` is a lazy placeholder; nav, Home, Apps page and palette read it. Add a test: registering a fake fifth app (in the test only) makes it appear in Home, Apps and the palette with no other file changed.
- **Do not:** add a footer/status bar; add a fifth top-level destination.
- **Checks:** Playwright test navigates every route by keyboard; ⌘K/Ctrl+K opens and Esc closes; axe in both themes on `/`; screenshot at 375 px and 1280 px saved to the test-results folder (paths listed).

### Card 0.5 — Quality gates
- **Files:** `public/_headers` (CSP, `frame-ancestors 'none'`, referrer policy), CI additions, `docs/SECURITY_CHECKLIST.md` (from 02 §11), `package.json` script `sloplint`.
- **Steps:** add Playwright + axe job to CI (install Chromium in the job); add a CI step that fails if `service_role` or `sb_secret_` appears in tracked files; add a CI step that fails if any app id string (e.g. `context-packer`) appears in `src/` outside `src/apps/` and `src/apps/registry.ts`; wire `sloplint` **only after the user has placed `scripts/sloplint.mjs`** (read its header/`--help`, quote supported options).
- **Checks:** CI workflow runs; local equivalents pasted.
- **User actions:** download the official `sloplint.mjs` from `Nutlope/hallmark` into `scripts/`; confirm its license file allows use; push; confirm Actions green. **Gate for Phase 0.**

---

## PHASE 1 — Guest tools, auth and personal vault, App 1

### Card 1.1 — Core interfaces and fixtures
- **Read first:** 04 §0, §1.4–1.6.
- **Files:** `src/core/scrub/*`, `src/core/tokens/*`, `src/core/htmlCompact/*`, `src/tests/corpus/*`, interfaces in `src/core/types.ts`.
- **Steps:** define interfaces; write corpus builders (runtime-assembled strings); write tests for every rule row in 04 §1.4 (positives and negatives) and for the HTML example in 04 §1.6 (exact output) — **all red first**; then implement.
- **Checks:** red run pasted, then green; recall ≥ 95% report printed by a test; zero negatives matched.

### Card 1.2 — Guest store
- **Files:** `src/vault/types.ts` (Zod item schema), `VaultStore.ts`, `guestStore.ts`, tests with a fake IndexedDB (name the package and ask — not on allowlist; or test through Playwright in a real browser).
- **Steps:** all `VaultStore` methods; client UUIDs; quota check (512 KB item, 20 MB total) with `AppError` codes `E-VAULT-ITEM-TOO-LARGE`, `E-VAULT-QUOTA`; versions kept (max 20).
- **Checks:** tests green; oversize and quota cases covered.

### Card 1.3 — Supabase client, config, auth UI
- **Read first:** 01 §9, 02 §1.
- **Files:** `src/lib/supabase.ts`, `src/pages/Auth/*`, `src/vault/useStore.ts`.
- **Steps:** first read the current Supabase docs (JS client setup and API keys guide), quote the URL and the exact client call in REPORT; create the client **only if** `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are non-empty; otherwise export `null` and run guest-only; sign-in with Google, GitHub (OAuth), email+password (min length 12); handle chosen after first sign-in; show `cloud.off` when unconfigured; call `signup_allowed()` before sign-up **once migration 001 exists** (until then, skip with a note).
- **Do not:** write any provider secret anywhere; call admin APIs.
- **Checks:** with empty config, the app builds and works as guest (Playwright); unit test the "no config" branch.
- **User actions:** in Supabase create the project; enable Google and GitHub providers per the steps in 06 §7; paste URL and publishable key into `src/config/public.ts` (the publishable key is public by design).

### Card 1.4 — Migration 001 (profiles, vault) and tests
- **Read first:** 02 (all of §1–§4, §6, §10).
- **Files:** `supabase/migrations/001_profiles_vault.sql`, `supabase/tests/001_personal_rls.sql`.
- **Steps:** tables 2.1, 2.3, 2.4, 2.8 (`usage_counters`), triggers in 02 §3, quotas, RLS for **personal items only** (org rules arrive in 2.1), `signup_allowed()`, `consume_usage`, `export_my_data`, `delete_my_account`. Test script acts as two users and anon per 02 §10.
- **Do not:** touch the `auth` schema except the profile trigger; use generated columns; enable anything on `service_role`.
- **Checks:** none runnable here — mark every check **CANNOT RUN HERE**.
- **User actions:** run the migration and test in a throwaway Supabase project; paste outputs; Gemini fixes until the pasted output passes; then run on the real project; paste the result of `select tablename, rowsecurity from pg_tables where schemaname='public';`.

### Card 1.5 — Cloud store and importer
- **Files:** `src/vault/cloudStore.ts`, `src/vault/importer.ts`, tests with a mocked Supabase client interface.
- **Steps:** `cloudStore` implements `VaultStore`; handle `version_conflict` and quota errors by `AppError` codes; importer `upsert`s by `id`, reports counts, retries safely, never deletes local data; "Clear this device" is a separate explicit action with a confirm dialog.
- **Checks:** tests for retry-twice-no-duplicates (using the mock), conflict handling, partial failure resume.

### Card 1.6 — App 1 workspace
- **Read first:** 04 §1, 03 §7.
- **Files:** `src/apps/context-packer/*`, `src/core/pack/*` (file selection, ignore rules, formatters, zip guard), worker wiring, tests, a sample project fixture.
- **Steps:** build in this order, each with tests first: file selection rules → formatters (three formats) → zip guard → scrub UI with per-hit switches → diff → token estimate and budget meter → compact-HTML mode → save to vault.
- **Checks:** unit tests; Playwright flow: paste a text containing a runtime-built AWS example key → hit listed → toggle off → output changes accordingly → save → appears in `/vault`; axe in both themes.

### Card 1.7 — Vault page
- **Files:** `src/pages/Vault/*`.
- **Steps:** list/search/filter/open/history (version list)/delete (soft)/export JSON; recently-deleted view within 30 days; all five states; sizes shown.
- **Checks:** Playwright flow; axe.

### Card 1.8 — Settings (Profile, Appearance, Security, Storage)
- **Files:** `src/pages/Settings/*`.
- **Steps:** theme/density/motion persist (profile row when signed in, local storage when guest); redaction rule toggles; usage bars with 80%/95% states; Export my data; Delete my account (confirm by typing the handle).
- **Checks:** Playwright; axe. **Gate for Phase 1 (also tier A prerequisite).**

---

## PHASE 2 — Organizations and sharing

### Card 2.1 — Migration 002 (orgs, invites, shares, annotations, audit) and matrix test
- **Read first:** 02 (all).
- **Files:** `supabase/migrations/002_orgs_sharing.sql`, `supabase/tests/rls_matrix.sql`.
- **Steps:** tables 2.2, 2.5–2.7, 2.8 (`audit_log`), helpers, RPCs of §5 (org, invite, share, tokens, account), policies from §4; matrix test with 8 actors; **every cell of the §4 table has a test**.
- **Checks:** CANNOT RUN HERE; user pastes the output of the matrix script; all cells pass.

### Card 2.2 — Org UI
- Org create/switch, member list, invite link (copy once, shows expiry), role changes, remove, transfer ownership, leave; join page `/join/:token`.
- **Checks:** Playwright with mocked RPCs; axe.

### Card 2.3 — Sharing UI
- Share dialog (people by handle/verified email, link share with permission and expiry), pending shares list, open `/share/:token`, revoke.
- **Checks:** Playwright with mocks; tests that an edit-sharee cannot see a "Share" action.

### Card 2.4 — Versions, diff, review
- Version list, `DiffView` between any two versions, annotations with status changes per §4.
- **Checks:** unit + Playwright.

### Card 2.5 — Audit log and encryption
- Audit view for owner/admin; client-side encryption per 02 §7 with the confirm checkbox; UI badges; tests for round trip, wrong passphrase, tampered ciphertext (authentication tag failure), IV uniqueness across 1,000 saves.
- **Gate for Phase 2 (tier B prerequisite).**

---

## PHASE 3 — Home, previews, tutorials, docs

### Card 3.0 — Spike: HyperFrames (optional export path only)
- **Goal:** answer with evidence: license, whether it can export MP4 from our scene data. **Tutorials do not depend on it:** the player in 3.2 is our own code.
- **Steps:** the **user** pastes the official README and `LICENSE` text from `heygen-com/hyperframes`; Gemini summarizes **only what is pasted**; any claim not in the paste is marked UNVERIFIED. Skip this card entirely if you do not want exported videos.
- **Files:** `docs/HYPERFRAMES_SPIKE.md`. No code.

### Card 3.1 — Landing page and workbench page
- **Read first:** 03 §1–§3, §5, §7, §8; 01 §5.1.
- **Files:** `src/pages/Home/*` (all six sections), `src/pages/Apps/*` (`PasteStrip`, recent list, tool index), `src/ui/ProductWindow`, `src/ui/McpBand`, `src/ui/PasteStrip`, wiring to the registry, copy keys in `src/ui/copy.ts`.
- **Steps:** build Home exactly per 03 §7 (strings from the copy deck only). The tutorials section may show the player placeholder until 3.2 lands, but must be a real component with an empty state, not fake data. `ProductWindow` is built from UI-kit components and the sample fixture in `src/tests/fixtures`, with two redactions shown using the real rule ids (for example `[REDACTED:aws-access-key]`). Recent list reads the active VaultStore.
- **Do not:** add logos, testimonials, ratings, statistics, stock images, gradients or any card grid; add routes beyond 01 §7.
- **Checks:** Playwright: keyboard-only run through Home and Apps; screenshot at 375 px and 1280 px in both themes saved to test-results (paths listed); axe in both themes; a test asserting Home renders one `FeatureRow` per registered app (fake app in the test).

### Card 3.2 — TutorialPlayer and App Preview
- **Read first:** 03 §5, §7, §9; 04 §6.
- **Files:** `src/core/tutorial/*` (pure timeline controller and scene schema in Zod), `src/ui/TutorialPlayer`, `src/pages/AppPreview/*`, `docs/TUTORIAL_AUTHORING.md` (the `data-tour` convention).
- **Steps:** controller first with tests (seek, play/pause, speed 1/1.5/2, chapter jump, end-of-scene, unknown action rejected by Zod); then the player: runs scene actions on the real components in a sandboxed instance with sample data (never the user's vault), captions on by default, transcript below, play/pause, scrubber, chapters, keyboard shortcuts (Space, ←/→, C), reduced motion = no cursor animation, jump between steps. **Never autoplay.**
- **Checks:** unit tests for the controller; Playwright test plays scene 1 to the end by seeking; axe in both themes.

### Card 3.3 — Docs reader and InfoPopover wiring
- Render `docs/tutorials/*.md` at build time (ask which markdown library; it is not on the allowlist); popover topic ids all resolve; broken ids fail a test.

### Card 3.4 — Tutorial scenes
- **Read first:** 04 §6.
- Implement the four scenes from 04 §6 as data files in `src/apps/<id>/tutorial.ts`, one per app, plus a `data-tour` attribute on every element a scene targets. Each scene is 45–75 s with at least 5 chapters. Content must match the shipped UI; if a target does not exist, STOP and report instead of inventing it.
- **Checks:** a test that every `target` in every scene resolves in the rendered app; total scene length within 45–75 s.

### Card 3.5 — Optional: hero LiveScrubDemo
- Build last, only after Phase 8. A textarea pre-filled with a fake key built at runtime (never a literal secret-looking string in source), showing redaction live with the real scrubber engine. Nothing is sent anywhere. Checks: unit test; axe; keyboard.

---

## PHASE 4 — App 3 (read 04 §3)
- **4.1** log engine (chunk reader, line splitter, filters, JSONL facets) with the 7-byte-chunk UTF-8 test.
- **4.2** regex engine + worker timeout + explanation mapper.
- **4.3** cron tab using the verified examples.
- **4.4** workspace UI, virtualized list, empty/error states, save to vault.
- **Checks per card:** unit tests; Playwright with a generated 20 MB log (generated by the test, not committed); axe.

## PHASE 5 — App 4 (read 04 §4)
- **5.1** template parser/renderer (all rules in 04 §4.1, errors with positions) — tests first.
- **5.2** variables panel + form + preview + includes (depth/cycle).
- **5.3** five presets written from scratch, ≤ 250 words each; save/share through the vault.

## PHASE 6 — App 2 and proxy (read 04 §2, 02 §8)
- **6.0** Spike (no product code): the user pastes Supabase Edge Function docs about outbound networking; Gemini writes a tiny test function that tries to connect to a fixed IP with the original host name; the user deploys it and pastes the result. Output: `docs/PROXY_SPIKE.md` stating exactly what works. If pinning is impossible, apply the fallback in 02 §8 step 3 and write `docs/KNOWN_RISKS.md`.
- **6.1** URL/IP validation library with the full hostile list (02 §8) — tests first; stubbed resolver.
- **6.2** proxy Edge Function using 6.1, `consume_usage`, kill switch. **User deploys** and pastes responses to the hostile list.
- **6.3** runner engine (variables, extraction, assertions, limits, cancel) — stubbed `fetch`.
- **6.4** App 2 UI (builder, run view, viewer, hints, curl import/export, direct vs via Cairnbench badge).
- **Gate:** every hostile URL rejected in the **deployed** function (user pastes outputs).

## PHASE 7 — Connect AI (MCP) (read 02 §5, §9)
- **7.0** the **user pastes** the current MCP specification pages for the HTTP transport and the current setup docs for Claude Desktop, Cursor, Zed and Windsurf. Gemini writes `docs/MCP_NOTES.md` summarizing only what was pasted. No code.
- **7.1** `mcp_*` RPC migration `003` + tests (user runs).
- **7.2** shared tool implementations in `src/core/mcp/*` (scrub, cron, regex, render template) reused by the Edge Function; BM25 router with tests (10 labeled queries → expected tool).
- **7.3** Edge Function `supabase/functions/mcp` per the notes; **user deploys**; test with the MCP Inspector or a real client and paste the transcript.
- **7.4** `/mcp` page: token creation (shown once, copy), per-client setup tabs from `MCP_NOTES.md`, schema-driven tool tester, "I choose / Suggest a tool" switch, token list/revoke.
- **Checks:** unit tests; the user's pasted successful `tools/list` and one `tools/call` transcript from a real client.

## PHASE 8 — Hardening and launch tiers

### Card 8.1 — Accessibility and performance pass
Run axe on every route in both themes; initial JS ≤ 200 KB gzip excluding lazy chunks (report from the build); Lighthouse CI score ≥ 90 on `/` (paste); fix findings.

### Card 8.2 — Free-tier guards
`MAX_USERS` waitlist screen, `PROXY_ENABLED`/`MCP_ENABLED` handling, 80%/95% storage states, a keep-alive scheduled workflow (GitHub Actions cron calling a cheap public RPC), encrypted weekly backup workflow (user generates the `age` key pair locally and stores the private key offline; Gemini writes the workflow using the public key only).

### Card 8.3 — Retention jobs and account deletion test
Scheduled purge of soft-deleted items (30 days) and audit log (1 year) using Supabase's scheduler documentation **pasted by the user**; full account-deletion test with a throwaway account.

### Card 8.4 — Legal and privacy pages
Privacy notice and terms from plain-language templates the user supplies; contact address; data list; no analytics.

### Card 8.5 — Release checklist
`docs/RELEASE.md`: version, changelog, security checklist all ticked with evidence, backup restore drill done once, tutorials re-recorded if UI changed.

### Tier gates
- **Tier A (portfolio):** Phases 0–3 + App 1 polished, a read-only seeded demo account, README with diagram, axe clean, Lighthouse ≥ 90.
- **Tier B (small team):** Phases 0–7, matrix green in the user's pasted output, backup + restore drill done, security checklist signed.
- **Tier C (public):** B + 8.2–8.5, hostile-URL gate on the deployed proxy, self-audit complete, proxy kept off if pinning was impossible.

---

## APPENDIX A — Adding a new app later (template, run after Phase 8 or any time after Phase 1)
### Card A.1 — Add app `<id>`
- **Read first:** 01 §5.1, 03 §5 (components), the new app's spec section in 04 (the user writes it first, same shape as existing sections: behavior, limits, edge cases, examples, tests).
- **Files:** `src/apps/<id>/*`, optional `src/core/<id>/*`, one line in `src/apps/registry.ts`, tests, one tutorial entry if the manifest names one.
- **Steps:** write the spec in 04 (user) → core engine with tests first → `contentSchema` + `schemaVersion: 1` + `migrate` (identity) with a test → workspace UI with all five states → registry entry → vault save/load round trip in guest and cloud modes → optional `mcpTools`.
- **Do not:** touch other apps, nav, DB migrations (unless the spec says a new table), or add a dependency without asking.
- **Checks:** registry grep gate passes; vault round-trip test; axe in both themes on `/app/<id>/workspace`; initial JS budget unchanged (new app is a lazy chunk).
- **If it needs a new table or Edge Function:** that is a separate card with its own matrix tests, never part of A.1.

---

## PHASE 9 — Optional: Rust/Wasm engine (not before Phase 8)
- **9.1** crate `crates/engine/` implementing the secret scanner and log line filter behind the **same interface** and test corpus. Built in GitHub Actions (`cargo test`, `wasm-pack build`) or locally by the user; Gemini cannot build it here.
- **9.2** differential test: for every corpus input, Rust output equals TypeScript output byte for byte.
- **9.3** swap behind a setting "Use fast engine (experimental)" with automatic fallback to TypeScript on any load error.
- **Rule:** the TypeScript engine stays forever as fallback and test oracle.
