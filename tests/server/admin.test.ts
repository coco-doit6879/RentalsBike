// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { scryptSync, createHash } from "node:crypto";
import { RentalStore } from "../../src/server/store";
import { createApi } from "../../src/server/api";

const password = "test-fixture-only-not-a-real-secret";
const salt = "a".repeat(32);
const hash = `scrypt$16384$8$1$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
let store: RentalStore;
let api: ReturnType<typeof createApi>;
let directory: string;
let clock: number;
const req = (path: string, method = "GET", body?: unknown, cookie = "", origin = "https://rent.test") => new Request(`https://rent.test/api/admin/${path}`, {
  method, headers: { ...(method !== "GET" ? { origin, "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});
async function login() {
  const result = await api.login(req("login", "POST", { password }));
  expect(result.status).toBe(200);
  expect(await result.json()).toEqual({ ok: true });
  return result.headers.get("set-cookie")!;
}
beforeEach(() => {
  directory = mkdtempSync(join(process.env.TMPDIR!, "rentals-admin-"));
  store = new RentalStore(join(directory, "rentals.sqlite"));
  clock = Date.parse("2030-01-02T00:00:00Z");
  api = createApi({ store, passwordHash: hash, now: () => clock });
});
afterEach(() => { store.close(); rmSync(directory, { recursive: true, force: true }); });
describe("admin authentication", () => {
  it("never exposes rentals without a valid server-side session", async () => {
    expect((await api.list(req("rentals"))).status).toBe(401);
    expect((await api.list(req("rentals", "GET", undefined, "rental_admin=fake"))).status).toBe(401);
    expect(await (await api.session(req("session"))).json()).toEqual({ authenticated: false });
  });
  it("verifies actual scrypt hashes and stores only a random token digest", async () => {
    expect((await api.login(req("login", "POST", { password: "wrong" }))).status).toBe(401);
    const cookie = await login();
    expect(cookie).toContain("HttpOnly"); expect(cookie).toContain("SameSite=Strict"); expect(cookie).toContain("Secure");
    expect(cookie).toContain("Max-Age=28800");
    const token = cookie.split(";")[0].split("=")[1];
    expect(token.length).toBeGreaterThanOrEqual(43);
    const saved = store.db.prepare("SELECT * FROM sessions").get()!;
    expect(saved.tokenHash).toBe(createHash("sha256").update(token).digest("hex"));
    expect(JSON.stringify(saved)).not.toContain(token);
    expect(await (await api.session(req("session", "GET", undefined, cookie))).json()).toEqual({ authenticated: true });
  });
  it("expires sessions after eight hours", async () => {
    const cookie = await login(); clock += 8 * 60 * 60 * 1000;
    expect(await (await api.session(req("session", "GET", undefined, cookie))).json()).toEqual({ authenticated: false });
    expect((await api.list(req("rentals", "GET", undefined, cookie))).status).toBe(401);
  });
  it("revokes sessions on same-origin logout", async () => {
    const cookie = await login();
    expect((await api.logout(req("logout", "POST", {}, cookie, "https://evil.test"))).status).toBe(403);
    const response = await api.logout(req("logout", "POST", {}, cookie));
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(await (await api.session(req("session", "GET", undefined, cookie))).json()).toEqual({ authenticated: false });
  });
  it("throttles login attempts regardless of fake client headers", async () => {
    for (let i = 0; i < 5; i++) expect((await api.login(req("login", "POST", { password: "wrong" }))).status).toBe(401);
    expect((await api.login(req("login", "POST", { password }))).status).toBe(429);
    clock += 15 * 60 * 1000;
    expect((await api.login(req("login", "POST", { password }))).status).toBe(200);
  });
  it("fails closed with no configured or malformed hash", async () => {
    for (const passwordHash of [undefined, "invalid", "scrypt$9999999999$8$1$bad$bad"]) {
      const unconfigured = createApi({ store, passwordHash, now: () => clock });
      expect((await unconfigured.login(req("login", "POST", { password }))).status).toBe(503);
    }
  });
  it("supports explicit local HTTP cookies but never disables secure on HTTPS", async () => {
    const localApi = createApi({ store, passwordHash: hash, secureCookies: false, now: () => clock });
    const localReq = new Request("http://localhost:3000/api/admin/login", { method: "POST", headers: { origin: "http://localhost:3000", "content-type": "application/json" }, body: JSON.stringify({ password }) });
    expect((await localApi.login(localReq)).headers.get("set-cookie")).not.toContain("; Secure");
    expect((await localApi.login(req("login", "POST", { password }))).headers.get("set-cookie")).toContain("; Secure");
  });
});
describe("authorized rental administration", () => {
  const input = { name: "<script>alert(1)</script>", email: "r@example.com", phone: "+84912345678", rentalPlan: "day", vehicleId: "ivory", startDate: "2030-01-02", endDate: "2030-01-03", pickup: "hcm", note: "xss stored as text", locale: "vi" };
  it("lists, searches, and updates only whitelisted statuses", async () => {
    const rental = store.createRental(input);
    const cookie = await login();
    expect(await (await api.list(req("rentals", "GET", undefined, cookie))).json()).toEqual({ rentals: [expect.objectContaining({ ...input, ...rental })] });
    expect((await api.update(req(`rentals/${rental.id}`, "PATCH", { status: "confirmed" }, cookie), rental.id)).status).toBe(200);
    expect(await (await api.list(req("rentals?q=r%40example.com&status=confirmed", "GET", undefined, cookie))).json()).toEqual({ rentals: [expect.objectContaining({ status: "confirmed" })] });
    expect(await (await api.list(req("rentals?status=new", "GET", undefined, cookie))).json()).toEqual({ rentals: [] });
    expect((await api.list(req("rentals?status=evil", "GET", undefined, cookie))).status).toBe(400);
    expect((await api.update(req(`rentals/${rental.id}`, "PATCH", { status: "<script>" }, cookie), rental.id)).status).toBe(400);
    expect((await api.update(req("rentals/bad", "PATCH", { status: "confirmed" }, cookie), "bad")).status).toBe(400);
    expect((await api.update(req(`rentals/${rental.id}`, "PATCH", { status: "confirmed" }), rental.id)).status).toBe(401);
    expect((await api.update(req(`rentals/${rental.id}`, "PATCH", { status: "confirmed" }, cookie, ""), rental.id)).status).toBe(403);
    expect((await api.update(req("rentals/00000000-0000-4000-8000-000000000000", "PATCH", { status: "new" }, cookie), "00000000-0000-4000-8000-000000000000")).status).toBe(404);
  });
  it("caps the latest list at 200 and treats SQL wildcard/injection search as literal text", async () => {
    for (let i = 0; i < 205; i++) store.createRental({ ...input, name: `Rider ${i}` });
    const cookie = await login();
    const result = await (await api.list(req("rentals", "GET", undefined, cookie))).json();
    expect(result.rentals).toHaveLength(200);
    expect(result.rentals[0].name).toBe("Rider 204");
    for (const query of ["%", "' OR 1=1 --"]) {
      expect(await (await api.list(req(`rentals?q=${encodeURIComponent(query)}`, "GET", undefined, cookie))).json()).toEqual({ rentals: [] });
    }
  });
});
