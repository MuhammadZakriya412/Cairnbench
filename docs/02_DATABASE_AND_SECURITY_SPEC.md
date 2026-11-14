# 02 — Database, Access Rules, Security and Server Functions

Gemini writes the SQL and TypeScript. This file defines **what must be true**. The permission matrix in §4 is the test oracle: if the SQL disagrees with the matrix, the SQL is wrong. All SQL you write is **UNTESTED SQL** until the user runs it in Supabase and pastes the result back (R7).

## 1. Ground rules for Supabase (read before writing SQL)

1. Every table in `public` has Row-Level Security **enabled** in the same migration that creates it. No exceptions.
2. Application tables reference `auth.users` only through `public.profiles(id)`. Never write to tables in the `auth` schema, except the one trigger described in §2.1.
3. Helper functions that read protected tables are `SECURITY DEFINER` with a fixed `search_path` (set it to `public`). Mark pure lookups `STABLE`.
4. In policies, call `auth.uid()` as `(select auth.uid())` so it is evaluated once per statement (documented Supabase performance advice; if unsure, keep the plain form and note it under UNVERIFIED).
5. **Email-verified check:** the exact JWT claim path for email verification is not certain. Do **not** read it from the JWT. Instead define `public.current_user_email_verified()` that reads `email_confirmed_at` for `auth.uid()` from `auth.users` inside a `SECURITY DEFINER` function, and use only that function.
6. SHA-256 hashing is done in SQL with the built-in `sha256(bytea)` function (Postgres core): `encode(sha256(convert_to(value,'UTF8')),'hex')`. Do not enable extensions for hashing.
7. Never use generated columns for size accounting (immutability rules are easy to get wrong). Compute sizes in a `BEFORE INSERT OR UPDATE` trigger with `pg_column_size`/`octet_length`.
8. The `service_role` key is **never used** anywhere (L-rules in 01). Edge Functions use only the anon key plus the caller's JWT, or call the `SECURITY DEFINER` RPCs below.
9. All multi-step changes (create org + make owner, redeem token + insert share) happen inside one RPC function so they are atomic.
10. Number migrations `001_...sql`, `002_...sql`. A migration never edits an earlier migration; fixes are new migrations.
11. If any SQL feature, function name or setting is uncertain, STOP and ask the user to run a one-line probe in the SQL Editor (for example `select proname from pg_proc where proname = 'sha256';`) and paste the output.

## 2. Tables (columns and rules; Gemini writes DDL)

### 2.1 `profiles`
`id` (uuid, PK, references `auth.users` on delete cascade), `handle` (case-insensitive, unique, nullable until chosen, pattern `^[a-z0-9_]{3,30}$`), `display_name`, `avatar_url`, `theme` (`carbon-studio|alabaster-paper|cobalt-slate|warm-atelier`, default `carbon-studio`), `density` (`comfortable|compact`), `motion` (`fluid|reduced`), `default_launch` (`preview|workspace`), `redaction_rules` (jsonb, default `{}`), `created_at`, `updated_at`.
Trigger `AFTER INSERT ON auth.users` → `SECURITY DEFINER` function creates the matching profile row (take `full_name`/`avatar_url` from `raw_user_meta_data` if present). This is the only write allowed into the auth schema's trigger list.

### 2.2 `organizations`, `organization_members`, `organization_invites`
- `organizations`: `id`, `name` (2–80 chars), `slug` (unique, `^[a-z0-9-]{2,40}$`), `description`, `accent_color` (`#RRGGBB` or null), `created_by`, `created_at`.
- `organization_members`: PK (`org_id`,`user_id`), `role` (`owner|admin|member`), `created_at`. **The owner is whoever has role `owner` here. There is no owner column on `organizations`.**
- `organization_invites`: `id`, `org_id`, `email` (optional lock), `role` (`admin|member` only), `token_hash` (unique), `invited_by`, `expires_at` (7 days), `accepted_at`, `revoked_at`.

