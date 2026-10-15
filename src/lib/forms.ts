import { z } from "zod";
import { dealers } from "@/data/dealers";

export const servicePackages = [
  { id: "maintenance", name: "Bảo dưỡng định kỳ — demo" },
  { id: "inspection", name: "Kiểm tra tổng quát — demo" },
];

export function tomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function futureDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getTime() > today.getTime() &&
    date.getFullYear() === Number(value.slice(0, 4)) &&
    date.getMonth() + 1 === Number(value.slice(5, 7)) &&
    date.getDate() === Number(value.slice(8, 10))
  );
}

export function createBookingSchema(service = false) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Vui lòng nhập họ tên (ít nhất 2 ký tự).")
        .max(100, "Họ tên không quá 100 ký tự."),
      phone: z
        .string()
        .trim()
        .refine(
          (value) =>
            /^(?:0|\+84)[35789]\d{8}$/.test(value.replace(/[\s.-]/g, "")),
          "Vui lòng nhập số di động Việt Nam hợp lệ.",
        ),
      email: z.string().trim().email("Vui lòng nhập email hợp lệ."),
      city: z
        .string()
        .refine(
          (value) => dealers.some((dealer) => dealer.province === value),
          "Vui lòng chọn tỉnh / thành phố.",
        ),
      variant: z
        .string()
        .refine(
          (value): boolean => value === "evo-lite",
          "Vui lòng chọn phiên bản.",
        ),
      dealer: z
        .string()
        .refine(
          (value) => dealers.some((dealer) => dealer.id === value),
          "Vui lòng chọn showroom.",
        ),
      consent: z
        .boolean()
        .refine(Boolean, "Vui lòng đồng ý để tiếp tục bản demo."),
      date: z.string().optional(),
      servicePackage: z.string().optional(),
    })
    .superRefine((values, context) => {
      const selected = dealers.find((dealer) => dealer.id === values.dealer);
      if (selected && values.city !== selected.province)
        context.addIssue({
          code: "custom",
          path: ["dealer"],
          message: "Vui lòng chọn showroom thuộc tỉnh / thành phố đã chọn.",
        });
      if (service && !futureDate(values.date ?? ""))
        context.addIssue({
          code: "custom",
          path: ["date"],
          message: "Vui lòng chọn ngày hợp lệ trong tương lai.",
        });
      if (
        service &&
        !servicePackages.some((item) => item.id === values.servicePackage)
      )
        context.addIssue({
          code: "custom",
          path: ["servicePackage"],
          message: "Vui lòng chọn gói dịch vụ.",
        });
    });
}

// Local-only delay. No personal data is passed to this simulator.
export async function mockSubmitBooking(simulateError = false) {
  await new Promise<void>((resolve) => setTimeout(resolve, 650));
  if (simulateError) throw new Error("Local demo failure");
}

export type BookingValues = z.infer<ReturnType<typeof createBookingSchema>>;
