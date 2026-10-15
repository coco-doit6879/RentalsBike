# Rental request backend

## Local setup

Requires **Node.js >=22.13** with the built-in `node:sqlite` module (verified here on Node 26.7.0). Run from the project root:

```sh
npm run admin:setup
```

Enter and confirm your own password (12–1024 characters) in the interactive, masked terminal prompt. There is no default password and no generated administrator credential. Do not supply passwords in arguments, pipes, chat, source files, or logs. Setup stores only a randomly salted scrypt hash in `.env.local`, preserves unrelated environment entries, and restricts permissions where supported. On Windows, restrict the project and data directory with filesystem ACLs as well. Restart the Next.js server after setup or password changes. Changing the configured hash invalidates existing sessions after restart.

Start the site with `npm run dev`, then visit `/admin`. No real administrator credential or project database was created by the backend tests.

## Server-only configuration

Never prefix these variables with `NEXT_PUBLIC_`:

| Variable | Default / behavior |
| --- | --- |
| `ADMIN_PASSWORD_HASH` | Required for admin login. Setup writes `scrypt$16384$8$1$<32 hex salt>$<128 hex key>`. Missing/malformed configuration fails closed with 503. `.env.local` dollars are escaped because Next's dotenv expansion would otherwise corrupt the hash. In a deployment secret manager, store the raw hash without dotenv escaping. |
| `RENTAL_DB_PATH` | `private-data/rentals.sqlite` relative to the running server's working directory. Prefer an absolute path on production persistent storage. |
| `ADMIN_COOKIE_SECURE` | Secure on production, always Secure for HTTPS request URLs. Set `false` only for deliberate local/private HTTP deployments; HTTPS still uses Secure. |
| `RENTAL_TRUSTED_CLIENT_HEADER` | Unset: ignore forwarding headers and share a conservative global throttle. Set only if a trusted reverse proxy strips incoming copies and overwrites this header with exactly one validated client IP. Never expose the backend directly when enabling this option. |
| `RENTAL_RATE_LIMIT_KEY` | With trusted client header, a private deployment secret of at least 32 characters enables HMAC client buckets. Missing/short key falls back to a shared global bucket. This is not an administrator password. |

The Node request abstraction does not expose a trustworthy transport peer IP. Therefore `X-Forwarded-For`, `X-Real-IP`, and similar arbitrary headers are **not trusted by default**. Without configured trusted ingress, every visitor shares five submission attempts per 15 minutes; login has its own five-attempt/15-minute bucket. Invalid attempts also consume the bucket. Trusted client configuration enables the same cap per client; only keyed digests, not IP addresses, are persisted. Rate windows persist across server restarts. Add reverse-proxy/WAF connection, body, and global request limits for public deployments; the app's JSON byte cap does not replace ingress slow-client protection.

## API contract

All responses are JSON with `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`. Errors are `{ "error": "Generic message.", "code": "MACHINE_CODE", "fieldErrors": { ... } }`; `fieldErrors` is included for rental validation failures and never contains submitted values. Typical statuses: 400 validation/JSON, 401 unauthenticated or invalid credentials, 403 origin, 404 unknown rental, 413 body too large, 415 non-JSON, 429 throttle, 503 unavailable/unconfigured. There is **no public rental-list endpoint**.

All mutations require `Origin` exactly matching `new URL(request.url).origin`, including port and scheme. Missing or `null` Origin is rejected. Local-only exception: when Next binds its URL to `0.0.0.0`, loopback browser origins (`localhost`, `127.0.0.1`, `[::1]`) with the same port and scheme are accepted. Arbitrary network origins remain rejected. Send `Content-Type: application/json` for body-bearing mutations. Safe GETs allow no-Origin requests but still enforce admin authentication where needed. There is no cross-origin access policy/CORS allowance. Configure the proxy's canonical Host and HTTPS forwarding so Next sees the external request URL, and restrict accepted Host values at ingress.

### `POST /api/rentals`

Maximum 16 KiB actual streamed JSON body, regardless of declared `Content-Length`. Strict object, no unknown keys:

```json
{
  "name": "Rider name",
  "email": "rider@example.com",
  "phone": "+84912345678",
  "vehicleId": "ivory",
  "rentalPlan": "day",
  "startDate": "2030-01-02",
  "endDate": "2030-01-03",
  "pickup": "hcm",
  "note": "Optional plain text",
  "locale": "vi",
  "consent": true,
  "website": ""
}
```

