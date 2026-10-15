import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
export const SESSION_TTL = 8 * 60 * 60 * 1000;
export const COOKIE_NAME = "rental_admin";
export function digest(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function parsePasswordHash(value?: string): { salt: string; key: Buffer } | null {
  if (!value) return null;
  const match = /^scrypt\$16384\$8\$1\$([a-f0-9]{32})\$([a-f0-9]{128})$/.exec(value);
  return match ? { salt: match[1], key: Buffer.from(match[2], "hex") } : null;
}
export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const hash = parsePasswordHash(encoded);
  if (!hash) return false;
  const key = await derive(password, hash.salt, 64) as Buffer;
  return timingSafeEqual(key, hash.key);
}
export function newToken() { return randomBytes(32).toString("base64url"); }
export function sessionToken(request: Request): string | null {
  const cookies = request.headers.get("cookie") ?? "";
  if (cookies.length > 8192) return null;
  const tokens = cookies.split(";").map((part) => part.trim()).filter((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (tokens.length !== 1) return null;
  const token = tokens[0].slice(COOKIE_NAME.length + 1);
  return /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}
export function sessionCookie(request: Request, token: string, secure: boolean, clear = false) {
  return `${COOKIE_NAME}=${clear ? "" : token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear ? 0 : SESSION_TTL / 1000}${secure || new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
