# Backlog (`docs/BACKLOG.md`)

- App 3 Log Explorer: 200 MB log streaming support (v1 target is 50 MB per `04 §3.1`).
- [done in 0.4b] Replace leftover scaffold `:root` theme rules in `src/index.css` and metadata/classes in `index.html` with `src/design/tokens.css` and `src/design/themes.css`.
- 2026-11-14 — bundle is 166.8 KB gzip of a 200 KB budget; add a size check in CI and split routes/apps — Claude.
- 2026-11-16 — pre-existing Card 0.3b/0.3c test files (`src/ui/FeatureRow/FeatureRow.test.tsx`, `src/ui/ToolRow/ToolRow.test.tsx`, `src/ui/InfoPopover/InfoPopover.test.tsx`) contain app-id fixture strings outside `src/apps/`; replace with non-app sample IDs before enabling Card 0.5's app-id grep gate.
- [done in 0.4b] 2026-11-16 — `src/shell/CommandPalette.tsx` uses `role="listbox"` with `<button>` children; migrate to the ARIA combobox pattern.
- 2026-11-16 — `registerAppForTest` lives in the production `src/apps/registry.ts` module; move test-only registration out of production code.
- 2026-11-16 — `src/apps/registry.test.tsx` id regex allows a leading digit, whereas the database check does not; align the regex with DB rules.
- 2026-11-16 — `src/ui/SiteHeader` shows `"Ctrl+K"` on every platform instead of adapting shortcut label (`⌘K` on macOS).
- 2026-11-16 — `playwright.config.ts` has no `webServer` block and e2e files hard-code `http://localhost:3000` (fix in Card 0.5).
- 2026-11-16 — shell parts copy the five-state blocks; decide in a later card which components really need them.
- [done in 0.4b] 2026-11-16 — `src/shell/CommandPalette.tsx` shares `updateThemePreference` with `ThemeMenu.tsx` and writes to the single `cairnbench:appearance` key.