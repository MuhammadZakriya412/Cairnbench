# 01 — Project Brief, Locked Decisions, Stack and Repo Rules

Gemini: read this file at the start of every card. Nothing here may be changed by you.

## 1. What Cairnbench is

A free web workbench with a growing set of everyday tools (four at launch) for developers who work with AI, a shared vault for saving results, and an MCP server that lets AI agents use those tools and the vault. Users can work as guests (data stays in the browser) or sign in (data syncs to Supabase). Teams use Organizations to share a vault.

The four launch tools (more may be added later by following 01 §5.1):
1. **Context Packer** — turn files or pasted text into one AI-ready block, remove secrets, estimate tokens.
2. **API Runner** — chain HTTP requests, see timing, debug failures.
3. **Log, Regex & Cron Explorer** — filter big logs, test regexes, explain cron schedules.
4. **Prompt Composer** — reusable templates with fill-in forms and a live preview.

Audience tiers on one codebase: **A** portfolio demo → **B** small trusted team → **C** public launch. Tier gates are in `05_TASK_CARDS.md` Phase 8.

## 2. Locked decisions (never re-open)

| ID | Decision | Value |
|---|---|---|
| L1 | Product name | **Cairnbench** (single constant in `src/config/brand.ts`). Token prefix `cb_`. Reason for change from "Waystack": `waystack` is taken on npm and as a GitHub account; `cairnbench` was free on npm, crates.io and GitHub on 2026-11-14 (not a trademark check). |
| L2 | Backend | **Supabase free tier**: Auth, Postgres with Row-Level Security, Edge Functions. Firebase is rejected. |
| L3 | Hosting | Static site on **Cloudflare Pages** from GitHub. Do **not** use AI Studio's Cloud Run deploy (docs say pricing may apply). AI Studio preview is only for development. |
| L4 | Languages | **TypeScript** for everything in the app and Edge Functions. **SQL** for the database. **Rust** only in Phase 9 (optional Wasm engine). No other language. |
| L5 | Sign-in | Google, GitHub, email+password. Same verified email = one account. |
| L6 | Budget | **$0.** No paid service, no card, no paid tier. If something would cost money, stop and ask. |
| L7 | Voiceover | None. Captions and on-screen text only. |
| L8 | Animation library | **`motion`** only. No GSAP. |
| L9 | Styling | CSS variables for tokens + Tailwind CSS 4 for layout utilities. |
| L10 | Vault limits | 512 KB per item, 20 MB per user, 100 MB per org, last 20 versions per item. |
| L11 | LLM calls | **None** anywhere in the product (no Gemini/OpenAI calls). The MCP router is keyword-based. |
| L12 | Email | The product never sends email. Invites and shares are copyable links. |
| L13 | Billing | None. Not in scope. |
| L14 | Voice of UI | Plain English, no jargon, no developer slang on first-run screens. |

## 3. Environment and workflow

| Where | What happens there |
|---|---|
| AI Studio (Gemini) | Writes code, runs `npm` commands, typecheck, unit tests, headless browser checks — **only if the terminal exists; Card 0.0 proves this and records it.** |
| GitHub | Source of truth. AI Studio syncs to it. **GitHub Actions CI is the independent judge**: if CI is red, the card is not done, whatever Gemini says. |
| The user's Supabase dashboard | The user pastes migrations into the SQL Editor and pastes the result back. Gemini cannot see it. |
| Cloudflare Pages | Builds from GitHub on every push. |
| Local machine (optional) | Rust/Wasm build in Phase 9; anything Gemini cannot run. |

Things Gemini must never assume it can do: reach the user's Supabase dashboard, deploy Edge Functions, see GitHub Actions results, build Rust. It asks the user to do and paste back.

## 4. Library allowlist

Install only these. Version column = a version that **existed on the npm registry on 2026-11-14** (checked); it is **not** proof they work together. Rules: keep the AI Studio scaffold's existing React/Vite/TypeScript versions; install the others, then record the real resolved versions from `package.json` in `docs/DEPENDENCIES.md`. If install fails with a peer-dependency conflict: STOP, paste the error.