- Name: trimmed, 1–120 characters; email valid and <=254 characters.
- Phone: trimmed, 7–15 digits with one optional leading `+`; spaces, dots, hyphens and parentheses are accepted and normalized before the 7–15 digit check.
- `vehicleId`: `ivory|graphite|blue`.
- `rentalPlan`: `day|week|month|quarter|half-year|year`, required. This records the requested plan only; no automatic price/total or inventory reservation is created.
- Dates: real calendar dates in exact `YYYY-MM-DD`; start >= today's date in **Asia/Ho_Chi_Minh (UTC+07:00)**; end strictly after start.
- `pickup`: `hcm|hanoi|danang`; `locale`: `vi|en`; `consent`: literal `true`.
- Note optional, <=2,000 characters. Honeypot `website` optional but must be empty. A filled honeypot is rejected.

Returns HTTP 201 `{ "id": "uuid", "status": "new" }`. The record is committed to SQLite before success. Client text is stored as data with parameterized SQL, not evaluated. Consumers must render it as escaped text (React text nodes), never raw HTML.

### Admin

| Endpoint | Request / response |
| --- | --- |
| `POST /api/admin/login` | `{ "password": "user supplied" }` (4 KiB body max) → `{ "ok": true }`, sets cookie. Actual scrypt derivation and timing-safe comparison; no plaintext password storage/logging. |
| `GET /api/admin/session` | `{ "authenticated": true|false }`; does not expose PII. |
| `POST /api/admin/logout` | Same Origin required; revokes the token in SQLite and expires the cookie → `{ "ok": true }`. Safe to repeat. |
| `GET /api/admin/rentals?q=&status=` | Auth required. Latest 200 matching records, newest first. `q` <=200 chars searches literal name/email/phone (SQL wildcards escaped). `status` empty or one of the status values. Returns `{ "rentals": [{ "id", "name", "email", "phone", "vehicleId", "rentalPlan", "startDate", "endDate", "pickup", "note", "locale", "status", "createdAt" }] }`. |
| `PATCH /api/admin/rentals/[id]` | Auth and same Origin required, UUID ID, strict `{ "status": "new|contacted|confirmed|cancelled" }` (1 KiB body max) → `{ "ok": true }`. |

Admin sessions use a cryptographically random 256-bit opaque token. Only its SHA-256 digest is stored in the server-side SQLite sessions table, bound to the configured password hash. Cookie: `rental_admin`, HttpOnly, SameSite=Strict, Path=/, Secure as above, eight-hour maximum lifetime. Expiry is also enforced server-side; logout revokes server-side state. Login replaces the current session token. Session cookies are credentials: do not log or expose them.

## Deployment, durability, and privacy

Run as a **Node server on a private persistent local disk/volume**, not Edge runtime. SQLite uses WAL, parameterized queries, a busy timeout, and a transaction-protected repeatable migration that adds `rentalPlan` with existing rows defaulting to `day`. Directory creation requests mode 0700 and database mode 0600 where supported. Keep database, `-wal`, and `-shm` files outside `public/`, source control, build artifacts, and downloadable static directories. The database path exists only in server modules.

An ephemeral serverless filesystem (including a default ephemeral Vercel function filesystem) is **not persistent storage** and this backend must not be presented as durable there. Use a persistent single-host deployment or deliberately redesign the storage layer for managed database hosting. Do not put SQLite WAL on unsuitable shared network storage or replicate separate files across independently running instances. Back up with SQLite's online backup facilities, or stop writers and copy the consistent database plus any required WAL state; copying only the main file while writers run can omit committed records. Verify restore procedures and protect backups like production PII.

Submissions contain personal information. Restrict administrator and filesystem access, terminate HTTPS, avoid payload/access-cookie logging, and arrange disk/back-up encryption operationally. This implementation intentionally has no PII/IP logging. Configure any proxy/platform logs accordingly. It does not send email/SMS notifications, take payment, calculate totals, or reserve inventory.

**Retention is an operator decision, not an invented application policy.** No automatic rental deletion or retention-period environment variable is implemented. Decide and document a lawful retention/deletion policy (including backups) before accepting real customer requests; implement a reviewed purge job if required. Expired sessions and rate-limit records are cleaned when those features run.

## Verification

```sh
npx vitest run --config tests/server/vitest.config.ts
npm run typecheck
```

Tests use actual `node:sqlite`, temporary databases beneath `process.env.TMPDIR`, and fixture-only scrypt hashes. Set TMPDIR to a user-owned scratch directory if your shell does not export it. Every backend test has a Node-environment directive. The isolated config avoids the main browser test setup, which must guard references to `window` if the parent suite includes Node files.

Coverage includes persistence after reopen; repeatable legacy migration; Vietnam date boundaries/leap days; required plan; consent/honeypot/field bounds; actual body cap; strict Origin; forwarding-header spoofing/default global limits; explicit trusted-client HMAC buckets; unauthorized PII access; actual scrypt login; random hashed tokens; cookies; TTL/logout; missing configuration; literal SQL/XSS text; query cap; status whitelist; all six Next route adapters; dotenv-safe hash preservation; and setup rejecting noninteractive input. The interactive masked setup prompt itself requires a user terminal and is not driven with a real credential by automated tests.
