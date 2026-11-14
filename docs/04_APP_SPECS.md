# 04 — The Four Apps: Behavior, Limits, Edge Cases, Examples

Gemini writes all code. This file defines behavior. Every rule here becomes at least one test. Where an exact output is given, the test must assert exactly that. Where a library is named, read its type definitions in `node_modules` before using it (R1).

## 0. Shared engine rules (`src/core/`)

- Each engine is a set of **pure functions** with Zod-validated inputs and a typed result. No DOM access except where stated. No network.
- Engines that can block the UI (log filtering, regex testing, secret scanning of big inputs) run in a **Web Worker** wrapped with `comlink`; the main thread gets progress and a cancel handle. A worker that does not answer within its time limit is terminated and the UI shows an error, never a frozen page.
- Every engine has a **fixture corpus** under `src/tests/` with positive and negative cases.
- Phase 9 may add a Rust/Wasm implementation behind the same interface. Do not write Rust before then.
- Fixtures that contain secret-looking strings must be **assembled at runtime** (for example `'AKIA' + 'IOSFODNN7EXAMPLE'`), so the repository never contains a literal that GitHub push protection or other scanners flag.

---

## 1. App 1 — Context Packer

**One-sentence purpose:** turn a folder, zip or pasted text into one AI-ready block with secrets hidden and a token estimate.

### 1.1 Inputs

| Input | Rules |
|---|---|
| Folder drop / "Choose folder" | Use the standard directory-picker or drag-drop APIs the browser provides. If the browser lacks them show "This browser cannot read folders. Upload a zip or paste text." |
| Zip upload | Unpack with `fflate`. Limits: ≤ 5,000 entries, ≤ 50 MB uncompressed total, reject nested archives, reject paths containing `..` or absolute paths (zip-slip). Violation → `E-PACK-ZIP-LIMIT`. |
| Pasted text | Single virtual file named `pasted.txt`. |
| Pasted HTML | Offered through the "Compact HTML" mode (§1.6). |

Total text accepted per pack: **5 MB** after filtering. Over → show the largest files and a "Remove from pack" action; never silently truncate.

### 1.2 File selection

1. Default ignore list: `node_modules`, `.git`, `dist`, `build`, `.next`, `coverage`, `*.lock`, `*.min.js`, `*.map`, image/audio/video/font/archive extensions.
2. `.gitignore` support is a **documented subset**: blank lines, `#` comments, `*`, `**`, trailing `/` for directories, leading `!` negation. Unsupported syntax produces a visible warning listing the lines ignored.
3. Binary detection: a NUL byte in the first 8 KB, or a binary extension → skipped and listed under "Skipped files" with the reason.
4. Per-file limit 512 KB; larger files listed under "Skipped files".
5. The user can tick/untick any file in a tree before packing.

### 1.3 Output formats (exact structure)

All formats start with a summary block: pack name, file count, total characters, estimated tokens, redactions count, timestamp.

- **Markdown (default):** summary, then a directory tree in a fenced block, then for each file a heading `## path/to/file.ext` followed by a fenced block with the file's language (from the extension).
- **XML-tagged:** `<pack>` containing `<summary>`, `<tree>`, and `<file path="...">` elements; file contents wrapped so that the sequence `]]>` inside content is escaped.
- **Plain text:** a line `===== path/to/file.ext =====` before each file.

### 1.4 Secret and personal-data scrubber

Replacement text is `[REDACTED:<rule-id>]`. Each rule below needs its own positive tests and at least 2 negative tests (strings that look similar and must **not** match). Gemini writes the patterns; the table says what each must detect.

| rule-id | Must detect | Must not detect |
|---|---|---|
| `aws-access-key` | `AKIA` or `ASIA` followed by 16 uppercase letters/digits | the word "AKIA" inside a longer word |
| `aws-secret-key` | a 40-character base64-like value assigned to a name containing `aws` and `secret` | any other 40-character hash, such as a git commit id |
| `github-token` | `ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_` + 36 alphanumerics; `github_pat_` + long token | `ghp_` alone, short strings |
| `slack-token` | `xoxb-`, `xoxp-`, `xoxa-`, `xoxr-`, `xoxs-` followed by dash-separated digits/letters | the text "xox" |
| `stripe-key` | `sk_live_`, `rk_live_` + 24+ alphanumerics (test keys `sk_test_` are reported as **warning**, not redacted by default) | `sk_live_` with fewer than 24 characters |
| `google-api-key` | `AIza` + 35 URL-safe characters | shorter strings |
| `private-key-block` | from `-----BEGIN` … `PRIVATE KEY-----` through the matching `END` line, multi-line | public key blocks and certificates |
| `jwt` | three base64url segments separated by dots, first starting `eyJ` | version strings like `1.2.3` |
| `bearer-header` | `Authorization: Bearer <20+ chars>` | the word "Bearer" in prose |
| `generic-secret-assignment` | names like `api_key`, `secret`, `password`, `token`, `client_secret` assigned to a quoted or unquoted value of ≥ 8 characters | values that are obviously placeholders: `changeme`, `your-api-key`, `xxxxxxxx`, `<token>`, `${VAR}`, `process.env.X` |
| `email` | standard email addresses | strings like `user@localhost` are matched only when the setting "include local addresses" is on |
| `ipv4` | four dot-separated numbers 0–255 (not version-like `1.2.3.4` inside identifiers when preceded by `v` or letters) | `0.0.0.0`, `127.0.0.1` are reported as informational, not redacted by default |
| `high-entropy` | quoted or assigned strings ≥ 20 characters with Shannon entropy ≥ 4.0 bits per character | file paths, URLs without credentials, UUIDs, hex hashes of exactly 32/40/64 characters |