| Purpose | Package | Reference version |
|---|---|---|
| UI | `react`, `react-dom` | 19.3.1 |
| Build | `vite`, `@vitejs/plugin-react`, `typescript` | scaffold's versions |
| Styling | `tailwindcss` (+ its Vite plugin as per Tailwind's docs) | 4.3.5 |
| Routing | `react-router-dom` | 7.18.5 |
| Server state | `@tanstack/react-query` | 5.107.1 |
| UI state | `zustand` | 5.1.0 |
| Backend client | `@supabase/supabase-js` | 2.119.0 |
| Accessible primitives | `@radix-ui/react-popover`, `@radix-ui/react-dialog` (add other Radix primitives only by asking) | 1.3.1 |
| Command palette | `cmdk` | 1.1.1 |
| Split panes | `react-resizable-panels` | 4.22.1 |
| Long lists | `@tanstack/react-virtual` | 3.14.26 |
| Local storage | `idb-keyval` | 6.3.0 |
| Zip files | `fflate` | 0.8.3 |
| Text diff | `diff` | 9.0.0 |
| JSONPath | `jsonpath-plus` | 11.3.0 |
| Cron text | `cronstrue` | 3.39.0 |
| Cron next runs | `cron-parser` | 5.10.5 |
| Regex explain | `regexp-tree` | 0.1.27 |
| Token estimate | `gpt-tokenizer` | 4.1.2 |
| Validation | `zod` | 4.6.7 |
| Animation | `motion` | 14.14.0 |
| Icons | `lucide-react` | 1.72.0 |
| Fonts | `@fontsource/newsreader`, `@fontsource/plus-jakarta-sans`, `@fontsource/jetbrains-mono` | 5.3.0 each (OFL-1.1 license; `newsreader` confirmed on npm 2026-11-14) |
| Worker RPC | `comlink` | 4.4.2 |
| Unit tests | `vitest` | 5.1.0 |
| Component tests (approved for Card 0.3a; peers checked on npm 2026-11-14) | `@testing-library/react`, `@testing-library/dom` (required peer, ^10), `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom` (the DOM environment for vitest) | 16.3.3, 10.4.2, 14.6.10, 7.0.1, 31.0.1 |
| Property tests | `fast-check` | 4.10.2 |
| Browser tests | `@playwright/test`, `@axe-core/playwright` | 1.65.1, 4.14.0 |

Not verified at all (check at install, ask if missing): the Tailwind Vite plugin package name, and any HyperFrames npm package. Anything else: not allowed.

## 5. Repository layout (create exactly this; no extra top-level folders)

```
/
  docs/                    RULES.md, STATE.md, BACKLOG.md, DEPENDENCIES.md, 01..06 spec files, tutorials/
  scripts/                 sloplint.mjs (placed by the USER, never written by Gemini), small repo scripts
  src/
    config/                brand.ts, public.ts, limits.ts (all numeric limits from L10 and 02)
    design/                tokens.css, themes.css, fonts.ts
    ui/                    reusable components, one folder each (Button/, InputField/, ...)
    shell/                 AppShell, TopNav, OrgSwitcher, CommandPalette, ThemeMenu, routes
    pages/                 Home/, Apps/, AppPreview/, Workspace/, Vault/, McpHub/, Settings/, Docs/, Auth/
    apps/                  registry.ts (only file that lists apps), context-packer/, api-runner/, log-regex-explorer/, prompt-composer/
    core/                  pure TypeScript engines + interfaces (NO React, NO browser-only globals except in workers)
    vault/                 VaultStore interface, guestStore, cloudStore, importer, crypto
    orgs/                  org and sharing client code
    mcp/                   config generator, tool tester, client types
    lib/                   supabase client, zod schemas shared by client code, error types
    tests/                 shared fixtures (corpora)
  supabase/
    migrations/            numbered .sql files
    functions/             proxy/, mcp/ (Deno TypeScript)
    tests/                 rls_matrix.sql and friends
  .github/workflows/       ci.yml
```

### 5.1 App module contract (so new apps can be added later)
**Exactly one file names the apps: `src/apps/registry.ts`.** The top bar, Home, Apps page, command palette, vault filters, MCP Hub and routes all read the registry. No other file may contain an app id string or a hard-coded list of apps (a CI grep in Card 0.5 fails on it).

Every app lives in `src/apps/<id>/` and exports one `manifest`:
`id` (kebab-case, 3–32 chars, never changed after release), `name`, `tagline` (≤ 12 words), `tags`, `icon` (lucide name), `workspace` (lazy-loaded component, so each app is its own JS chunk), `contentSchema` (Zod schema of what it stores in `vault_items.content`), `schemaVersion` (int), `migrate(oldContent, fromVersion)` (pure, tested), `presets`, `mcpTools` (zero or more tool definitions, see 02 §9), `tutorial` (id or null), `searchText` (what command palette search matches), `description` (≤ 2 sentences, used by `FeatureRow` on Home), `snippet` (exactly 2 short mono lines shown in `FeatureRow`, each ≤ 48 characters).

Rules: an app may import `core/`, `ui/`, `vault/` only. Adding an app must need **no database migration** unless it needs a new table. Saved content always carries `schemaVersion`; reading old content runs `migrate`. The step-by-step card for adding an app is `05_TASK_CARDS.md` Card A.1.

Import rules: `core/` imports nothing from `ui/`, `pages/`, `apps/`, `vault/`. `apps/*` never import from each other. `pages/*` may import from `apps/*`, `ui/`, `core/`, `vault/`. Circular imports are a failure.

## 6. Conventions

- Files: max 250 lines. One component per file. Folder per component with `index.ts`, `Component.tsx`, `Component.test.tsx`.
- Names: components `PascalCase`, hooks `useThing`, functions `camelCase`, constants `SCREAMING_SNAKE`, files match their main export.
- Errors: engine and store functions throw an `AppError` with a stable `code` string (list kept in `src/lib/errors.ts`) and a developer message. The UI maps `code` → a user message from the copy deck. Never show raw error text to users.
- Async: every network or worker call has a timeout and cancellation. No unhandled promises.
- Idempotency: every write that may be retried (import, save, share, invite acceptance) is safe to repeat.
- No `console.log` in committed code except in `scripts/`. Use a tiny `logger` that drops everything in production builds and never logs content, tokens or passwords.
- Accessibility and states: see 03.

## 7. Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Home | Landing page: hero, tutorials, tools, trust, AI connection |
| `/apps` | Apps | The workbench: paste strip, recent work, numbered tool index |
| `/app/:appId/overview` | AppPreview | Tutorial player + try-it sandbox + Launch button |
| `/app/:appId/workspace` | Workspace | The real tool |
| `/vault` | Vault | Personal / Organization tabs |
| `/mcp` | McpHub | Connect AI tools |
| `/settings` | Settings | Profile, Appearance, Organizations, Security |
| `/auth` | Auth | Sign in / sign up |
| `/join/:token` | JoinOrg | Accept invite link |
| `/share/:token` | OpenShare | Open shared item link |
| `/docs/:topicId` | Docs | Topic reader; `/?docs=x` redirects here |

`appId` is any id present in `src/apps/registry.ts` (today: `context-packer`, `api-runner`, `log-regex-explorer`, `prompt-composer`). An unknown id shows the NotFound page. Cloudflare Pages needs a SPA fallback file; Card 0.1 creates it.

## 8. Storage modes

`VaultStore` is an interface in `src/vault/` with the methods: `list(filter)`, `get(id)`, `save(item)`, `softDelete(id)`, `listVersions(id)`, `exportAll()`. Two implementations:
- **guestStore**: IndexedDB through `idb-keyval`. Every item gets a client-generated UUID on creation.
- **cloudStore**: Supabase tables with RLS.
The app picks one store from auth state. When a guest signs in, the **importer** copies guest items to the cloud with `upsert` on `id`, shows "Imported N items", and **never deletes local data** unless the user chooses "Clear this device".

## 9. Config and secrets

- `src/config/public.ts` exports `SUPABASE_URL` and `SUPABASE_ANON_KEY` as plain constants that the user edits. They are public by design; Row-Level Security is the protection. If either is empty, the app runs in guest-only mode and shows a clear "Cloud sync is off" notice in Settings.
- AI Studio's Secrets panel is documented as **server-side only**; do not rely on it for browser code.
- The `service_role` key and any other secret never enter the repo. Before every commit run a search for `service_role` and `eyJ` in tracked files and paste the (empty) result.

## 10. Out of scope (do not build, do not suggest mid-card)

Billing, email sending, LLM calls, mobile apps, i18n, real-time collaboration, comments threading beyond one level, file attachments, admin dashboards beyond the owner view, analytics trackers, social login other than Google/GitHub, custom domains.

## 11. State files (Gemini maintains)

- `docs/STATE.md`: current phase, table of card IDs with status `todo | done-PASS | done-PARTIAL | blocked`, links to evidence, the list of user actions still pending, the environment probe result.
- `docs/BACKLOG.md`: one line per idea noticed but not built.
- `docs/DEPENDENCIES.md`: package → exact installed version → card that added it.
- `docs/DECISIONS.md`: only the user writes here. If Gemini thinks a decision needs changing, it asks per R11.

## 12. Git rules

- Gemini's terminal has **no `.git` folder** (ENVIRONMENT.md, 2026-11-14): it cannot commit or push. The user syncs the AI Studio project to GitHub after each card, one commit per card, message `card <ID>: <imperative summary>`. Gemini never claims to have committed or pushed.
- **Package manager is npm only.** The scaffold contains `bun.lock`; do not use bun and do not commit `bun.lock`. `package-lock.json` is generated by `npm install` (never edited by hand) and committed, because CI uses `npm ci`.
- **Scaffold leftovers** (`@google/genai`, `express`, `dotenv`, `esbuild`, `tsx`, `autoprefixer`) are not part of Cairnbench. Never import them in `src/`; list them in `docs/DEPENDENCIES.md` as "scaffold, unused". Do not remove them without asking, because AI Studio's preview may need some.
- The scaffold's own versions win over the reference versions in §4 (for example `lucide-react` 0.x, `motion` 12.x). Record what `package.json` resolves to.
- `.gitignore` includes `node_modules`, `dist`, `.env*`, `*.log`, `playwright-report`, `test-results`.
- Never commit built files or `node_modules`.
- Never force-push. Never rewrite history.

## 13. Global Definition of Done (every card)

1. Card's acceptance checks all PASS with output pasted, or an explicit NOT RUN/CANNOT RUN HERE with reason.
2. `npm run typecheck`, `npm run lint`, `npm test` exit 0 (output pasted).
   Whenever `package.json` changed in the card: also `npm ci --dry-run` exits 0, and `ls -l package-lock.json` plus `grep -c "<one newly added package>" package-lock.json` show the lockfile contains it (output pasted). CI uses `npm ci`, which fails if the lockfile is stale. (This failed on Card 0.3a: the container's lockfile was never updated.)
3. No file over 250 lines; no new dependency outside the allowlist.
4. `docs/STATE.md` updated; USER ACTIONS listed.
5. The user can confirm GitHub Actions is green. If the user reports red, the card reopens.

## 14. Glossary (for UI copy and docs)

- **Vault**: your saved results.
- **Organization**: a group of people who share a vault.
- **Share link**: a link that gives one person access to one item.
- **Redaction**: hiding a secret in text before you share it.
- **MCP**: a standard way for AI apps to call tools. In the UI say "Connect to AI tools".
- **Proxy**: the Cairnbench server that sends your API test request for you when your browser can't. In the UI say "Send through Cairnbench".
- **Guest mode**: use everything without an account; data stays on this device.