### 2.3 `vault_items`
`id` (uuid, PK, **client may supply it** for idempotent imports), `owner_id`, `org_id` (null = personal), `app_id` (text, **CHECK `app_id ~ '^[a-z][a-z0-9-]{2,31}$'`, not an enum**, so a new app needs no migration; valid ids are enforced by the client registry and Zod; launch values: `context-packer`, `api-runner`, `log-regex-explorer`, `prompt-composer`, `mcp-hub`), `title` (≤200), `summary`, `content` (jsonb, ≤512 KB), `byte_size` (set by trigger), `tags` (text[]), `is_encrypted`, `enc_meta` (jsonb: `alg`, `kdf`, `iterations`, `salt`, `iv`; never key material), `version` (int, starts 1), `created_at`, `updated_at`, `deleted_at` (soft delete).

### 2.4 `vault_item_versions`
PK (`item_id`,`version`), `content`, `edited_by`, `created_at`. Written only by the trigger in §3. Keep the newest 20 per item.

### 2.5 `vault_shares`
`id`, `item_id`, `shared_with_user` (nullable), `invited_email` (nullable, for pending shares), `token_hash` (nullable unique, for link shares), `permission` (`view|edit`), `shared_by`, `expires_at`, `created_at`. A row must have at least one of the three targets.

### 2.6 `vault_annotations`
`id`, `item_id`, `author_id`, `anchor_snippet` (≤500 chars), `comment` (≤2000), `item_version`, `status` (`open|approved|changes_requested`), `created_at`.

### 2.7 `api_tokens`
`id`, `user_id`, `org_id` (nullable), `name`, `prefix` (first 8 chars, for display), `token_hash` (unique), `scopes` (text[] from `vault:read`, `vault:write`, `tools:run`), `expires_at` (default 90 days), `last_used_at`, `revoked_at`. The `token_hash` column is **not selectable** by the `authenticated` role (use column privileges).

### 2.8 `audit_log`, `usage_counters`
- `audit_log`: `id` (identity), `actor`, `org_id`, `action`, `target`, `meta` (jsonb), `created_at`. Written by RPCs. Never contains item content.
- `usage_counters`: PK (`user_id`,`day`,`kind`), `count`. Used for proxy and MCP daily limits.

## 3. Helper functions and triggers (behaviors)

| Name | Behavior |
|---|---|
| `current_user_email_verified()` | true when `email_confirmed_at` of `auth.uid()` is not null |
| `is_org_member(org)` / `org_role_of(org)` | membership / role of `auth.uid()` in `org` |
| `can_read_item(item)` | true if item not deleted AND (caller owns it OR it has an `org_id` and caller is a member OR a share row targets the caller and is not expired) |
| `can_edit_item(item)` | true if not deleted AND (caller owns a personal item OR caller is org `owner`/`admin` for an org item OR caller created an org item OR a non-expired `edit` share targets the caller) |
| `vault_items` BEFORE trigger | on INSERT: reject over-quota (see §6), set `byte_size`, `version=1`. On UPDATE: **reject any change to `owner_id` or `org_id`**, require `NEW.version = OLD.version + 1` (optimistic lock, error code `version_conflict`), copy the old row's content into `vault_item_versions`, prune to newest 20, set `updated_at`. |
| Last-owner protection | trigger/RPC logic rejects any change that would leave an organization with zero `owner` rows |

## 4. Access rules — the matrix (this is the test oracle)

Actors: **owner** (org owner), **admin**, **member**, **outsider** (signed in, not in org, no share), **view-sharee**, **edit-sharee**, **unverified** (signed in, email not verified), **anon** (not signed in). "Item" = an organization item unless stated. A = allowed, D = denied.

