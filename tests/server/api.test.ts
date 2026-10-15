// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { RentalStore } from "../../src/server/store";
import { createApi } from "../../src/server/api";
const payload = { name: "Rider", email: "r@example.com", phone: "+84912345678", rentalPlan: "day", vehicleId: "ivory", startDate: "2030-01-02", endDate: "2030-01-03", pickup: "hcm", locale: "vi", consent: true };
let directory: string;
let store: RentalStore;
let api: ReturnType<typeof createApi>;
const request = (body: unknown = payload, headers: Record<string, string> = {}) => new Request("https://rent.test/api/rentals", { method: "POST", headers: { "content-type": "application/json", origin: "https://rent.test", ...headers }, body: JSON.stringify(body) });
beforeEach(() => {
  directory = mkdtempSync(join(process.env.TMPDIR!, "rentals-api-"));
  store = new RentalStore(join(directory, "rentals.sqlite"));
  api = createApi({ store, now: () => Date.parse("2030-01-02T00:00:00Z") });
});
afterEach(() => { store.close(); rmSync(directory, { recursive: true, force: true }); });
describe("public submission API", () => {
  it("creates a persisted rental and sends no-store headers", async () => {
    const result = await api.submit(request());
    expect(result.status).toBe(201);
    expect(await result.json()).toEqual({ id: expect.any(String), status: "new" });
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(store.listRentals()).toHaveLength(1);
  });
  it.each(["", "null", "https://evil.test", "https://rent.test.evil.test"]) ("rejects missing or foreign Origin %s", async (origin) => {
    expect((await api.submit(request(payload, { origin }))).status).toBe(403);
    expect(store.listRentals()).toHaveLength(0);
  });
  it("returns bounded generic validation failures", async () => {
    const result = await api.submit(request({ ...payload, phone: "bad" }));
    expect(result.status).toBe(400);
    expect(await result.json()).toEqual({ error: "Invalid request.", code: "VALIDATION_ERROR", fieldErrors: expect.objectContaining({ phone: expect.any(Array) }) });
  });
  it("bounds the actual body even when Content-Length is absent or false", async () => {
    expect((await api.submit(request({ note: "a".repeat(17000) }, { "content-length": "1" }))).status).toBe(413);
    expect((await api.submit(request(payload, { "content-type": "text/plain" }))).status).toBe(415);
    const malformed = new Request("https://rent.test/api/rentals", { method: "POST", headers: { origin: "https://rent.test", "content-type": "application/json" }, body: "{" });
    expect((await api.submit(malformed)).status).toBe(400);
  });
  it("uses per-client buckets only when an operator opts into a sanitized ingress header", async () => {
    const trusted = createApi({ store, now: () => Date.parse("2030-01-02T00:00:00Z"), trustedClientHeader: "x-ingress-client-ip", rateLimitKey: "fixture-only-rate-key-at-least-32-characters" });
    for (let i = 0; i < 5; i++) expect((await trusted.submit(request(payload, { "x-ingress-client-ip": "192.0.2.1" }))).status).toBe(201);
    expect((await trusted.submit(request(payload, { "x-ingress-client-ip": "192.0.2.1" }))).status).toBe(429);
    expect((await trusted.submit(request(payload, { "x-ingress-client-ip": "192.0.2.2" }))).status).toBe(201);
    const rows = store.db.prepare("SELECT key FROM rate_limits").all();
    expect(JSON.stringify(rows)).not.toContain("192.0.2.");
  });
  it("caps submissions despite spoofed forwarding headers and persists the limit across handlers", async () => {
    for (let i = 0; i < 5; i++) expect((await api.submit(request(payload, { "x-forwarded-for": `1.2.3.${i}` }))).status).toBe(201);
    const restarted = createApi({ store, now: () => Date.parse("2030-01-02T00:00:00Z") });
    expect((await restarted.submit(request())).status).toBe(429);
  });
});
