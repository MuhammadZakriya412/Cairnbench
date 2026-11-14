# 03 — Design System, Screens, Copy and Accessibility

Gemini: this file is the only source for colors, type, spacing, components, screens and UI text. If something is missing, ask (R11); do not invent.

## 1. Design intent (one paragraph)

Cairnbench looks like a well-made notebook for engineers: warm bone-colored paper in Daylight, warm umber-black in Dusk, ink-gray text, **one copper accent** used sparingly, a **serif (Newsreader) for headings and the wordmark**, a sans for interface text, mono for code. Structure comes from hairline rules, whitespace and type size, not from boxes and cards. Motion is slow and eased. The logo is a stack of three balanced stones (a cairn) made from rounded rectangles: the two lower/upper stones in `--accent`, the base in `--border-strong`. Two themes only, `cairn-daylight` and `cairn-dusk`, one identity in two lightings. The public Home page is a real landing page (hero with the product itself, tutorials, tools, trust, AI connection); the `/apps` page is the workbench. No decoration that carries no meaning, **and no invented proof: no customer logos, testimonials, ratings or usage numbers.**

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
- Equal-sized feature cards in a row or grid anywhere (use ruled rows, `ToolRow`, `FeatureRow`). The old hero pattern of headline + search box + chips + 2×2 cards is banned.
- Teal, cyan or blue accents; gradient or glow behind the hero; stock illustrations; fake product screenshots made of lorem ipsum.
- Autoplaying video or sound. Any moving content must have a visible pause control.
- Pure `#000` or `#FFF` page backgrounds, saturated neon colors, and any color not in the token table.
- Abrupt state changes: every show/hide/move uses `--ease-calm`, except under reduced motion.

## 3. Tokens (exact values; contrast checked)

All pairs below were computed with the WCAG 2.x formula on 2026-11-14 and pass: text ≥ 4.5:1 on its background and surface; muted text ≥ 4.5:1; accent as text ≥ 4.5:1; on-accent text on accent ≥ 4.5:1; strong border ≥ 3:1 against background and surface; status colors ≥ 4.5:1 on surface and background.
Gemini must still **add an automated test** (card 0.2) that recomputes these from the CSS variables and fails if any pair drops below its minimum.

Define each as a CSS variable per theme selector `[data-theme="cairn-dusk"]` and `[data-theme="cairn-daylight"]`: `--bg`, `--surface`, `--border`, `--border-strong`, `--text`, `--text-muted`, `--accent`, `--on-accent`, `--accent-wash`, `--success`, `--warning`, `--danger`, `--band-bg`, `--band-text`, `--band-muted`.

| Token | cairn-daylight (light) | cairn-dusk (dark, default) |
|---|---|---|
| `--bg` | `#EEEBE4` | `#171513` |
| `--surface` | `#F8F6F1` | `#1F1C19` |
| `--border` (decorative hairline) | `#D9D4C9` | `#332E29` |
| `--border-strong` (inputs, focus separators) | `#8A857B` | `#7C7468` |
| `--text` | `#22262A` | `#EFE9DF` |
| `--text-muted` | `#5B6065` | `#A39B8F` |
| `--accent` (copper) | `#A8431F` | `#E08A5E` |
| `--on-accent` | `#FFFFFF` | `#1A0F08` |
| `--accent-wash` (highlight behind redacted or matched text) | `#E6D7CC` | `#37281F` |
| `--success` (moss) | `#44702F` | `#9CC47A` |
| `--warning` (ochre) | `#8A5A00` | `#E3B85B` |
| `--danger` (crimson, deliberately not copper) | `#A8213F` | `#F28CA0` |
| `--band-bg` (inverted band, used by the AI connection section) | `#22262A` | `#2A2622` |
| `--band-text` | `#EEEBE4` | `#EFE9DF` |
| `--band-muted` | `#C9C3B6` | `#B5AC9F` |

Contrast computed with the WCAG 2.x formula on 2026-11-14 (ratio on `--bg` / on `--surface`; minimum in brackets):
- cairn-daylight: text 12.79 / 14.10; muted 5.34 / 5.88; accent 5.06 / 5.58; success 4.89 / 5.39; warning 4.98 / 5.49; danger 5.97 / 6.58 [all ≥ 4.5]; on-accent on accent 6.02 [≥ 4.5]; border-strong 3.08 / 3.40 [≥ 3]; text on accent-wash 10.85 [≥ 4.5]; band text 12.79 and band muted 8.68 on band-bg [≥ 4.5].
- cairn-dusk: text 15.08 / 14.04; muted 6.63 / 6.17; accent 6.91 / 6.43; success 9.18 / 8.55; warning 9.78 / 9.10; danger 7.83 / 7.30 [all ≥ 4.5]; on-accent on accent 7.14 [≥ 4.5]; border-strong 3.95 / 3.68 [≥ 3]; text on accent-wash 11.71 [≥ 4.5]; band text 12.43 and band muted 6.70 on band-bg [≥ 4.5]; accent on band-bg 5.70.
- Rules that follow from the numbers: text on `--accent-wash` is `--text`, never `--accent` (accent on wash is only 4.29:1 in Daylight). `--accent` as text never goes on `--band-bg` in Daylight (2.53:1). `--border` is decorative only (about 1.2–1.4:1 on purpose) and never the only boundary of an input.
Gemini must still **add an automated test** (card 0.2) that recomputes every pair above from the CSS variables and fails if any drops below its minimum.

