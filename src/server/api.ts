import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { RentalStore } from "./store";
import { z } from "zod";
import { loginSchema, rentalSchema, statusSchema } from "./validation";
import { digest, newToken, parsePasswordHash, sessionCookie, sessionToken, SESSION_TTL, verifyPassword } from "./auth";

export interface ApiOptions {
  store: RentalStore;
  now?: () => number;
  passwordHash?: string;
  secureCookies?: boolean;
  trustedClientHeader?: string;
  rateLimitKey?: string;
}
class HttpError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}
export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
}
function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const target=new URL(request.url);
  let localMatch=false;
  if(origin && target.hostname==='0.0.0.0') {try {const source=new URL(origin);localMatch=['localhost','127.0.0.1','[::1]'].includes(source.hostname)&&source.protocol===target.protocol&&source.port===target.port&&source.origin===origin;}catch{}}
  if (!origin || (origin !== target.origin && !localMatch)) throw new HttpError(403, "ORIGIN_REJECTED", "Request not allowed.");
}
async function readJson(request: Request, max = 16384): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "JSON required.");
  }
  const declared = Number(request.headers.get("content-length"));
  if (declared > max) throw new HttpError(413, "BODY_TOO_LARGE", "Request too large.");
  if (!request.body) throw new HttpError(400, "INVALID_JSON", "Invalid request.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) { await reader.cancel(); throw new HttpError(413, "BODY_TOO_LARGE", "Request too large."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new HttpError(400, "INVALID_JSON", "Invalid request."); }
}
function safe(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try { return await handler(request); }
    catch (error) {
      if (error instanceof HttpError) return json({ error: error.message, code: error.code }, error.status);
      // Do not log payloads, credentials, IP addresses, or database paths.
      return json({ error: "Service unavailable.", code: "INTERNAL_ERROR" }, 503);
    }
  };
}
export function createApi(options: ApiOptions) {
  const { store } = options;
  const now = options.now ?? Date.now;
  function limit(request: Request, action: string, max: number, window: number) {
    // Opt-in only: the ingress MUST strip user values and supply one validated IP.
    // The default ignores all forwarding headers and uses a shared safe bucket.
    const candidate = options.trustedClientHeader && options.rateLimitKey && options.rateLimitKey.length >= 32
      ? request.headers.get(options.trustedClientHeader)?.trim() : undefined;
    const client = candidate && isIP(candidate) ? candidate : "unidentified";
    const key = client === "unidentified"
      ? createHash("sha256").update(`${action}:unidentified`).digest("hex")
      : createHmac("sha256", options.rateLimitKey!).update(`${action}:${client}`).digest("hex");
    if (!store.consumeLimit(key, max, window, now())) throw new HttpError(429, "RATE_LIMITED", "Too many requests. Please try later.");
  }
  const secure = options.secureCookies ?? process.env.NODE_ENV === "production";
  const passwordKey = options.passwordHash ? digest(options.passwordHash) : "";
  function authenticated(request: Request): boolean {
    if (!parsePasswordHash(options.passwordHash)) return false;
    store.db.prepare("DELETE FROM sessions WHERE expiresAt <= ? OR passwordKey != ?").run(now(), passwordKey);
    const token = sessionToken(request);
    return !!token && !!store.db.prepare("SELECT tokenHash FROM sessions WHERE tokenHash = ? AND expiresAt > ? AND passwordKey = ?").get(digest(token), now(), passwordKey);
  }
  function requireAuth(request: Request) {
    if (!authenticated(request)) throw new HttpError(401, "UNAUTHORIZED", "Authentication required.");
  }
  return {
    login: safe(async (request) => {
      checkOrigin(request);
      limit(request, "login", 5, 15 * 60 * 1000);
      const input = loginSchema.safeParse(await readJson(request, 4096));
      if (!input.success) throw new HttpError(400, "VALIDATION_ERROR", "Invalid request.");
      if (!parsePasswordHash(options.passwordHash)) throw new HttpError(503, "ADMIN_NOT_CONFIGURED", "Admin unavailable.");
      if (!await verifyPassword(input.data.password, options.passwordHash!)) throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials.");
      const old = sessionToken(request);
      if (old) store.db.prepare("DELETE FROM sessions WHERE tokenHash = ?").run(digest(old));
      store.db.prepare("DELETE FROM sessions WHERE expiresAt <= ? OR passwordKey != ?").run(now(), passwordKey);
      const token = newToken();
      store.db.prepare("INSERT INTO sessions (tokenHash, expiresAt, passwordKey) VALUES (?, ?, ?)").run(digest(token), now() + SESSION_TTL, passwordKey);
      return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(request, token, secure) });
    }),
    session: safe(async (request) => json({ authenticated: authenticated(request) })),
    logout: safe(async (request) => {
      checkOrigin(request);
      const token = sessionToken(request);
      if (token) store.db.prepare("DELETE FROM sessions WHERE tokenHash = ?").run(digest(token));
      return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(request, "", secure, true) });
    }),
    list: safe(async (request) => {
      requireAuth(request);
      const params = new URL(request.url).searchParams;
      const q = params.get("q") ?? "";
      const status = params.get("status") ?? "";
      if (q.length > 200 || (status && !statusSchema.shape.status.safeParse(status).success)) throw new HttpError(400, "VALIDATION_ERROR", "Invalid request.");
      return json({ rentals: store.listRentals(q, status) });
    }),
    update: (request: Request, id: string) => safe(async (req) => {
      checkOrigin(req);
      requireAuth(req);
      if (!z.uuid().safeParse(id).success) throw new HttpError(400, "VALIDATION_ERROR", "Invalid request.");
      const input = statusSchema.safeParse(await readJson(req, 1024));
      if (!input.success) throw new HttpError(400, "VALIDATION_ERROR", "Invalid request.");
      if (!store.updateStatus(id, input.data.status)) throw new HttpError(404, "NOT_FOUND", "Rental not found.");
      return json({ ok: true });
    })(request),
    submit: safe(async (request) => {
      checkOrigin(request);
      limit(request, "rental", 5, 15 * 60 * 1000);
      const input = rentalSchema(new Date(now())).safeParse(await readJson(request));
      if (!input.success) return json({ error: "Invalid request.", code: "VALIDATION_ERROR", fieldErrors: input.error.flatten().fieldErrors }, 400);
      return json(store.createRental(input.data), 201);
    }),
  };
}
