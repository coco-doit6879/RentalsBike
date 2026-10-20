// Source: user-supplied Vietnamese and English rental posters, confirmed by user.
// Verify effective dates and applicability with operator before public launch.
export const rentalPlans = [
  { id: "day", vi: "3 ngày", en: "3 days", price: 400000 },
  { id: "week", vi: "1 tuần", en: "1 week", price: 700000 },
  { id: "month", vi: "1 tháng", en: "1 month", price: 2200000 },
  { id: "quarter", vi: "3 tháng", en: "3 months", price: 5700000 },
  { id: "half-year", vi: "6 tháng", en: "6 months", price: 10000000 },
  { id: "year", vi: "1 năm", en: "1 year", price: 16000000 },
] as const;
export type RentalPlanId = (typeof rentalPlans)[number]["id"];
export const rentalPolicy = {
  deposit: 1000000,
  lateFirstHour: 100000,
  lateAdditionalHour: 50000,
};
export function formatRentalPrice(amount: number, locale: "vi" | "en") {
  return (
    new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(amount) +
    " ₫"
  );
}