Color is never the only signal: status colors always come with an icon and text. Copper is the accent, so it is used for: primary buttons, links, active nav underline, focus ring, section numbers and tags. Not for large fills, not for body text.

Default theme follows `prefers-color-scheme` (dark → cairn-dusk, light → cairn-daylight) until the user picks one. Components may only reference tokens, never hex values.

## 4. Typography, spacing, shape, motion

- Fonts (npm packages, no binary files): **Newsreader** (serif, weights 400 and 500) for the wordmark, page titles and section headings; **Plus Jakarta Sans** for interface text; **JetBrains Mono** for code, logs, tags, numbers. Hero title 40–44 px Newsreader 400, line-height 1.08, letter-spacing −0.02em; section titles 26–28 px; app screen titles 20–24 px. Numbers in tables, timers, token counts use `font-variant-numeric: tabular-nums`. `font-display: swap`.
- Scale (px): 12, 14, 16, 18, 20, 24, 32, 44. Body 16, line-height 1.5. Headings letter-spacing −0.02em. Line length 45–75 characters for reading text.
- Spacing: 4-pixel grid; use 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: 5 (buttons), 6 (inputs and the single container level), 8 (large product windows), 999 (badges only). Quiet, slightly squared corners; never pill buttons.
- Elevation: three shadow tokens, used only on popovers, drawers and dialogs: `--shadow-sm: 0 1px 2px`, `--shadow-md: 0 6px 20px -6px`, `--shadow-lg: 0 16px 40px -12px`, each with color `rgb(0 0 0 / 0.35)` in cairn-dusk and `rgb(20 30 28 / 0.14)` in cairn-daylight. Cards use borders, not shadows.
- Density: `comfortable` uses the sizes above; `compact` reduces control height from 40 to 32 and vertical gaps by 25%. Controlled by `data-density` on the root.
- Motion: durations 200–320 ms with one easing token `--ease-calm: cubic-bezier(0.22, 1, 0.36, 1)`; no bounce, no spring overshoot, no looping animation (the skeleton shimmer is the only exception: ≥ 1.6 s per cycle, off in reduced motion); animate only `transform` and `opacity`; `motion` library for presence and layout transitions; `prefers-reduced-motion` or the setting "Reduced" removes all transitions except opacity ≤ 100 ms.
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
| `ToolRow` | one line of the numbered tool index on `/apps` | `index`, `appId`, `name`, `tagline`, `savedCount`; whole row is a link; "Open" label at the end |
| `FeatureRow` | one alternating text + snippet row on Home | `appId`, `name`, `description`, `snippet` (2 mono lines), `reverse`; links "Open tool" and "Watch tutorial" |
| `SiteHeader`, `SiteFooter` | shell chrome | footer links: Docs, Privacy, GitHub; no newsletter, no social icons |
| `ProductWindow` | the static hero picture | a real component showing the Context Packer after a pack with two highlighted redactions; built from the same UI kit and sample data as the app, **not an image file** |
| `PasteStrip` | the paste/drop field on `/apps` | `onPack`; a single bordered row (the only container there) |
| `TrustStrip` | three plain facts | three columns separated by a 2 px `--accent` top rule; no icons |
| `McpBand` | the inverted band on Home | uses `--band-*` tokens only |
| `LiveScrubDemo` (optional, built last) | hero try-it | a textarea with a fake key pre-filled; shows the hidden result live using the real scrubber engine; never sends text anywhere |
| `Tabs`, `Badge`, `Toast`, `EmptyState`, `ErrorState`, `Skeleton`, `CopyButton`, `Kbd` | utilities | as needed per card |
| `TutorialPlayer` | tutorial player | plays scene data (04 §6) on the real app components; play/pause, scrubber, speed, chapters, captions, transcript; defined in 05 card 3.2 |
| `DiffView` | side-by-side/unified diff | `before`, `after`, `mode` |

Rules: if a button, input or pattern appears twice, it becomes a component in `src/ui/`. Pages never contain raw `<button>` styling.

## 6. Navigation and information structure

Top bar, left to right: **logo** · four destinations **Home, Apps, Connect AI (MCP Hub), Vault** (new apps never get a top-level item; they appear under Apps) · right side: **organization switcher, theme menu, settings, command palette button (⌘K / Ctrl+K)**. That is 4 destinations + 4 utilities. No other top-level items. On mobile (<768 px) destinations move to a menu button; utilities stay as icons with labels for screen readers. No bottom navigation.