| Action | owner | admin | member | outsider | view-sharee | edit-sharee | unverified | anon |
|---|---|---|---|---|---|---|---|---|
| Read org item | A | A | A | D | A | A | D (unless member/owner of it) | D |
| Read personal item (not theirs) | D | D | D | D | A only via share | A only via share | D | D |
| Create org item | A | A | A | D | D | D | D | D |
| Edit org item created by someone else | A | A | D | D | D | A | D | D |
| Edit own org item | A | A | A | D | – | – | D | D |
| Change `owner_id` or `org_id` | D | D | D | D | D | D | D | D |
| Soft-delete org item | A | A | own only | D | D | D | D | D |
| Create share on an item | A (own or org item) | A (org items) | own items only | D | D | D (cannot re-share) | D | D |
| Read share rows of an item | A | A | own items only | D | own row only | own row only | D | D |
| Create annotation | A | A | A | D | A | A | D | D |
| Set annotation status approved/changes_requested | A | A | D | D | D | A | D | D |
| Read versions | as Read | | | | | | | |
| Read audit log | A | A | D | D | D | D | D | D |
| Invite to org | A | A (not owner role) | D | D | D | D | D | D |
| Change member role | A | A (not touching owner) | D | D | D | D | D | D |
| Remove member | A (not last owner) | A (not owner) | self only | D | D | D | D | D |
| Transfer ownership | A | D | D | D | D | D | D | D |
| Create / revoke own API token | A | A | A | A | A | A | D | D |

Additional rules:
- Direct `INSERT/UPDATE/DELETE` on `organizations`, `organization_members`, `organization_invites`, `vault_shares`, `api_tokens`, `audit_log`, `usage_counters` is **denied for every client role**; the RPCs in §5 are the only way.
- `profiles`: a user can read and update only their own row. Looking up another user by handle goes through an RPC that returns only `id`, `handle`, `display_name`, `avatar_url`.
- A soft-deleted item is invisible to everyone except its owner (for "Recently deleted" within 30 days).

## 5. RPC functions (names are fixed; arguments listed; behaviors binding)

| RPC | Behavior |
|---|---|
| `create_org(name, slug)` | Creates the org and the caller's `owner` membership atomically. Error `slug_taken`. |
| `create_org_invite(org, role, email?)` | Caller must be owner/admin. Generates a 32-byte random token **in the client-facing return only once**, stores its SHA-256, expiry now+7 days. Returns the raw token. Admin cannot invite as `owner`. |
| `accept_org_invite(token)` | Hash the token; invite must exist, not expired/revoked/accepted; if `email` is set, caller must be email-verified and match. Inserts membership, marks accepted. Idempotent for the same user. |
| `revoke_org_invite(id)`, `set_member_role(org,user,role)`, `remove_org_member(org,user)`, `transfer_org_ownership(org,new_owner)` | Enforce §4 and last-owner protection. Write `audit_log`. |
| `create_share(item, target, permission, expires_at?)` | `target` is one of: user id, handle, verified-email string, or "link". For email targets the row stays pending (`invited_email`). For link targets returns a raw token once. Caller must pass the §4 rule. |
| `redeem_share_token(token)` | Caller must be signed in. Hash, find an unexpired link share, bind `shared_with_user = auth.uid()` (idempotent), return the item id. |
| `claim_pending_shares()` | Called after sign-in. Requires `current_user_email_verified()`. Binds pending `invited_email` shares whose email equals the caller's email. |
| `lookup_handle(handle)` | Returns the 4 public fields or nothing. |
| `create_api_token(name, scopes, org?)` | Returns the raw token **once** in the form `cb_<8 prefix chars>_<random secret>`; stores only the SHA-256. |
| `revoke_api_token(id)` | Owner only. |
| `delete_my_account()` | Cascades the caller's personal data, removes memberships (blocked if the caller is the last owner of an org that has other members — error `transfer_required`). |
| `export_my_data()` | Returns JSON of everything the caller owns. |
| `consume_usage(kind, limit)` | Increments today's counter for the caller and raises `rate_limited` when over `limit`. |
| `mcp_authenticate(raw_token)` | SHA-256 the token inside SQL, return user id + scopes + org if valid (not revoked, not expired), else nothing. Updates `last_used_at`. |
| `mcp_vault_search(raw_token, query, limit)` / `mcp_vault_get(raw_token, id)` / `mcp_vault_save(raw_token, ...)` | Each verifies the token **inside the function**, checks the scope, and applies the **same visibility rule** as `can_read_item` for the token's user. Encrypted items are never returned (title only, `content` withheld). |

