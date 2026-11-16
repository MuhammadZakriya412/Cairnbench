# Project State (`docs/STATE.md`)

- **Current Phase:** Phase 0 — Foundations
- **GitHub Repository URL:** _(Pending user action: paste repo URL here)_
- **Cloudflare Pages URL:** _(Pending Card 0.1 user action)_

## 1. Card Status Table

| Card ID | Title | Status | Evidence |
|---|---|---|---|
| 0.0 | Environment probe (no product code) | `done-PASS` | `docs/ENVIRONMENT.md` |
| 0.1 | Repo hygiene, scripts, CI, state files | `done-PASS` | `docs/DEPENDENCIES.md`, `.github/workflows/ci.yml`, `src/config/limits.test.ts` |
| 0.2 | Design tokens, themes, contrast test | `done-PASS` | `src/design/tokens.css`, `src/design/themes.css`, `src/design/fonts.ts`, `src/design/theme.ts`, `src/design/contrast.test.ts`, `src/design/theme.test.ts` |
| 0.3a | Form components | `done-PASS` | `src/ui/copy.ts`, `src/ui/Button/*`, `src/ui/InputField/*`, `src/ui/TextAreaField/*`, `src/ui/SelectField/*`, `src/ui/Switch/*`, `src/ui/Checkbox/*`, `e2e/kit-axe.spec.ts` |
| 0.3b | Overlay and feedback components | `done-PASS` | `src/ui/InfoPopover/*`, `src/ui/ModalDrawer/*`, `src/ui/Tabs/*`, `src/ui/Badge/*`, `src/ui/Toast/*`, `src/ui/Skeleton/*`, `src/ui/EmptyState/*`, `src/ui/ErrorState/*`, `src/ui/CopyButton/*`, `src/ui/Kbd/*`, `e2e/kit-axe.spec.ts` |
| 0.3c | Layout components | `done-PASS` | `src/ui/SplitPane/*`, `src/ui/ToolRow/*`, `src/ui/FeatureRow/*`, `src/ui/DiffView/*`, `src/ui/SiteHeader/*`, `src/ui/SiteFooter/*`, `src/ui/TrustStrip/*`, `e2e/kit-axe.spec.ts` |
| 0.4 | Application shell and routing | `done-PASS` | `src/ui/Logo/*`, `src/apps/registry.ts`, `src/apps/registry.test.tsx`, `src/shell/*`, `src/pages/*`, `e2e/shell-routes.spec.ts`, `test-results/card-0.4-home-375.png`, `test-results/card-0.4-home-1280.png` |
| 0.5 | Quality gates | `todo` | — |
| 1.1 | Core interfaces and fixtures | `todo` | — |
| 1.2 | Guest store | `todo` | — |
| 1.3 | Supabase client, config, auth UI | `todo` | — |
| 1.4 | Migration 001 (profiles, vault) and tests | `todo` | — |
| 1.5 | Cloud store and importer | `todo` | — |
| 1.6 | App 1 workspace | `todo` | — |
| 1.7 | Vault page | `todo` | — |
| 1.8 | Settings (Profile, Appearance, Security, Storage) | `todo` | — |
| 2.1 | Migration 002 (orgs, invites, shares, annotations, audit) and matrix test | `todo` | — |
| 2.2 | Org UI | `todo` | — |
| 2.3 | Sharing UI | `todo` | — |
| 2.4 | Versions, diff, review | `todo` | — |
| 2.5 | Audit log and encryption | `todo` | — |
| 3.0 | Spike: HyperFrames | `todo` | — |
| 3.1 | Home and Apps pages | `todo` | — |
| 3.2 | App Preview and player | `todo` | — |
| 3.3 | Docs reader and InfoPopover wiring | `todo` | — |
| 3.4 | Tutorial content | `todo` | — |
| 4.1 | Log engine | `todo` | — |
| 4.2 | Regex engine + worker timeout + explanation mapper | `todo` | — |
| 4.3 | Cron tab | `todo` | — |
| 4.4 | App 3 workspace UI | `todo` | — |
| 5.1 | Template parser/renderer | `todo` | — |
| 5.2 | Variables panel + form + preview + includes | `todo` | — |
| 5.3 | Five presets + save/share through vault | `todo` | — |
| 6.0 | Spike: Proxy outbound networking | `todo` | — |
| 6.1 | URL/IP validation library | `todo` | — |
| 6.2 | Proxy Edge Function | `todo` | — |
| 6.3 | Runner engine | `todo` | — |
| 6.4 | App 2 UI | `todo` | — |
| 7.0 | MCP notes from pasted specifications | `todo` | — |
| 7.1 | `mcp_*` RPC migration 003 + tests | `todo` | — |
| 7.2 | Shared MCP tool implementations + BM25 router | `todo` | — |
| 7.3 | Edge Function `supabase/functions/mcp` | `todo` | — |
| 7.4 | `/mcp` page | `todo` | — |
| 8.1 | Accessibility and performance pass | `todo` | — |
| 8.2 | Free-tier guards | `todo` | — |
| 8.3 | Retention jobs and account deletion test | `todo` | — |
| 8.4 | Legal and privacy pages | `todo` | — |
| 8.5 | Release checklist | `todo` | — |
| 9.1 | Optional Rust/Wasm engine crate | `todo` | — |
| 9.2 | Differential test (Rust vs TypeScript) | `todo` | — |
| 9.3 | Experimental engine toggle | `todo` | — |

