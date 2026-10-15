import { z } from "zod";
import { vehicles } from "@/data/catalog";
import { fleet } from "@/data/fleet";

// Error keys stay language-neutral so existing errors update immediately on locale changes.
const date = z
  .string()
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value,
    "date",
  );
export function rentalToday(){return new Date(Date.now()+7*60*60*1000).toISOString().slice(0,10);}
export const rentalSchema = z
  .object({
    name: z.string().trim().min(2, "name").max(100, "name"),
    email: z.string().trim().email("email").max(254, "email"),
    phone: z
      .string()
      .trim()
      .refine(
        (value) =>
          /^[+\d\s().-]+$/.test(value) &&
          /^\+[1-9]\d{6,14}$/.test(value.replace(/[\s().-]/g, "")),
        "phone",
      ),
    vehicleId: z
      .string()
      .refine(
        (value) => fleet.some((v) => v.id === value) || vehicles.some((v) => v.id === value),
        "vehicle",
      ),
    rentalPlan: z.enum(
      ["day", "week", "month", "quarter", "half-year", "year"],
      { error: "rentalPlan" },
    ),
    pickup: z.enum(["hcm", "hanoi", "danang"], { error: "pickup" }),
    startDate: date.refine(value=>value>=rentalToday(),"pastDate"),
    endDate: date,
    note: z.string().max(1000, "note").optional(),
    locale: z.enum(["vi", "en"], { error: "locale" }),
    consent: z.boolean().refine((value) => value, "consent"),
    website: z.string().max(200, "website").optional(),
  })
  .refine((value) => value.endDate > value.startDate, {
    path: ["endDate"],
    message: "dateOrder",
  });
export type RentalInput = z.infer<typeof rentalSchema>;
