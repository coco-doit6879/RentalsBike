"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "./language";
import { Arrow } from "./primitives";
import {
  rentalPlans,
  rentalPolicy,
  formatRentalPrice,
} from "@/data/rental-pricing";
export function RentalPricing() {
  const { t, locale } = useLanguage();
  const money = (n: number) => formatRentalPrice(n, locale);
  return (
    <section className="rental-pricing">
      <p className="eyebrow">{t("BẢNG GIÁ THUÊ XE", "RENTAL RATES")}</p>
      <h2 className="section-title">
        {t(
          "Một hành trình. Nhiều lựa chọn.",
          "Your journey. Your choice of duration.",
        )}
      </h2>
      <p className="muted">
        {t(
          "Giá theo gói thuê.",
          "Rates are per rental package. ",
        )}
      </p>
      <div className="pricing-grid">
        {rentalPlans.map((p, i) => (
          <article key={p.id} className="pricing-card">
            <span className="eyebrow">
              0{i + 1} / {t("GÓI THUÊ", "RENTAL PACKAGE")}
            </span>
            <h3>{t(p.vi, p.en)}</h3>
            <strong>{money(p.price)}</strong>
            <p>
              {t(
                "Giá trọn gói thuê, không phải giá mỗi ngày.",
                "Price per rental package, not a daily rate.",
              )}
            </p>
            <Link
              className="btn btn-outline"
              href={`/rent?plan=${p.id}`}
              aria-label={t(`Chọn gói ${p.vi}`, `Choose ${p.en}`)}
            >
              {t("Chọn gói thuê", "Choose this package")}
              <Arrow />
            </Link>
          </article>
        ))}
      </div>
      <div className="pricing-policy">
        <section>
          <h3>{t("Tiền đặt cọc", "Security deposit")}</h3>
          <strong>{money(rentalPolicy.deposit)}</strong>
          <p>
            {t(
              "Hoàn lại khi kết thúc hợp đồng theo thông tin trên bảng giá. Điều kiện khấu trừ và hoàn tiền cần được thống nhất trong hợp đồng.",
              "Refundable at the end of the contract according to the supplied rate sheet. Deductions and refund conditions must be agreed in the rental contract.",
            )}
          </p>
        </section>
        <section>
          <h3>{t("Phí trả xe trễ", "Late return fees")}</h3>
          <p>
            {t("Giờ đầu tiên: ", "First hour: ")}
            <strong>{money(rentalPolicy.lateFirstHour)}</strong>
          </p>
          <p>
            {t("Mỗi giờ tiếp theo: ", "Each additional hour: ")}
            <strong>{money(rentalPolicy.lateAdditionalHour)}</strong>
          </p>
        </section>
      </div>
      <p className="data-note">
        {t(
          "Nguồn: bảng giá do đơn vị cung cấp qua ảnh. Chưa tự động tính tổng cho ngày lẻ, thuế, giao xe hay gia hạn. Gửi yêu cầu không đồng nghĩa đã giữ xe.",
          "Source: the rate sheets supplied by the operator. Partial periods, taxes, delivery and extensions are not automatically calculated. An enquiry does not reserve a scooter.",
        )}
      </p>
    </section>
  );
}