## 2. Pending User Actions

| Card ID | Action | Status |
|---|---|---|
| 0.0 | Confirm the GitHub repo is connected in AI Studio's GitHub settings | `pending` |
| 0.0 | Paste the GitHub repo URL into `docs/STATE.md` | `pending` |
| 0.1 | Sync the project to GitHub from AI Studio (`card 0.1: configure repo hygiene, scripts, CI, and state files`) | `pending` |
| 0.1 | Open the repo's Actions tab and confirm the first CI run is green | `pending` |
| 0.1 | Create a free Cloudflare Pages project from the repo (build command `npm run build`, output `dist`) and paste the `*.pages.dev` URL into `docs/STATE.md` | `pending` |
| 0.2 | Sync the project to GitHub from AI Studio (`card 0.2: add design tokens, themes, and WCAG contrast tests`) and confirm CI is green | `pending` |
| 0.3a | Sync the project to GitHub from AI Studio (`card 0.3a: build form components, copy deck, and axe tests`) and confirm CI is green | `pending` |
| 0.3b | Sync the project to GitHub from AI Studio (`card 0.3b: build overlay and feedback components and axe tests`) and confirm CI is green | `pending` |
| 0.3c | Sync the project to GitHub from AI Studio (`card 0.3c: build layout components and axe tests`) and confirm CI is green | `pending` |
| 0.4 | Sync the project to GitHub from AI Studio (`card 0.4: build application shell, routing, command palette, and app registry`) and confirm CI is green | `pending` |

## 3. Environment Probe Summary

Recorded in `docs/ENVIRONMENT.md` from Card 0.0 terminal output:
- **OS:** `Linux localhost 4.19.0-gvisor #1 SMP Sun Jan 10 15:06:54 PST 2016 x86_64 GNU/Linux` (`uname -a`)
- **Node / npm:** Node `v22.23.2` (`node -v`), npm `10.9.8` (`npm -v`), registry reachable (`npm view react version` returned `19.3.1`)
- **Binaries present:** `git` (`2.34.1`), `/usr/local/bin/playwright-cli`, `/usr/local/bin/bun`
- **Binaries absent:** `docker`, `rustc`, `cargo`, `wasm-pack`, `supabase`
- **Headless browser:** `playwright-cli open about:blank && playwright-cli close` exited `0` (opened headless browser `default`, navigated `about:blank`, captured snapshot, closed browser)
- **Git worktree in container:** `.git` directory is not present in `/app/applet` (`git remote -v` and `git status` exited `128: fatal: not a git repository (or any of the parent directories): .git`)