Literal fake fixtures (build them at runtime; these are documentation/fake values): the AWS documentation example `AKIA` + `IOSFODNN7EXAMPLE`; the public jwt.io sample token (header `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`); GitHub token `ghp_` + 36 zeros; Slack token `xoxb-` + `000000000000-000000000000-` + 24 zeros; Stripe `sk_live_` + 24 zeros; Google `AIza` + 35 zeros.

**Per-hit review UI:** a list of hits (rule name, file, line, masked preview showing first 2 and last 2 characters only). Each hit has a switch "Redact this" (default on) and a bulk "Redact all / none". A diff view shows before/after for the selected file. The disclaimer `scrub.disclaimer` is always visible next to the Copy button.

**Saving to the vault:** the saved item contains the **redacted** output and the settings used. It never contains the original secret text. Hit records store rule id, file, line, and a length — not the secret.

**Targets:** corpus recall ≥ 95% on the seeded positives; false-positive rate on the negatives = 0 for rules marked "must not detect".

### 1.5 Token estimate

- Selector: "OpenAI o200k", "OpenAI cl100k", "Rough estimate (characters ÷ 3.5)". Always display with "≈" and the label "estimate".
- Use `gpt-tokenizer`. Its import paths for each encoding must be read from its README or `package.json` `exports` in `node_modules`; quote them under R1.
- Show total and per-file tokens; a budget meter (user-entered limit) that turns warning at 90% and danger at 100%; list of the 10 largest files with a "Remove" action.

### 1.6 Compact HTML mode ("@ref wireframe") — our own feature

Runs on the **main thread** (the DOM parser is not available in Web Workers). Input ≤ 1 MB.

Steps: parse with `DOMParser` → walk the tree → keep only meaningful nodes → output indented lines.

| Keep | Output line |
|---|---|
| landmarks `header nav main aside footer form section[aria-label]` | `[nav]`, `[main]`, … (indent shows nesting) |
| headings | `@e3 [heading2] "Pricing"` |
| links | `@e4 [link] "Pricing" -> /pricing` |
| buttons | `@e5 [button] "Sign in"` |
| inputs, selects, textareas | `@e6 [input type=email] "Email"` — label taken from `<label for>`, wrapping label, `aria-label`, or placeholder (in that order) |
| images with alt | `[image] "alt text"` (no ref) |
| paragraphs, list items | text truncated at 200 characters |
| tables | `[table rows=N cols=M]` plus header cell texts |

Drop: `script style noscript svg template` elements, comments, elements with `hidden`, `aria-hidden="true"`, or inline `display:none`. Refs `@e1…` are assigned in document order to interactive elements only (links, buttons, inputs, selects, textareas, headings). Report "Before: N tokens → After: M tokens (−X%)". The output header says: "Refs apply to this pasted snapshot only."

**Example.** Input:
`<nav><a href="/pricing">Pricing</a></nav><main><h1>Welcome</h1><form><label for="e">Email</label><input id="e" type="email"><button>Sign in</button></form></main>`
Expected output (exact):
```
[nav]
  @e1 [link] "Pricing" -> /pricing
[main]
  @e2 [heading1] "Welcome"
  [form]
    @e3 [input type=email] "Email"
    @e4 [button] "Sign in"
```

### 1.7 App 1 error codes
`E-PACK-ZIP-LIMIT`, `E-PACK-TOO-LARGE`, `E-PACK-READ`, `E-PACK-WORKER-TIMEOUT`, `E-HTML-TOO-LARGE`, `E-HTML-PARSE`.

---

## 2. App 2 — API Runner

**Purpose:** build a chain of HTTP requests, run them, see what happened, and save the chain.

