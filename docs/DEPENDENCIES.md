# Dependencies (`docs/DEPENDENCIES.md`)

Recorded from `package.json`, `node_modules/*/package.json`, and `npm view` outputs on 2026-11-14 (Card 0.1).

## 1. Installed Packages (`package.json`)

| Package | Section | `package.json` Range | Installed (`node_modules`) | Latest on npm | Added In | Status & Conflict / Pin Notes |
|---|---|---|---|---|---|---|
| `react` | `dependencies` | `^19.0.1` | `19.3.1` | `19.3.1` | scaffold | Active (`01 §4`) |
| `react-dom` | `dependencies` | `^19.0.1` | `19.3.1` | `19.3.1` | scaffold | Active (`01 §4`); peer `react: ^19.3.1` |
| `vite` | `dependencies` | `^8.3.0` | `8.3.8` | `8.3.8` | scaffold | Active (`01 §4`); peerOptional `esbuild: ^0.27.0 \|\| ^0.28.0` |
| `@vitejs/plugin-react` | `dependencies` | `^6.1.1` | `6.3.0` | `6.3.0` | scaffold | Active (`01 §4`); peer `vite: ^8.0.0` |
| `@tailwindcss/vite` | `dependencies` | `^4.3.3` | `4.3.5` | `4.3.5` | scaffold | Active (`01 §4`); peer `vite: ^5.2.0 \|\| ^6 \|\| ^7 \|\| ^8` |
| `@supabase/supabase-js` | `dependencies` | `^2.119.0` | `2.119.0` | `2.119.0` | scaffold | Active (`01 §4`) |
| `lucide-react` | `dependencies` | `^0.546.0` | `0.546.0` | `1.73.0` | scaffold | Active (`01 §4`, `01 §12` keeps scaffold `0.546.0`; peer `react: ^16.5.1 \|\| ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0`) |
| `motion` | `dependencies` | `^12.23.24` | `12.43.0` | `14.14.0` | scaffold | Active (`01 §4`, `01 §12` keeps scaffold `12.43.0`; peer `react: ^18.0.0 \|\| ^19.0.0`) |
| `vitest` | `dependencies` | `^5.1.0` | `5.1.0` | `5.1.0` | Card 0.1 | Active (`01 §4`); peer `vite: ^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0` |
| `zod` | `dependencies` | `^4.6.7` | `4.6.7` | `4.6.7` | Card 0.1 | Active (`01 §4`) |
| `eslint` | `dependencies` | `^10.15.0` | `10.15.0` | `10.15.0` | Card 0.1 | Active (Card 0.1 approved) |
| `@eslint/js` | `dependencies` | `^10.0.1` | `10.0.1` | `10.0.1` | Card 0.1 | Active (Card 0.1 approved); peer `eslint: ^10.0.0` |
| `typescript-eslint` | `dependencies` | `^8.72.2` | `8.72.2` | `8.72.2` | Card 0.1 | Active (Card 0.1 approved); peer `eslint: ^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0`, `typescript: >=4.8.4 <6.1.0` |
| `typescript` | `devDependencies` | `~6.0.3` | `6.0.3` | `7.0.2` | scaffold / Card 0.1 | Active (`01 §4`); pinned from `^7.0.2` to `~6.0.3` because `typescript-eslint@8.72.2` requires `peer typescript@">=4.8.4 <6.1.0"` |
| `tailwindcss` | `devDependencies` | `^4.3.3` | `4.3.5` | `4.3.5` | scaffold | Active (`01 §4`) |
| `@types/node` | `devDependencies` | `^22.14.0` | `22.20.5` | `26.6.6` | scaffold | Active; matches container Node `v22.23.2` and `vitest@5.1.0` peer `@types/node: ^22.0.0 \|\| >=24.0.0` |
| `@types/react` | `devDependencies` | `^19.3.0` | `19.3.0` | `19.3.0` | scaffold | Active |
| `@types/react-dom` | `devDependencies` | `^19.3.0` | `19.3.0` | `19.3.0` | scaffold | Active; peer `@types/react: ^19.3.0` |
| `@google/genai` | `dependencies` | `^2.4.0` | `2.32.0` | `3.3.0` | scaffold | `scaffold, unused` (`01 §12`, `01 §2 L11`) |
| `dotenv` | `dependencies` | `^17.2.3` | `17.4.2` | `18.0.10` | scaffold | `scaffold, unused` (`01 §12`) |
| `express` | `dependencies` | `^4.21.2` | `4.22.3` | `5.3.0` | scaffold | `scaffold, unused` (`01 §12`) |
| `@types/express` | `devDependencies` | `^4.17.21` | `4.17.25` | `5.0.6` | scaffold | `scaffold, unused` (`01 §12`) |
| `autoprefixer` | `devDependencies` | `^10.4.21` | `10.6.2` | `10.6.2` | scaffold | `scaffold, unused` (`01 §12`) |
| `esbuild` | `devDependencies` | `^0.28.0` | `0.28.2` | `0.28.2` | scaffold / Card 0.1 | `scaffold, unused` (`01 §12`); updated from `^0.25.0` to `^0.28.0` because `vite@8.3.8` declares `peerOptional esbuild@"^0.27.0 \|\| ^0.28.0"` |
| `tsx` | `devDependencies` | `^4.21.0` | `4.23.15` | `4.23.15` | scaffold | `scaffold, unused` (`01 §12`) |