Command palette (⌘K): jump to any page, any app, "New vault item", "Switch theme", "Switch organization", search vault titles. Opens with ⌘K/Ctrl+K and `/`. Esc closes.

## 7. Screens (layout, content, states)

**Home `/` (landing page)** — top to bottom, each section separated by a 1 px `--border` rule and 56–72 px of space:
1. **Hero:** left: title (copy deck `hero.title`), lead (`hero.lead`), two buttons: primary `hero.cta.primary` → `/apps`, secondary `hero.cta.tour` → scrolls to and starts the first tutorial. Right: `ProductWindow`. Below 900 px the window moves under the text. Optional `LiveScrubDemo` replaces the window's static content only after Card 3.5.
2. **Tutorials:** section title and sub-line, `TutorialPlayer` (about 60% width) and a ruled list of every registered tutorial (title, length). Selecting an item loads it into the player without leaving the page. Below 900 px the list goes under the player. Nothing autoplays.
3. **Tools:** section title, then one `FeatureRow` per registered app, alternating left/right; not a grid. Each row's snippet comes from the app manifest.
4. **Trust:** `TrustStrip` with the three copy-deck facts.
5. **Connect AI:** `McpBand` with a copyable config example and a link "Set up your AI tool" → `/mcp`. The example uses a placeholder token `cb_YOUR_TOKEN`, never a real one.
6. **Footer.**
States: the page is static, so no loading state except the tutorial player's own skeleton. Guests and signed-in users see the same page; a signed-in user's primary button reads `hero.cta.signedin`. No customer logos, testimonials, ratings or statistics.

**Apps `/apps` (the workbench)** — a `PasteStrip` ("Pack for AI" sends the pasted text or dropped files into Context Packer and opens it); a section "Pick up where you left off" with up to 5 ruled rows of recent vault items (app tag in mono, title, relative time; empty state: "Nothing here yet. Paste something above, or open a tool below."); a section "Tools" with one `ToolRow` per registered app, numbered, with saved counts from the active store; the guest note `guest.banner` as one line at the bottom. No cards.

**App Preview `/app/:appId/overview`** — left/top: `TutorialPlayer` for this app's tutorial with captions and chapter buttons; right/below: "Try it in 3 steps" sandbox (three preset buttons that fill the tool with sample data and show the result without leaving the page); primary button "Open app"; secondary "Export tutorial file". Page title is the app's plain-English name, not a feature list.

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
| hero.title | Get your code ready for AI, without leaking secrets. |
| hero.lead | Pack files into one clean block, hide keys and tokens before anything is shared, then test requests, read logs and write prompts. Free, and it runs in your browser. |
| hero.cta.primary | Open the workbench |
| hero.cta.signedin | Go to the workbench |
| hero.cta.tour | Watch the 60-second tour |
| tutorials.title | See each tool in under a minute |
| tutorials.sub | Short walkthroughs with captions, played on the real app. |
| tools.title | Tools that share one vault |
| tools.sub | Save a result once, find it from any tool, share it with your team. |
| trust.1 | Stays in your browser. As a guest, nothing leaves this device. Sign in only to sync. |
| trust.2 | No AI calls inside. Cairnbench prepares text for AI; it never sends yours to a model. |
| trust.3 | Free to use. No card, no trial clock. |
| mcp.title | Let your AI agent use it too |
| mcp.sub | Connect over MCP with scoped tokens you can revoke. |
| mcp.cta | Set up your AI tool |
| paste.placeholder | Paste code, logs or a prompt, or drop files here |
| paste.cta | Pack for AI |
| apps.recent | Pick up where you left off |
| apps.recent.empty | Nothing here yet. Paste something above, or open a tool below. |
| apps.tools | Tools |
| action.opentool | Open tool |
| action.watchtutorial | Watch tutorial |
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
2. Visible focus ring in both themes.
3. Icon-only buttons have `aria-label`.
4. Form fields have a persistent visible label; errors appear next to the field and are linked with `aria-describedby`.
5. Color is never the only signal (pair with icon or text).
6. Live regions (`aria-live="polite"`) announce toasts and async results.
7. Respect `prefers-reduced-motion`.
8. Headings are in order; one `h1` per page; landmarks `header`, `nav`, `main`.
9. Zoom to 200% without horizontal scroll; viewport meta without `user-scalable=no`.
10. Any moving content (the tutorial player) never autoplays, has a visible pause button, shows captions by default, and has a text transcript below it.
11. `@axe-core/playwright` on the page in both themes: **0 serious or critical violations** (output pasted).

## 10. The `sloplint` gate (Hallmark)

`Nutlope/hallmark` includes a dependency-free checker named `sloplint.mjs`. **Gemini must not write its own version.** The user downloads the official file into `scripts/sloplint.mjs` and tells Gemini. Gemini then reads the file's `--help` or header comment, and wires `npm run sloplint` using only options the file itself documents (quote them under R1). What exact checks it performs is **not** assumed by this document; Gemini reports what the script prints. CI runs it on the built output; a failure blocks the card.