### 2.1 Data model (Zod schemas in `src/apps/api-runner/schema.ts`)
- **Chain:** `name`, `variables` (name→value), `secrets` (names only; values live in memory unless saved inside an encrypted vault item), `steps[]` (≤ 20).
- **Step:** `id`, `name`, `method`, `url`, `headers[] {name,value,enabled}`, `body {type: none|json|text|form, content}`, `extract[] {name, from: body|header, path}`, `assertions[] {kind: status-equals|jsonpath-equals|time-under-ms, ...}`, `continueOnError`.

### 2.2 Variables and extraction
- Text fields may contain `{{vars.NAME}}`, `{{secrets.NAME}}`, or `{{steps.STEPID.EXTRACTNAME}}`. Names match `[A-Za-z_][A-Za-z0-9_]*`. Nothing else is evaluated. **No code execution, no `eval`, no expressions.**
- JSONPath is used **only** inside `extract.path` (via `jsonpath-plus`, with eval disabled — read its docs in `node_modules` and quote the option; if no such option exists, STOP and ask). `from: header` uses the header name.
- An unresolved reference stops the run before sending the step with `E-RUN-UNRESOLVED` naming the reference and step.
- A reference to a later step is rejected at edit time (cycle/ordering error).

### 2.3 Running
- Sequential, in order. Per step: build request → substitute → send → capture → extract → assert.
- Failure stops the chain unless `continueOnError`. Limits: 20 steps, 60 s total, cancel button (AbortController).
- **Direct mode first.** Use the browser's `fetch`. On a network/CORS failure (the two look the same to scripts) show: "The browser blocked this request or could not connect." with a button "Send through Cairnbench". Never switch silently. Each result shows a badge "Direct" or "Via Cairnbench".
- Via Cairnbench calls the Edge Function in 02 §8. Daily limits and kill switch messages come from the copy deck (add keys per card).

### 2.4 What the timing view may show
Show **only measured values**. Direct mode: total time, plus phase timings only when the browser exposes them for that URL. Via Cairnbench: total time and whatever the function measured. Never draw invented phases.

### 2.5 Response viewer
Status line, size, time, headers table, body in three tabs: Pretty (collapsible JSON tree, virtualized for large JSON), Raw, Preview (text only; HTML is shown as text, never rendered). Truncation banner at 2 MB. Invalid JSON labeled with the parse error position.

### 2.6 Plain-English hints (status → message)
400 "The server did not understand the request. Check the body and headers." · 401 "The server needs valid credentials." · 403 "Your credentials were accepted but this action is not allowed." · 404 "This address does not exist on that server." · 408/timeout "The server took too long to answer." · 429 "Too many requests. Wait before trying again." · 5xx "The server had a problem. Try again later; if it persists, contact the API owner." Add the numeric code to each.

### 2.7 curl import/export
Import supports `-X/--request`, `-H/--header`, `-d/--data/--data-raw/--data-binary`, `--url`, and a bare URL. Any other flag is listed in a "Not imported" notice. Export writes a curl command with secret values replaced by `$NAME`.

### 2.8 Tests (no real network)
Use a stubbed `fetch`. Cases: extract token from JSON body and use in step 2; unresolved variable; header extraction; failing assertion; step limit; cancel mid-run; 429 hint; invalid JSON body; truncation flag; a secret never appears in exports or in the saved item unless the item is encrypted.

---

## 3. App 3 — Log, Regex and Cron Explorer

Three tabs in one workspace: **Logs**, **Regex**, **Cron**.

### 3.1 Logs
- Input: a file chosen by the user (read as a stream in chunks) or pasted text. **Supported size in v1: up to 50 MB reliably.** 200 MB is a stretch goal listed in `docs/BACKLOG.md`, not a v1 promise.
- **Line splitting across chunks** is the main bug risk: a line split between two chunks must be reassembled. Test with a chunk size of 7 bytes on a multi-byte (UTF-8) sample.
- Filters (combine with AND): text contains (case toggle), JavaScript regex, level (detected from tokens `FATAL ERROR WARN INFO DEBUG TRACE` or JSON field `level`/`severity`), time range (ISO-8601 timestamp at line start or JSON field `time`/`timestamp`/`ts`).
- JSON-lines detection: if ≥ 80% of the first 20 non-empty lines parse as JSON objects, show **field facets**: for fields with ≤ 50 distinct values, the top 10 values with counts; clicking one adds a filter.
- Filtering runs in a worker with progress and cancel. Results are line numbers; the list is virtualized (`@tanstack/react-virtual`) so only visible rows render.
- Empty states: "No lines match these filters." with "Clear filters".
- Error codes: `E-LOG-READ`, `E-LOG-TOO-LARGE`, `E-LOG-REGEX`.

