import { z } from "zod";

export function vietnamToday(now = new Date()): string {
  const shifted = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "Invalid calendar date");
export function rentalSchema(now = new Date()) {
  return z.object({
    name: z.string().trim().min(1).max(120),
    email: z.email().max(254),
    phone: z.string().trim().max(40).regex(/^[+\d\s().-]+$/).transform(value=>value.replace(/[\s().-]/g,"" )).pipe(z.string().regex(/^\+?\d{7,15}$/)),
    vehicleId: z.enum(["pink", "white", "ivory", "graphite", "blue"]),
    rentalPlan: z.enum(["day", "week", "month", "quarter", "half-year", "year"]),
    startDate: date.refine((value) => value >= vietnamToday(now), "Start date must be today or later"),
    endDate: date,
    pickup: z.enum(["hcm", "hanoi", "danang"]),
    note: z.string().max(2000).optional(),
    locale: z.enum(["vi", "en"]),
    consent: z.literal(true),
    website: z.string().max(0).optional(),
  }).strict().refine((value) => value.endDate > value.startDate, {
    path: ["endDate"], message: "End date must be after start date",
  });
}
export const statusSchema = z.object({ status: z.enum(["new", "contacted", "confirmed", "cancelled"]) }).strict();
export const loginSchema = z.object({ password: z.string().min(1).max(1024) }).strict();
