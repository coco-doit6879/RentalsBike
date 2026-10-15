// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { RentalStore } from "../../src/server/store";
import { DatabaseSync } from "node:sqlite";

const directories: string[] = [];
afterEach(() => { for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true }); });
const input = { name: "<script>alert('x')</script>", email: "rider@example.com", phone: "+84912345678", rentalPlan: "day", vehicleId: "ivory", startDate: "2030-01-02", endDate: "2030-01-03", pickup: "hcm", note: "'; DROP TABLE rentals;--", locale: "vi" };

describe("SQLite rental storage", () => {
  it("migrates existing rows to the day plan and migration is repeatable", () => {
    const dir = mkdtempSync(join(process.env.TMPDIR!, "rentals-migrate-")); directories.push(dir);
    const path = join(dir, "rentals.sqlite");
    const original = new DatabaseSync(path);
    original.exec(`CREATE TABLE rentals (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
      vehicleId TEXT NOT NULL, startDate TEXT NOT NULL, endDate TEXT NOT NULL, pickup TEXT NOT NULL,
      note TEXT NOT NULL, locale TEXT NOT NULL, status TEXT NOT NULL, createdAt TEXT NOT NULL);
      INSERT INTO rentals VALUES ('old','Old','old@example.com','1234567','ivory','2030-01-01','2030-01-02','hcm','','vi','new','2030-01-01T00:00:00Z');`);
    original.close();
    const first = new RentalStore(path);
    try { expect(first.listRentals()[0]).toHaveProperty("rentalPlan", "day"); } finally { first.close(); }
    const second = new RentalStore(path);
    try {
      const created = second.createRental({ ...input, rentalPlan: "half-year" });
      expect(second.listRentals().find((row) => row.id === created.id)).toHaveProperty("rentalPlan", "half-year");
    } finally { second.close(); }
  });
  it("persists real submissions after closing and reopening without interpreting text", () => {
    const dir = mkdtempSync(join(process.env.TMPDIR!, "rentals-store-")); directories.push(dir);
    const path = join(dir, "rentals.sqlite");
    const first = new RentalStore(path);
    const created = first.createRental(input);
    expect(created.id).toMatch(/^[\da-f-]{36}$/);
    expect(created.status).toBe("new");
    first.close();
    const second = new RentalStore(path);
    try {
      expect(second.listRentals()).toEqual([expect.objectContaining({ ...input, ...created, createdAt: expect.any(String) })]);
    } finally { second.close(); }
  });
});
