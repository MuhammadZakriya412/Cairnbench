# Backlog (`docs/BACKLOG.md`)

- App 3 Log Explorer: 200 MB log streaming support (v1 target is 50 MB per `04 §3.1`).
- Replace leftover scaffold `:root` theme rules in `src/index.css` and metadata/classes in `index.html` with `src/design/tokens.css` and `src/design/themes.css` when wiring the application shell in Card 0.4.
- 2026-11-14 — bundle is 166.8 KB gzip of a 200 KB budget; add a size check in CI and split routes/apps — Claude.
- 2026-11-16 — pre-existing Card 0.3b/0.3c test files (`src/ui/FeatureRow/FeatureRow.test.tsx`, `src/ui/ToolRow/ToolRow.test.tsx`, `src/ui/InfoPopover/InfoPopover.test.tsx`) contain app-id fixture strings outside `src/apps/`; replace with non-app sample IDs before enabling Card 0.5's app-id grep gate.