### 3.2 Regex
- Live test of a **JavaScript** `RegExp` with flags `g i m s u y d`. Show: match list (index, text, named and numbered groups), highlighted input, and a table of test cases (text → should match / should not match, with pass/fail).
- **Backtracking guard:** the match runs in a worker; after **1,000 ms** the worker is terminated and the UI says "This pattern is too slow on this text (possible catastrophic backtracking)."
- Explanation: parse the pattern with `regexp-tree` and map node types to plain sentences. If the parser throws (for example on lookbehind in some versions) show "Explanation is not available for this syntax." Do **not** guess at an explanation.
- Invalid pattern: show the engine's message and the position if available, next to the field.
- The Rust-flavor tab is **not** built before Phase 9. Do not add a disabled placeholder tab.

### 3.3 Cron
- Input: five-field cron expression. Six fields (seconds) or Quartz syntax → message "Only 5-field cron expressions are supported."
- Plain-English text via `cronstrue`. **Verified outputs on 2026-11-14 (cronstrue 3.39.0)** — tests must expect exactly these:

| Expression | Text |
|---|---|
| `*/15 9-17 * * 1-5` | Every 15 minutes, between 09:00 AM and 05:59 PM, Monday through Friday |
| `0 0 1 * *` | At 12:00 AM, on day 1 of the month |
| `30 2 * * 0` | At 02:30 AM, only on Sunday |
| `0 */6 * * *` | On the hour, every 6 hours |
| `5 4 * * sun` | At 04:05 AM, only on Sunday |

- Next 10 runs via `cron-parser` (v5 API: `CronExpressionParser.parse(expression, { currentDate, tz })`, then `.next().toDate()` repeatedly). **Verified:** with `0 9 * * 1-5`, `currentDate` 2026-11-14T00:00:00Z and tz UTC, the next three runs are 2026-11-16, 2026-11-17, 2026-11-18 at 09:00:00Z (a Saturday start skips the weekend). Tests assert this.
- Timezone selector uses the browser's list of IANA zones; default is the browser's zone. Show each run both in the chosen zone and in UTC.

---

## 4. App 4 — Prompt Composer

**Purpose:** write reusable templates with `{{variables}}`, fill them in through a generated form, preview live, save and share.

### 4.1 Template language (complete; nothing else is supported in v1)
- Variable: `{{name}}` or `{{ name }}`; name matches `[A-Za-z_][A-Za-z0-9_]*`.
- Snippet include: `{{> snippet:<uuid>}}` inserts another Prompt Composer vault item. Maximum depth 5; a cycle stops with `E-TPL-CYCLE` naming the path.
- Escape: `\{{` renders a literal `{{`.
- No conditionals, loops, filters or expressions. Unknown syntax inside `{{ }}` is an error `E-TPL-SYNTAX` with the position.

### 4.2 Variables panel
Variables are detected automatically in order of first appearance. For each: type (`text`, `long text`, `select` with options, `number`), default, required flag, help text. Metadata is stored with the template in the vault item.

### 4.3 Preview
Split pane: left editor (template) and fill-in form, right live preview. Missing required variables appear in the preview as a highlighted badge reading `name missing` and block "Copy" until filled (a "Copy anyway" secondary action exists). Character and estimated-token count shown (same estimator as App 1). Large templates (> 100 KB) render the preview debounced at 300 ms.

### 4.4 Specification Distiller presets
Five original presets, selectable from "Start from a preset". The text of each is **written from scratch** by Gemini following these outlines (do not copy text from any repository; the inspiration `pbakaus/impeccable` is a vocabulary idea only):

| Preset | Purpose | Variables |
|---|---|---|
| Distill | Turn a long, vague request into a short precise specification | `request`, `audience`, `constraints` |
| Clarify | List the questions that must be answered before work starts | `request`, `known_facts` |
| Polish | Improve wording and structure without changing meaning | `draft`, `tone`, `length_limit` |
| Harden | List risks, edge cases and failure modes of a plan | `plan`, `environment` |
| Adapt | Rewrite a spec for another audience or format | `spec`, `target_audience`, `target_format` |

Each preset states the goal, the input variables, the steps the AI should follow, and the output format, in plain language, ≤ 250 words.

### 4.5 Tests
Variable detection order; whitespace inside braces; escape; include depth 5 and cycle error; missing required blocks copy; select options; number validation; default values; unknown syntax error with position; preview of a 100 KB template stays responsive (assert render count, not time).

---

## 5. Cross-app: "Use from AI tools"
Each launch app exposes at most one MCP tool in v1 (listed in 02 §9); a later app declares its tools in its manifest `mcpTools` and the MCP function loads them from the same registry. The button in the workspace toolbar opens `/mcp` pre-selected on that tool. No other cross-app coupling.
