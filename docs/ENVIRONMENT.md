# Environment Probe (`docs/ENVIRONMENT.md`)

| Fact | Value | Command | Exit Code |
|---|---|---|---|
| Kernel and architecture | `Linux localhost 4.19.0-gvisor #1 SMP Sun Jan 10 15:06:54 PST 2016 x86_64 GNU/Linux` | `uname -a` | `0` |
| Node.js version | `v22.23.2` | `node -v` | `0` |
| npm version | `10.9.8` | `npm -v` | `0` |
| Git binary version | `git version 2.34.1` | `git --version` | `0` |
| Installed probed binaries | `/usr/local/bin/playwright-cli`, `/usr/local/bin/bun` | `which docker rustc cargo wasm-pack supabase playwright-cli bun` | `1` |
| Missing probed binaries | `docker`, `rustc`, `cargo`, `wasm-pack`, `supabase` (no path returned; command exited `1`) | `which docker rustc cargo wasm-pack supabase playwright-cli bun` | `1` |
| Workspace root entries | `.`, `..`, `.aistudio`, `bun.lock`, `crates`, `dist`, `docs`, `.env`, `.env.example`, `.gitignore`, `index.html`, `metadata.json`, `node_modules`, `package.json`, `public`, `src`, `supabase`, `tsconfig.json`, `vite.config.ts` | `ls -la` | `0` |
| Package metadata | `"name": "react-example"`, `"private": true`, `"version": "0.0.0"`, `"type": "module"` | `cat package.json` | `0` |
| Package scripts (`package.json`) | `"dev": "vite --port=3000 --host=0.0.0.0"`, `"build": "vite build"`, `"preview": "vite preview"`, `"clean": "rm -rf dist server.js"`, `"lint": "tsc --noEmit"` | `cat package.json` | `0` |
| Package dependencies (`package.json`) | `"@google/genai": "^2.4.0"`, `"@supabase/supabase-js": "^2.119.0"`, `"@tailwindcss/vite": "^4.3.3"`, `"@vitejs/plugin-react": "^6.1.1"`, `"dotenv": "^17.2.3"`, `"express": "^4.21.2"`, `"lucide-react": "^0.546.0"`, `"motion": "^12.23.24"`, `"react": "^19.0.1"`, `"react-dom": "^19.0.1"`, `"vite": "^8.3.0"` | `cat package.json` | `0` |
| Package devDependencies (`package.json`) | `"@types/node": "^22.14.0"`, `"@types/react": "^19.3.0"`, `"@types/react-dom": "^19.3.0"`, `"autoprefixer": "^10.4.21"`, `"esbuild": "^0.25.0"`, `"tailwindcss": "^4.3.3"`, `"tsx": "^4.21.0"`, `"typescript": "^7.0.2"`, `"@types/express": "^4.17.21"` | `cat package.json` | `0` |
| Available npm scripts output | `dev` (`vite --port=3000 --host=0.0.0.0`), `build` (`vite build`), `preview` (`vite preview`), `clean` (`rm -rf dist server.js`), `lint` (`tsc --noEmit`) | `npm run` | `0` |
| npm registry `react` version | `19.3.1` | `npm view react version` | `0` |
| Headless browser execution | `Browser default opened with pid 809`, navigated `about:blank`, wrote `.playwright-cli/page-2026-11-14T07-26-08-736Z.yml`, `Browser 'default' closed` | `playwright-cli open about:blank && playwright-cli close` | `0` |
| Git remote configuration | `fatal: not a git repository (or any of the parent directories): .git` | `git remote -v` | `128` |
| Git repository status | `fatal: not a git repository (or any of the parent directories): .git` | `git status` | `128` |
