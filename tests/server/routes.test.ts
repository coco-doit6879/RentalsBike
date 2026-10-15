// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { scryptSync } from "node:crypto";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
it("wires every Next route to real SQLite and authentication without a public list endpoint", async () => {
  const dir = mkdtempSync(join(process.env.TMPDIR!, "rentals-routes-"));
  vi.stubEnv("RENTAL_DB_PATH", join(dir, "rentals.sqlite"));
  const salt = "b".repeat(32);
  vi.stubEnv("ADMIN_PASSWORD_HASH", `scrypt$16384$8$1$${salt}$${scryptSync("fixture-only-password", salt, 64).toString("hex")}`);
  const publicRoute = await import("../../src/app/api/rentals/route");
  const loginRoute = await import("../../src/app/api/admin/login/route");
  const sessionRoute = await import("../../src/app/api/admin/session/route");
  const listRoute = await import("../../src/app/api/admin/rentals/route");
  const updateRoute = await import("../../src/app/api/admin/rentals/[id]/route");
  const logoutRoute = await import("../../src/app/api/admin/logout/route");
  const { closeApi } = await import("../../src/server/runtime");
  const request = (path: string, method = "GET", body?: unknown, cookie = "") => new Request(`https://rent.test/api/${path}`, { method, headers: { origin: "https://rent.test", "content-type": "application/json", cookie }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  try {
    expect("GET" in publicRoute).toBe(false);
    expect(publicRoute.runtime).toBe("nodejs");
    const response = await publicRoute.POST(request("rentals", "POST", { name: "Fixture", email: "fixture@example.com", phone: "+84912345678", rentalPlan: "day", vehicleId: "blue", startDate: "2090-01-01", endDate: "2090-01-02", pickup: "hanoi", locale: "en", consent: true }));
    expect(response.status).toBe(201);
    const { id } = await response.json();
    const login = await loginRoute.POST(request("admin/login", "POST", { password: "fixture-only-password" }));
    expect(login.status).toBe(200);
    const cookie = login.headers.get("set-cookie")!;
    expect(await (await sessionRoute.GET(request("admin/session", "GET", undefined, cookie))).json()).toEqual({ authenticated: true });
    expect((await (await listRoute.GET(request("admin/rentals", "GET", undefined, cookie))).json()).rentals).toHaveLength(1);
    expect(await (await updateRoute.PATCH(request(`admin/rentals/${id}`, "PATCH", { status: "contacted" }, cookie), { params: Promise.resolve({ id }) })).json()).toEqual({ ok: true });
    expect(await (await logoutRoute.POST(request("admin/logout", "POST", {}, cookie))).json()).toEqual({ ok: true });
  } finally { closeApi(); rmSync(dir, { recursive: true, force: true }); }
});
