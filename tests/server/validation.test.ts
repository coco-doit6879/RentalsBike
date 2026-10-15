// @vitest-environment node
import { describe, expect, it } from "vitest";
import { rentalSchema, vietnamToday } from "../../src/server/validation";
const valid = { name: "Rider", email: "r@example.com", phone: "+84912345678", rentalPlan: "day", vehicleId: "ivory", startDate: "2030-01-02", endDate: "2030-01-03", pickup: "hcm", locale: "vi", consent: true };
const schema = rentalSchema(new Date("2030-01-01T17:00:00Z"));
describe("server validation", () => {
  it("uses Vietnam midnight and accepts start today", () => {
    expect(vietnamToday(new Date("2030-01-01T17:00:00Z"))).toBe("2030-01-02");
    expect(schema.safeParse(valid).success).toBe(true);
  });
  it.each([
    { startDate: "2030-01-01" }, { startDate: "2030-02-30" }, { startDate: "2030-2-03" },
    { endDate: "2030-01-02" }, { endDate: "2030-01-01" }, { phone: "123456" },
    { phone: "+1234567890123456" }, { phone: "++12345678" }, { phone: "<script>" },
    { consent: false }, { website: "bot" }, { locale: "fr" }, { vehicleId: "evil" }, { pickup: "evil" },
    { name: "a".repeat(121) }, { note: "a".repeat(2001) }, { email: "bad" }, { extra: "no" },
  ])("rejects invalid input %j", (invalid) => expect(schema.safeParse({ ...valid, ...invalid }).success).toBe(false));
  it("requires a whitelisted rental plan", () => {
    const { rentalPlan: _plan, ...missing } = valid;
    expect(schema.safeParse(missing).success).toBe(false);
    expect(schema.safeParse({ ...valid, rentalPlan: "evil" }).success).toBe(false);
    for (const rentalPlan of ["day", "week", "month", "quarter", "half-year", "year"]) expect(schema.safeParse({ ...valid, rentalPlan }).success).toBe(true);
  });
  it("accepts leap days and text without executing it", () => {
    expect(schema.safeParse({ ...valid, startDate: "2032-02-29", endDate: "2032-03-01", note: "<script>alert(1)</script>" }).success).toBe(true);
  });
});