The `mcp_*` functions are callable by the `anon` role because they carry their own authentication (a leaked hash is useless without the raw token, and the raw token is never stored). Rate-limit them with `consume_usage`.

## 6. Quotas and retention

| Rule | Value | Where enforced |
|---|---|---|
| Item size | 512 KB | check constraint + trigger |
| Per user | 20 MB total of `byte_size` for items they own (personal and org-created) | trigger on insert/update, error `quota_user` |
| Per org | 100 MB | trigger, error `quota_org` |
| Versions | newest 20 per item | trigger |
| Soft-deleted items | purged after 30 days | scheduled job (see 05 card 8.3) |
| Audit log | 1 year | scheduled job |
| Daily limits | proxy 100/user/day and a global ceiling; MCP 1,000 calls/token/day | `consume_usage` |
| Global users cap | `MAX_USERS` (default 100), checked at sign-up with a waiting-list screen | RPC `signup_allowed()` called by the Auth page before sign-up |

Usage warnings: at 80% of the user quota show a notice in Settings; at 95% refuse new writes (reads and export keep working).

## 7. Client-side encryption (optional per item)

- WebCrypto AES-256-GCM. Key from a user passphrase via PBKDF2-SHA-256, **600,000 iterations**, random 16-byte salt, random 12-byte IV **per save**, all stored in `enc_meta`. The passphrase and key are never stored or sent.
- Before first use the user must tick: "I understand I cannot recover this item if I forget the passphrase, and search and AI tools cannot read it."
- Encrypted items: no content search, no diffing, no MCP access, comments are allowed (they are not the body). Title and tags stay plain unless the user chooses to hide them (default: plain; show a badge saying so).
- Org members can open an encrypted item only with the passphrase shared outside the app.
- A `<private>...</private>` stripper is a best-effort text tool; the UI says so and shows "N private blocks removed".

## 8. Proxy Edge Function (`supabase/functions/proxy`) — rules

Authentication: requires the caller's JWT; create a Supabase client with the anon key and the caller's `Authorization` header; reject if `auth.getUser()` fails. Then call `consume_usage('proxy', 100)`. A `PROXY_ENABLED` environment setting set to anything but `true` makes it return `503 proxy_disabled`.

Request validation (Zod): method in GET/POST/PUT/PATCH/DELETE/HEAD, url string ≤2048, headers ≤30 entries, body ≤1 MB.

Steps in order:
1. Parse URL. Allow only `http:` and `https:`. Ports only 80, 443, 8080, 8443 (default port allowed). Reject URLs with username/password. Reject hostnames that are numeric IP forms in decimal, octal or hex.
2. Resolve **A and AAAA** records. Reject if **any** resolved address is inside: `0.0.0.0/8`, `10.0.0.0/8`, `100.64.0.0/10`, `127.0.0.0/8`, `169.254.0.0/16`, `172.16.0.0/12`, `192.0.0.0/24`, `192.168.0.0/16`, `198.18.0.0/15`, `224.0.0.0/4`, `240.0.0.0/4`, `::`, `::1`, `fc00::/7`, `fe80::/10`, `::ffff:0:0/96` (IPv4-mapped), `64:ff9b::/96`.
3. Connect to the validated address so the second lookup cannot change it. **Whether the Edge runtime allows connecting to a fixed IP while sending the original host name for TLS is UNKNOWN.** Card 6.0 is a spike that answers this with real output. If it is not possible: validate again immediately before `fetch`, compare the two lookups, reject if different, document the remaining rebinding risk in `docs/KNOWN_RISKS.md`, and keep the proxy off for Tier C.
4. `redirect: manual`. Follow at most 3 redirects; re-run steps 1–3 on every hop.
5. Timeout 10 s. Response body read as a stream, abort at 2 MB.
6. Request headers: allow-list only what the user set; drop `Cookie` and `Authorization` unless the user explicitly set them on that step; never forward the caller's Supabase headers.
7. Response: status, selected headers, timing, body (truncated flag). Never log bodies, headers or URLs with query strings.

