# 03 — Design System, Screens, Copy and Accessibility

Gemini: this file is the only source for colors, type, spacing, components, screens and UI text. If something is missing, ask (R11); do not invent.

## 1. Design intent (one paragraph)

Cairnbench looks like a precise instrument: calm surfaces, dense but readable information, one accent color per theme, hairline dividers instead of boxes inside boxes. The logo is a stack of balanced stones (cairn), built from simple geometric shapes. No decoration that carries no meaning.

## 2. Banned (check each screen against this list)

- Purple or indigo gradients, neon glows, glassmorphism blur panels, rainbow borders.
- Three identical feature cards in a row as the whole page.
- Small uppercase letter-spaced label above every heading.
- A card inside a card. Maximum one container level; use a 1px divider and spacing inside.
- Floating pill navigation, decorative floating shapes, emoji used as icons.
- The font Inter or system-default fonts as the main face.
- "Submit", "OK", "Click here", "Oops", "Something went wrong", apologies in error text.
- A bottom status bar or telemetry strip.
- Hover as the only way to reach an action or information.
- Animated width, height, margin or padding.

## 3. Tokens (exact values; contrast checked)

All pairs below were computed with the WCAG 2.x formula on 2026-11-14 and pass: text ≥ 4.5:1 on its background and surface; muted text ≥ 4.5:1; accent as text ≥ 4.5:1; on-accent text on accent ≥ 4.5:1; strong border ≥ 3:1 against background and surface; status colors ≥ 4.5:1 on surface and background.
Gemini must still **add an automated test** (card 0.2) that recomputes these from the CSS variables and fails if any pair drops below its minimum.

Define each as a CSS variable (`--bg`, `--surface`, `--border`, `--border-strong`, `--text`, `--text-muted`, `--accent`, `--on-accent`, `--success`, `--warning`, `--danger`) per theme selector `[data-theme="..."]`.

| Token | carbon-studio (default dark) | alabaster-paper (light) | cobalt-slate (dark) | warm-atelier (dark) |
|---|---|---|---|---|
| `--bg` | `#0B0F17` | `#F6F5F2` | `#090D16` | `#121110` |
| `--surface` | `#111827` | `#FFFFFF` | `#0F172A` | `#1C1917` |
| `--border` (decorative) | `#1E293B` | `#E2E0DA` | `#1E293B` | `#292524` |
| `--border-strong` (inputs, focus separators) | `#64748B` | `#64748B` | `#64748B` | `#78716C` |
| `--text` | `#F8FAFC` | `#0F172A` | `#F1F5F9` | `#FAFAF9` |
| `--text-muted` | `#94A3B8` | `#475569` | `#94A3B8` | `#A8A29E` |
| `--accent` | `#60A5FA` | `#1D4ED8` | `#38BDF8` | `#F59E0B` |
| `--on-accent` | `#0B0F17` | `#FFFFFF` | `#04121C` | `#121110` |
| `--success` | `#34D399` | `#047857` | `#34D399` | `#4ADE80` |
| `--warning` | `#FBBF24` | `#B45309` | `#FBBF24` | `#FCD34D` |
| `--danger` | `#F87171` | `#B91C1C` | `#F87171` | `#FCA5A5` |

Why accents differ from the v1 plan: white text on `#3B82F6` is 3.68:1 and on `#D97706` is 3.19:1 — both fail AA, so the brand accents were adjusted.

Default theme follows `prefers-color-scheme` (dark → carbon-studio, light → alabaster-paper) until the user picks one. Components may only reference tokens, never hex values.

## 4. Typography, spacing, shape, motion

- Fonts (npm packages, no binary files): **Plus Jakarta Sans** for interface and headings, **JetBrains Mono** for code, logs, numbers. Numbers in tables, timers, token counts use `font-variant-numeric: tabular-nums`. `font-display: swap`.
- Scale (px): 12, 14, 16, 18, 20, 24, 32, 44. Body 16, line-height 1.5. Headings letter-spacing −0.02em. Line length 45–75 characters for reading text.
- Spacing: 4-pixel grid; use 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: 6 (inputs/buttons), 10 (the single card level), 999 (badges only).
- Elevation: three shadow tokens `--shadow-sm|md|lg`, used only on popovers, drawers and dialogs. Cards use borders, not shadows.
- Density: `comfortable` uses the sizes above; `compact` reduces control height from 40 to 32 and vertical gaps by 25%. Controlled by `data-density` on the root.
- Motion: durations 150–300 ms; animate only `transform` and `opacity`; `motion` library for presence and layout transitions; `prefers-reduced-motion` or the setting "Reduced" removes all transitions except opacity ≤ 100 ms.
- Targets: minimum 40×40 px on desktop, 44×44 px on touch, ≥ 8 px between targets. Visible focus ring: 2 px outline in `--accent`, 2 px offset, on every interactive element; never remove `:focus` without a `:focus-visible` replacement.

