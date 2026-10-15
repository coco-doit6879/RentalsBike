"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rentalToday, rentalSchema, type RentalInput } from "@/lib/rental-validation";
import { vehicles } from "@/data/catalog";
import { fleet } from "@/data/fleet";
import { rentalPlans, formatRentalPrice } from "@/data/rental-pricing";
import { useLanguage } from "@/components/language";
import { rentalColor } from "@/components/rental-catalog";

export function RentalForm() {
  const { t, locale } = useLanguage();
  const [reference, setReference] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RentalInput>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      vehicleId: "",
      pickup: undefined,
      rentalPlan: undefined,
      startDate: "",
      endDate: "",
      note: "",
      locale,
      consent: false,
      website: "",
    },
  });
  React.useEffect(() => {
    setValue("locale", locale);
  }, [locale, setValue]);
  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const plan = query.get("plan");
    if (rentalPlans.some((p) => p.id === plan))
      setValue("rentalPlan", plan as RentalInput["rentalPlan"]);
    const pickup = query.get("pickup");
    if (pickup === "hcm" || pickup === "hanoi" || pickup === "danang")
      setValue("pickup", pickup);
    const vehicle = query.get("vehicle");
    if (fleet.some((item) => item.id === vehicle) || vehicles.some((item) => item.id === vehicle))
      setValue("vehicleId", vehicle!);
  }, [setValue]);
  const errorText = (key?: string) => {
    switch (key) {
      case "name":
        return t(
          "Nhập họ tên từ 2 đến 100 ký tự.",
          "Enter a name between 2 and 100 characters.",
        );
      case "email":
        return t("Nhập địa chỉ email hợp lệ.", "Enter a valid email address.");
      case "phone":
        return t(
          "Nhập số điện thoại quốc tế hợp lệ có mã quốc gia (ví dụ +84).",
          "Enter a valid international phone number with a country code (for example +44).",
        );
      case "vehicle":
        return t("Chọn mẫu xe.", "Choose a vehicle.");
      case "rentalPlan":
        return t("Chọn gói thuê.", "Choose a rental package.");
      case "pickup":
        return t("Chọn thành phố nhận xe.", "Choose a pickup city.");
      case "date":
        return t("Chọn ngày hợp lệ.", "Choose a valid date.");
      case "pastDate":
        return t("Ngày nhận phải từ hôm nay theo giờ Việt Nam.","Start date must be today or later in Vietnam time.");
      case "dateOrder":
        return t(
          "Ngày trả xe phải sau ngày bắt đầu.",
          "Return date must be after the start date.",
        );
      case "note":
        return t(
          "Ghi chú không quá 1.000 ký tự.",
          "Keep your note within 1,000 characters.",
        );
      case "consent":
        return t(
          "Bạn cần đồng ý với chính sách quyền riêng tư để gửi yêu cầu.",
          "Agree to the privacy policy to send your enquiry.",
        );
      default:
        return t(
          "Vui lòng kiểm tra thông tin này.",
          "Please check this field.",
        );
    }
  };
  const fieldError = (name: keyof RentalInput) =>
    errors[name] && (
      <span id={`rental-${name}-error`} className="field-error" role="alert">
        {errorText(errors[name]?.message)}
      </span>
    );
  const fieldProps = (name: keyof RentalInput) => ({
    id: `rental-${name}`,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `rental-${name}-error` : undefined,
  });
  const submit = async (values: RentalInput) => {
    setFailed(false);
    try {
      const response = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      if (response.status !== 201) throw new Error("Request failed");
      const result: unknown = await response.json();
      if (
        !result ||
        typeof result !== "object" ||
        !("id" in result) ||
        typeof result.id !== "string" ||
        !result.id ||
        !("status" in result) ||
        typeof result.status !== "string"
      )
        throw new Error("Invalid response");
      setReference(result.id);
    } catch {
      setFailed(true);
    }
  };
  if (reference)
    return (
      <section className="form-success" role="status">
        <h2>
          {t("Đã lưu yêu cầu thuê xe", "Your rental enquiry has been saved")}
        </h2>
        <p>
          {t("Mã yêu cầu", "Enquiry reference")}: <strong>{reference}</strong>
        </p>
        <p>
          {t(
            "Đây chưa phải xác nhận đặt xe. Chúng tôi sẽ xem xét yêu cầu và liên hệ về tình trạng xe, báo giá và bước tiếp theo.",
            "This is not a confirmed booking. We will review your enquiry and contact you about availability, a quote and next steps.",
          )}
        </p>
      </section>
    );
  return (
    <form
      className="booking-form rental-form"
      noValidate
      onSubmit={handleSubmit(submit)}
      aria-busy={isSubmitting}
      aria-label={t("Đăng ký thuê xe", "Rental enquiry")}
    >
      <p className="muted">
        {t(
          "Gửi yêu cầu để được tư vấn và báo giá. Chỉ xác nhận gửi thành công sau khi yêu cầu được lưu; đây chưa phải đặt xe.",
          "Send an enquiry for advice and a quote. A successful submission means your enquiry was saved, not that a booking is confirmed.",
        )}
      </p>
      <fieldset disabled={isSubmitting} className="form-fields">
        <legend>
          {t("Thông tin yêu cầu thuê xe", "Rental enquiry details")}
        </legend>
        <label htmlFor="rental-name">
          {t("Họ và tên", "Full name")}
          <input
            {...fieldProps("name")}
            {...register("name")}
            autoComplete="name"
            maxLength={100}
            required
          />
          {fieldError("name")}
        </label>
        <label htmlFor="rental-email">
          {t("Email", "Email")}
          <input
            {...fieldProps("email")}
            {...register("email")}
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
          {fieldError("email")}
        </label>
        <label htmlFor="rental-phone">
          {t("Điện thoại (kèm mã quốc gia)", "Phone (with country code)")}
          <input
            {...fieldProps("phone")}
            {...register("phone")}
            type="tel"
            autoComplete="tel"
            required
          />
          {fieldError("phone")}
        </label>
        <label htmlFor="rental-vehicleId">
          {t("Mẫu xe", "Vehicle")}
          <select
            {...fieldProps("vehicleId")}
            {...register("vehicleId")}
            required
          >
            <option value="">{t("Chọn mẫu xe", "Choose a vehicle")}</option>
            {fleet.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} · {t(vehicle.colorVi, vehicle.colorEn)}
              </option>
            ))}
          </select>
          {fieldError("vehicleId")}
        </label>
        <label htmlFor="rental-rentalPlan">
          {t("Gói thuê", "Rental package")}
          <select
            {...fieldProps("rentalPlan")}
            {...register("rentalPlan")}
            required
          >
            <option value="">{t("Chọn gói thuê", "Choose a package")}</option>
            {rentalPlans.map((p) => (
              <option value={p.id} key={p.id}>
                {t(p.vi, p.en)} — {formatRentalPrice(p.price, locale)}
              </option>
            ))}
          </select>
          {fieldError("rentalPlan")}
        </label>
        <label htmlFor="rental-pickup">
          {t("Thành phố nhận xe", "Pickup city")}
          <select {...fieldProps("pickup")} {...register("pickup")} required>
            <option value="">{t("Chọn thành phố", "Choose a city")}</option>
            <option value="hcm">
              {t("TP. Hồ Chí Minh", "Ho Chi Minh City")}
            </option>
            <option value="hanoi">{t("Hà Nội", "Hanoi")}</option>
            <option value="danang">{t("Đà Nẵng", "Da Nang")}</option>
          </select>
          {fieldError("pickup")}
        </label>
        <label htmlFor="rental-startDate">
          {t("Ngày bắt đầu", "Start date")}
          <input
            {...fieldProps("startDate")}
            {...register("startDate")}
            type="date"
            required
          />
          {fieldError("startDate")}
        </label>
        <label htmlFor="rental-endDate">
          {t("Ngày trả xe", "Return date")}
          <input
            {...fieldProps("endDate")}
            {...register("endDate")}
            type="date"
            required
          />
          {fieldError("endDate")}
        </label>
        <label htmlFor="rental-note">
          {t(
            "Ghi chú (không bắt buộc, tối đa 1.000 ký tự)",
            "Note (optional, up to 1,000 characters)",
          )}
          <textarea
            {...fieldProps("note")}
            {...register("note")}
            maxLength={1000}
            rows={4}
          />
          {fieldError("note")}
        </label>
        <div className="consent-row">
          <label htmlFor="rental-consent">
            <input
              {...fieldProps("consent")}
              {...register("consent")}
              type="checkbox"
              required
            />
            {t(
              "Tôi đồng ý xử lý thông tin để phản hồi yêu cầu theo chính sách quyền riêng tư.",
              "I agree to the processing of my details to respond to this enquiry under the privacy policy.",
            )}
          </label>{" "}
          <Link href="/privacy">
            {t("Chính sách quyền riêng tư", "Privacy policy")}
          </Link>
          {fieldError("consent")}
        </div>
        <div hidden aria-hidden="true">
          <label htmlFor="rental-website">
            {t("Trang web", "Website")}
            <input
              id="rental-website"
              {...register("website")}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
      </fieldset>
      {failed && (
        <p role="alert">
          {t(
            "Chưa thể lưu yêu cầu. Vui lòng thử lại; nếu lỗi tiếp tục, liên hệ với chúng tôi.",
            "Your enquiry could not be saved. Please retry; if the problem continues, contact us.",
          )}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting
          ? t("Đang gửi…", "Sending…")
          : failed
            ? t("Thử gửi lại", "Retry enquiry")
            : t("Gửi yêu cầu", "Send enquiry")}
      </button>
    </form>
  );
}