**Hostile URL test list** (all must be rejected; Gemini writes tests that call the validation functions; Card 6.3): `http://127.0.0.1/`, `http://localhost/`, `http://0.0.0.0/`, `http://[::1]/`, `http://[::ffff:127.0.0.1]/`, `http://2130706433/`, `http://0x7f000001/`, `http://0177.0.0.1/`, `http://169.254.169.254/latest/meta-data/`, `http://metadata.google.internal/`, `http://10.0.0.5/`, `http://172.16.0.1/`, `http://192.168.1.1/`, `http://100.64.0.1/`, `http://[fc00::1]/`, `http://[fe80::1]/`, `http://user:pass@example.com/`, `ftp://example.com/`, `file:///etc/passwd`, `https://example.com:22/`, `https://example.com:6379/`, a hostname that resolves to a private address (test with a stubbed resolver), a public URL that redirects to `http://169.254.169.254/`, a redirect loop of 5, a response larger than 2 MB, a response that never finishes.

## 9. MCP Edge Function (`supabase/functions/mcp`) — rules

- Transport: MCP over HTTP (Streamable HTTP). Gemini must read the current MCP specification pages the user pastes (Card 7.0 says which) and **must not write the protocol from memory**. If the pasted spec and memory disagree, the spec wins.
- Auth: `Authorization: Bearer cb_...`. The function never queries tables directly; it calls the `mcp_*` RPCs only.
- Tools (v1): `vault_search`, `vault_get`, `scrub_text`, `explain_cron`, `test_regex`, `render_template`. `vault_save` only with the `vault:write` scope. Each tool has a Zod input schema and returns plain text/JSON.
- Progressive disclosure: `tools/list` returns names and one-line descriptions; a `describe_tool` tool returns the full schema.
- Router ("which tool for this task?"): keyword/BM25 scoring over tool descriptions and the user's tags. **No LLM call.** Logs store a hash and the length of the prompt, never the text, unless the user turned on "keep prompts for 30 days".
- Limits: 120 requests/minute/token, 1 MB request, 25 s timeout. Kill switch `MCP_ENABLED`.

## 10. Applying and testing SQL without Docker

Gemini cannot start local Supabase. Procedure for every migration card:
1. Gemini writes the migration file and a matching test script `supabase/tests/<name>.sql`.
2. The user opens a **separate throwaway Supabase project** (free) for tests, or a branch of the main one, pastes the migration into the SQL Editor, runs it, pastes the output back.
3. Gemini reads the pasted output and fixes; the loop repeats until the user's pasted output shows the matrix passing.
4. Tests act as each actor by setting the role and JWT claims inside a transaction (technique: set the `request.jwt.claims` setting to a JSON object containing `sub` and then switch to the `authenticated` role; the test script must `ROLLBACK` at the end). If this technique fails, Gemini asks the user to paste the error instead of guessing a different one.
5. Only after the matrix passes does the same migration run against the real project.

## 11. Security checklist (Gemini keeps `docs/SECURITY_CHECKLIST.md`; user ticks)

- RLS enabled on every `public` table (query lists any table without it; output pasted).
- No policy uses `USING (true)` on a table that holds user data.
- No `service_role` anywhere (search output pasted).
- Every RPC listed in §5 exists, is `SECURITY DEFINER` only where required, and has `search_path` fixed.
- Raw tokens appear only in function return values, never in tables or logs.
- Content Security Policy header set by Pages `_headers` file: no inline scripts, `frame-ancestors 'none'`, `connect-src` limited to the Supabase URL.
- Dependency audit (`npm audit`) output pasted, high/critical = none or documented.
- Hostile-URL tests pass.
- Account deletion tested end to end with a throwaway account.