## 5. Component inventory (each lives in `src/ui/<Name>/`)

Every component must implement five states: **idle, loading** (skeleton shaped like the final content, never a lone spinner), **empty** (why it's empty + one clear action), **error** (plain explanation + "Try again" + a short code like `E-VAULT-LOAD`), **interactive** (hover, pressed, focus-visible, disabled).

| Component | Purpose | Props (names fixed) |
|---|---|---|
| `Button` | all actions | `variant: primary|secondary|ghost|danger`, `size`, `loading`, `disabled`, `icon`, `children` |
| `InputField` | text input with label, hint, inline error | `label`, `hint`, `error`, `type`, `value`, `onChange` (label is always visible) |
| `TextAreaField` | multi-line | same as above plus `rows` |
| `SelectField` | native-based select with label | `label`, `options`, `value`, `onChange` |
| `Switch`, `Checkbox` | toggles | `label`, `checked`, `onChange` |
| `InfoPopover` | the "(i)" help | `topicId`, `summary` (≤ 2 sentences). Opens on click, Enter, Space or focus; closes on Esc and outside click; `aria-describedby`; contains a link "Open full guide" to `/docs/:topicId` in a new tab. Never hover-only. |
| `ModalDrawer` | side panel / dialog | built on Radix Dialog; focus trap; Esc closes |
| `SplitPane` | resizable two-pane layout | built on `react-resizable-panels`; keyboard resizable |
| `AppCard` | app directory tile | `appId`, `title`, `summary`, `tags`, `savedCount`; two actions: "Watch overview" and "Open app" |
| `Tabs`, `Badge`, `Toast`, `EmptyState`, `ErrorState`, `Skeleton`, `CopyButton`, `Kbd` | utilities | as needed per card |
| `HyperFramesPlayer` | tutorial player | defined in 05 card 3.2 |
| `DiffView` | side-by-side/unified diff | `before`, `after`, `mode` |

Rules: if a button, input or pattern appears twice, it becomes a component in `src/ui/`. Pages never contain raw `<button>` styling.

## 6. Navigation and information structure

Top bar, left to right: **logo** · four destinations **Home, Apps, Connect AI (MCP Hub), Vault** (new apps never get a top-level item; they appear under Apps) · right side: **organization switcher, theme menu, settings, command palette button (⌘K / Ctrl+K)**. That is 4 destinations + 4 utilities. No other top-level items. On mobile (<768 px) destinations move to a menu button; utilities stay as icons with labels for screen readers. No bottom navigation.

Command palette (⌘K): jump to any page, any app, "New vault item", "Switch theme", "Switch organization", search vault titles. Opens with ⌘K/Ctrl+K and `/`. Esc closes.

## 7. Screens (layout, content, states)

**Home `/`** — Heading "Tools for everyday AI work" (≤ 8 words), one sentence of explanation, input "What are you working on today?" with four chips: "Clean code and hide secrets for AI", "Chain and debug an API request", "Explain a regex, log or cron", "Build a reusable prompt". Choosing a chip highlights the matching app. Below: one AppCard per registered app, in a 2-column grid (1 column on mobile; with an odd count the last card spans both columns) — *not* three equal cards. Chips come from each app's `tagline`/`searchText`, so adding an app adds a chip with no layout change. A short "Start as a guest — no account needed" line and a "Sign in to sync and share" link. Loading: skeleton cards. Empty: not applicable.

**Apps `/apps`** — search field, list of all registered apps with tags and "saved items: N". Same actions as AppCard.

**App Preview `/app/:appId/overview`** — left/top: `HyperFramesPlayer` with captions and chapter buttons; right/below: "Try it in 3 steps" sandbox (three preset buttons that fill the tool with sample data and show the result without leaving the page); primary button "Open app"; secondary "Export tutorial file". Page title is the app's plain-English name, not a feature list.

**Workspace `/app/:appId/workspace`** — the tool in a `SplitPane`: input on the left, result on the right. A thin toolbar above: tool actions on the left; "Save to vault" and "Use from AI tools" on the right. No footer bar.

**Vault `/vault`** — tabs "My vault" and one tab per organization. Search field, filters (app, tag), list with title, app badge, updated time, size, share badge. Row actions: Open, Share, History, Delete. Empty state: "Nothing saved yet. Run an app and choose Save to vault."

**Connect AI `/mcp`** — three steps in one column: 1 "Create a token" 2 "Copy the setup for your AI tool" (tabs: Claude Desktop, Cursor, Zed, Windsurf — **content must be taken from each tool's current documentation pasted by the user in card 7.0, not from memory**) 3 "Try a tool" (form built from the tool's schema, shows request and response). Below: "Which tool when?" switch between "I choose the tool" and "Suggest a tool for my task".

**Settings `/settings`** — tabs: Profile (name, @handle, default when opening an app), Appearance (theme, density, motion), Organizations (create, members, invite links, roles, transfer, audit log), Security (redaction rules, encryption note, tokens, export my data, delete my account), Storage (usage bars, "Cloud sync is off" when unconfigured).

**Docs `/docs/:topicId`** — left list of topics, right reader with examples and copy buttons. Each topic file lives in `docs/tutorials/<topicId>.md` and is rendered at build time.

## 8. Copy deck (use these strings; add new ones to `src/ui/copy.ts` only)

| Key | Text |
|---|---|
| nav.home / apps / mcp / vault | Home / Apps / Connect AI / Vault |
| action.save | Save to vault |
| action.saved | Saved to vault |
| action.open | Open app |
| action.watch | Watch overview |
| action.copy | Copy |
| action.copied | Copied |
| action.retry | Try again |
| action.delete | Delete item |
| action.deleted | Item deleted |
| action.share | Create share link |
| action.shared | Share link created |
| action.invite | Create invite link |
| action.signin | Sign in |
| action.signout | Sign out |
| guest.banner | You are using Cairnbench as a guest. Items stay on this device. Sign in to sync and share. |
| empty.vault | Nothing saved yet. Run an app, then choose Save to vault. |
| error.network | Cairnbench could not reach the server. Check your connection, then try again. |
| error.quota | This item is larger than 512 KB. Remove content or save it to a file instead. |
| error.version | Someone changed this item while you were editing. Reload to see their version. |
| error.generic | That did not complete. Try again. If it keeps happening, report code {code}. |
| cloud.off | Cloud sync is off because the project is not connected to Supabase. Guest mode still works. |
| scrub.disclaimer | Redaction finds common secret formats. It can miss some. Review the preview before you copy. |
| encrypt.confirm | I understand I cannot recover this item if I forget the passphrase, and search and AI tools cannot read it. |

Vocabulary rule: an action keeps one name everywhere ("Save to vault" → toast "Saved to vault"). Error text never apologizes and always says what happened and what to do.

## 9. Accessibility checklist (every card that adds UI)

1. Keyboard-only: every action reachable with Tab/Shift+Tab, Enter, Space, Esc; tab order = reading order.
2. Visible focus ring in all four themes.
3. Icon-only buttons have `aria-label`.
4. Form fields have a persistent visible label; errors appear next to the field and are linked with `aria-describedby`.
5. Color is never the only signal (pair with icon or text).
6. Live regions (`aria-live="polite"`) announce toasts and async results.
7. Respect `prefers-reduced-motion`.
8. Headings are in order; one `h1` per page; landmarks `header`, `nav`, `main`.
9. Zoom to 200% without horizontal scroll; viewport meta without `user-scalable=no`.
10. `@axe-core/playwright` on the page in all four themes: **0 serious or critical violations** (output pasted).

## 10. The `sloplint` gate (Hallmark)

`Nutlope/hallmark` includes a dependency-free checker named `sloplint.mjs`. **Gemini must not write its own version.** The user downloads the official file into `scripts/sloplint.mjs` and tells Gemini. Gemini then reads the file's `--help` or header comment, and wires `npm run sloplint` using only options the file itself documents (quote them under R1). What exact checks it performs is **not** assumed by this document; Gemini reports what the script prints. CI runs it on the built output; a failure blocks the card.
