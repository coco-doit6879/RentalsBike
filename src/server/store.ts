import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync, chmodSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type RentalStatus = "new" | "contacted" | "confirmed" | "cancelled";
export interface RentalInput {
  name: string; email: string; phone: string; vehicleId: string; rentalPlan: string;
  startDate: string; endDate: string; pickup: string; note?: string; locale: string;
}
export interface RentalRecord extends RentalInput { id: string; status: RentalStatus; createdAt: string }

export class RentalStore {
  readonly db: DatabaseSync;
  constructor(path: string) {
    const fullPath = resolve(path);
    mkdirSync(dirname(fullPath), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(fullPath);
    try { chmodSync(fullPath, 0o600); } catch { /* Windows ACLs are configured by the operator. */ }
    this.db.exec(`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS rentals (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
        vehicleId TEXT NOT NULL, startDate TEXT NOT NULL, endDate TEXT NOT NULL,
        pickup TEXT NOT NULL, note TEXT NOT NULL, locale TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('new','contacted','confirmed','cancelled')),
        createdAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS rentals_created ON rentals(createdAt DESC);
      CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expiresAt INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (tokenHash TEXT PRIMARY KEY, expiresAt INTEGER NOT NULL, passwordKey TEXT NOT NULL);`);
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const columns = this.db.prepare("PRAGMA table_info(rentals)").all();
      if (!columns.some((column) => column.name === "rentalPlan")) {
        this.db.exec("ALTER TABLE rentals ADD COLUMN rentalPlan TEXT NOT NULL DEFAULT 'day' CHECK(rentalPlan IN ('day','week','month','quarter','half-year','year'))");
      }
      this.db.exec("COMMIT");
    } catch (error) { this.db.exec("ROLLBACK"); this.db.close(); throw error; }
  }
  createRental(input: RentalInput): { id: string; status: "new" } {
    const id = randomUUID();
    this.db.prepare(`INSERT INTO rentals (id, name, email, phone, vehicleId, startDate, endDate, pickup, note, locale, status, createdAt, rentalPlan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`)
      .run(id, input.name, input.email, input.phone, input.vehicleId, input.startDate, input.endDate,
        input.pickup, input.note ?? "", input.locale, new Date().toISOString(), input.rentalPlan);
    return { id, status: "new" };
  }
  listRentals(q = "", status = ""): RentalRecord[] {
    const escaped = q.replace(/[\\%_]/g, "\\$&");
    return this.db.prepare(`SELECT * FROM rentals WHERE (? = '' OR status = ?)
      AND (? = '' OR name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\')
      ORDER BY createdAt DESC, rowid DESC LIMIT 200`)
      .all(status, status, q, `%${escaped}%`, `%${escaped}%`, `%${escaped}%`) as unknown as RentalRecord[];
  }
  updateStatus(id: string, status: RentalStatus): boolean {
    return this.db.prepare("UPDATE rentals SET status = ? WHERE id = ?").run(status, id).changes > 0;
  }
  consumeLimit(key: string, max: number, windowMs: number, now: number): boolean {
    this.db.prepare("DELETE FROM rate_limits WHERE expiresAt <= ?").run(now);
    const result = this.db.prepare(`INSERT INTO rate_limits (key, count, expiresAt) VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < ? RETURNING count`)
      .get(key, now + windowMs, max);
    return result !== undefined;
  }
  close() { this.db.close(); }
}