## 2. Allowlist Packages Not Yet Installed (`01 §4`)

| Package | Reference Version (`01 §4`) | Latest on npm | Peer Dependencies on npm | Compatibility Notes |
|---|---|---|---|---|
| `react-router-dom` | `7.18.5` | `7.18.5` | `react: >=18`, `react-dom: >=18` | Compatible with `react@19.3.1` |
| `@tanstack/react-query` | `5.107.1` | `5.107.1` | `react: ^18 \|\| ^19` | Compatible with `react@19.3.1` |
| `zustand` | `5.1.0` | `5.1.0` | `react: >=18.0.0`, `immer: >=9.0.6` (optional), `use-sync-external-store: >=1.2.0` (optional) | Compatible with `react@19.3.1` |
| `@radix-ui/react-popover` | `1.3.1` | `1.3.1` | `react: ^16.8 \|\| ^17.0 \|\| ^18.0 \|\| ^19.0 \|\| ^19.0.0-rc`, `react-dom: ...` | Compatible with `react@19.3.1` |
| `@radix-ui/react-dialog` | `1.3.1` | `1.3.1` | `react: ^16.8 \|\| ^17.0 \|\| ^18.0 \|\| ^19.0 \|\| ^19.0.0-rc`, `react-dom: ...` | Compatible with `react@19.3.1` |
| `cmdk` | `1.1.1` | `1.1.1` | `react: ^18 \|\| ^19 \|\| ^19.0.0-rc`, `react-dom: ^18 \|\| ^19 \|\| ^19.0.0-rc` | Compatible with `react@19.3.1` |
| `react-resizable-panels` | `4.22.1` | `4.22.1` | `react: ^18.0.0 \|\| ^19.0.0`, `react-dom: ^18.0.0 \|\| ^19.0.0` | Compatible with `react@19.3.1` |
| `@tanstack/react-virtual` | `3.14.26` | `3.14.26` | `react: ^16.8.0 \|\| ^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0`, `react-dom: ...` | Compatible with `react@19.3.1` |
| `idb-keyval` | `6.3.0` | `6.3.0` | none | No peer constraints |
| `fflate` | `0.8.3` | `0.8.3` | none | No peer constraints |
| `diff` | `9.0.0` | `9.0.0` | none | No peer constraints |
| `jsonpath-plus` | `11.3.0` | `11.3.0` | none | No peer constraints |
| `cronstrue` | `3.39.0` | `3.39.0` | none | No peer constraints |
| `cron-parser` | `5.10.5` | `5.10.5` | none | No peer constraints |
| `regexp-tree` | `0.1.27` | `0.1.27` | none | No peer constraints |
| `gpt-tokenizer` | `4.1.2` | `4.1.2` | none | No peer constraints |
| `@fontsource/plus-jakarta-sans` | `5.3.0` | `5.3.0` | none | No peer constraints |
| `@fontsource/jetbrains-mono` | `5.3.0` | `5.3.0` | none | No peer constraints |
| `comlink` | `4.4.2` | `4.4.2` | none | No peer constraints |
| `fast-check` | `4.10.2` | `4.10.2` | none | No peer constraints |
| `@playwright/test` | `1.65.1` | `1.65.1` | none | No peer constraints |
| `@axe-core/playwright` | `4.14.0` | `4.14.0` | `playwright-core: >= 1.0.0` | Satisfied when `@playwright/test` is installed |
