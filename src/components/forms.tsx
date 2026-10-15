"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dealers } from "@/data/dealers";
import { vehicles } from "@/data/catalog";
import {
  createBookingSchema,
  mockSubmitBooking,
  servicePackages,
  tomorrowDate,
  type BookingValues,
} from "@/lib/forms";

export function TestDriveForm({ service = false }: { service?: boolean }) {
  const [success, setSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(createBookingSchema(service)),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      variant: "",
      dealer: "",
      consent: false,
      date: "",
      servicePackage: "",
    },
  });
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const dealerId = query.get("dealer");
    const colorId = query.get("color");
    if (vehicles.some((v) => v.id === colorId)) {
      setSelectedColor(colorId!);
      setValue("variant", "evo-lite");
    }
    const selected = dealers.find((dealer) => dealer.id === dealerId);
    if (selected) {
      setValue("dealer", selected.id);
      setValue("city", selected.province);
    }
  }, [setValue]);

  const field = (key: keyof BookingValues) => ({
    id: `booking-${key}`,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `booking-${key}-error` : undefined,
  });
  const error = (key: keyof BookingValues) =>
    errors[key] ? (
      <p id={`booking-${key}-error`} className="error" role="alert">
        {errors[key]?.message}
      </p>
    ) : null;

  async function submit() {
    setSuccess(false);
    setSubmissionError(false);
    try {
      await mockSubmitBooking(simulateError);
      reset();
      setSelectedColor("");
      setSuccess(true);
    } catch {
      setSubmissionError(true);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      aria-busy={isSubmitting}
      aria-label={service ? "Đăng ký dịch vụ demo" : "Đăng ký lái thử demo"}
    >
      <p className="notice">
        Bản demo độc lập, không phải website chính thức. Chỉ mô phỏng trên thiết
        bị: không gửi dữ liệu qua mạng, không lưu thông tin cá nhân. Vui lòng
        dùng dữ liệu giả. TODO: xác minh các lựa chọn và showroom trước khi
        triển khai.
      </p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="booking-name">Họ và tên</label>
          <input
            {...field("name")}
            {...register("name")}
            autoComplete="off"
            maxLength={100}
          />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="booking-phone">Số điện thoại</label>
          <input
            {...field("phone")}
            {...register("phone")}
            type="tel"
            autoComplete="off"
          />
          {error("phone")}
        </div>
        <div className="field">
          <label htmlFor="booking-email">Email</label>
          <input
            {...field("email")}
            {...register("email")}
            type="email"
            autoComplete="off"
          />
          {error("email")}
        </div>
        <div className="field">
          <label htmlFor="booking-city">Tỉnh / thành phố</label>
          <select {...field("city")} {...register("city")}>
            <option value="">Chọn tỉnh / thành phố</option>
            {[...new Set(dealers.map((dealer) => dealer.province))].map(
              (city) => (
                <option key={city}>{city}</option>
              ),
            )}
          </select>
          {error("city")}
        </div>
        <div className="field">
          <label htmlFor="booking-variant">Phiên bản</label>
          <select {...field("variant")} {...register("variant")}>
            <option value="">Chọn phiên bản</option>
            <option value="evo-lite">Evo Lite — minh họa</option>
          </select>
          {error("variant")}
        </div>
        <div className="field">
          <label htmlFor="booking-color">Màu quan tâm</label>
          <select
            id="booking-color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">Chưa quyết định</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.color} — mẫu
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="booking-dealer">Showroom</label>
          <select {...field("dealer")} {...register("dealer")}>
            <option value="">Chọn showroom</option>
            {dealers.map((dealer) => (
              <option key={dealer.id} value={dealer.id}>
                {dealer.name}
              </option>
            ))}
          </select>
          {error("dealer")}
        </div>
        {service && (
          <>
            <div className="field">
              <label htmlFor="booking-date">Ngày hẹn dự kiến</label>
              <input
                {...field("date")}
                {...register("date")}
                type="date"
                min={tomorrowDate()}
              />
              {error("date")}
            </div>
            <div className="field">
              <label htmlFor="booking-servicePackage">Gói dịch vụ</label>
              <select
                {...field("servicePackage")}
                {...register("servicePackage")}
              >
                <option value="">Chọn gói dịch vụ</option>
                {servicePackages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {error("servicePackage")}
            </div>
          </>
        )}
        <div className="field field-full">
          <label htmlFor="booking-consent">
            <input
              {...field("consent")}
              {...register("consent")}
              type="checkbox"
            />{" "}
            Tôi đồng ý sử dụng thông tin giả cho bản demo này.
          </label>
          <a href="/privacy" className="consent-privacy">
            Đã đọc chính sách bảo mật demo
          </a>
          {error("consent")}
        </div>
      </div>
      <div className="field field-full">
        <label>
          <input
            type="checkbox"
            checked={simulateError}
            disabled={isSubmitting}
            onChange={(event) => setSimulateError(event.target.checked)}
          />{" "}
          Mô phỏng lỗi gửi (chỉ demo)
        </label>
      </div>
      {submissionError && (
        <p className="error" role="alert">
          Lỗi mô phỏng. Không có dữ liệu nào được gửi. Vui lòng thử lại.
        </p>
      )}
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang mô phỏng…" : "Gửi đăng ký demo"}
      </button>
      {success && (
        <p className="success" role="status">
          Mô phỏng thành công. Chưa có lịch hẹn thực tế nào được tạo.
        </p>
      )}
    </form>
  );
}
