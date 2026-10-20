"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "./language";
import {
  rentalRoutes,
  rentalSteps,
  rentalFaqs,
  rentalPrivacy,
  pickupLocations,
} from "@/data/rental-content";
import { RentalCatalog } from "./rental-catalog";
import { RentalPricing } from "./rental-pricing";
import { RentalForm } from "./rental-form";
import { ImageSlot, Arrow } from "./primitives";
export function RentalPage({ section }: { section: string }) {
  const { t } = useLanguage();
  const info = rentalRoutes[section];
  return (
    <div className="page-wrapper">
      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link href="/">{t("Trang chủ", "Home")}</Link>
        <ChevronRight size={11} />
        <span aria-current="page">{t(info.vi, info.en)}</span>
      </nav>
      <div className="page-intro">
        <div className="container">
          <p className="eyebrow">EVO LITE / RENTALS</p>
          <h1>{t(info.vi, info.en)}</h1>
          <p className="muted">{t(info.descriptionVi, info.descriptionEn)}</p>
        </div>
      </div>
      <div className="container inner-content">
        {section === "pricing" && <RentalPricing />}
        {section === "models" && <RentalCatalog />}
        {section === "rent" && (
          <div className="form-layout">
            <aside className="form-aside">
              <p className="eyebrow">
                {t("ĐĂNG KÝ THÔNG TIN THUÊ XE", "YOUR RENTAL ENQUIRY")}
              </p>
              <h2>
                {t(
                  "Bạn chọn ngày. Chúng tôi tư vấn.",
                  "Your dates. Our advice.",
                )}
              </h2>
              <p className="muted">
                {t(
                  "Yêu cầu được lưu trong hệ thống để quản trị viên xem và xử lý. Không phải xác nhận giữ xe.",
                  "Your enquiry is saved for the administrator to review. It does not reserve a scooter.",
                )}
              </p>
              <ImageSlot
                alt={t(
                  "Minh họa xe điện concept",
                  "Electric scooter concept illustration",
                )}
              />
              <ol>
                {rentalSteps.map((s) => (
                  <li key={s.en}>{t(s.vi, s.en)}</li>
                ))}
              </ol>
            </aside>
            <RentalForm />
          </div>
        )}
        {section === "how-it-works" && (
          <>
            <div className="editorial-grid">
              {rentalSteps.map((s, i) => (
                <article className="feature-item" key={s.en}>
                  <span>0{i + 1}</span>
                  <h2>{t(s.vi, s.en)}</h2>
                  <p>{t(s.textVi, s.textEn)}</p>
                </article>
              ))}
            </div>
            <section className="faq">
              <h2 className="section-title">
                {t("Những điều bạn muốn biết.", "Good to know.")}
              </h2>
              {rentalFaqs.map((f) => (
                <details key={f.en}>
                  <summary>{t(f.vi, f.en)}</summary>
                  <p>{t(f.textVi, f.textEn)}</p>
                </details>
              ))}
            </section>
            <Link className="btn btn-primary" href="/rent">
              {t("Đăng ký thuê xe", "Request a rental")}
              <Arrow />
            </Link>
          </>
        )}
        {section === "locations" && (
          <>
            <p className="notice">
              {t(
                "Các khu vực dưới đây là lựa chọn minh họa. Điểm nhận, giờ hoạt động và khả năng giao xe chưa được xác minh. Không có bản đồ hoặc địa chỉ thực tế.",
                "The areas below are sample preferences. Pickup points, opening hours and delivery options have not been verified. No actual map or street addresses are provided.",
              )}
            </p>
            <div className="package-grid">
              {pickupLocations.map((l, i) => (
                <article className="package-card" key={l.id}>
                  <MapPin size={24} aria-hidden="true" />
                  <h2>{t(l.vi, l.en)}</h2>
                  <p>
                    {t(
                      "Địa chỉ nhận xe sẽ được tư vấn sau khi xác nhận khu vực phục vụ.",
                      "Pickup details will be provided once the service area has been confirmed.",
                    )}
                  </p>
                  <Link
                    className="btn btn-outline"
                    href={`/rent?pickup=${l.id}`}
                  >
                    {t("Yêu cầu nhận xe tại đây", "Enquire about pickup here")}
                    <Arrow />
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
        {section === "about" && (
          <>
            <div className="about-split">
              <div>
                <p className="eyebrow">
                  {t(
                    "CHO NHỮNG HÀNH TRÌNH CỦA RIÊNG BẠN",
                    "FOR JOURNEYS THAT ARE YOUR OWN",
                  )}
                </p>
                <h2>
                  {t(
                    "Tự do di chuyển. Tự do khám phá.",
                    "Freedom to move. Freedom to explore.",
                  )}
                </h2>
                <p>
                  {t(
                    "Chúng tôi xây dựng trải nghiệm tìm xe và gửi yêu cầu thuê đơn giản, rõ ràng cho khách hàng Việt Nam và quốc tế. Đây là website cho thuê độc lập, không phải trang chính thức của VinFast.",
                    "We are building a straightforward way for Vietnamese and international visitors to find a scooter and send a rental enquiry. This is an independent rental website, not an official VinFast website.",
                  )}
                </p>
                <p className="notice">
                  {t(
                    "Thông tin pháp nhân và địa chỉ liên hệ cần được đơn vị vận hành hoàn thiện trước khi ra mắt công khai.",
                    "The operator must complete legal entity and contact information before public launch.",
                  )}
                </p>
              </div>
              <ImageSlot
                src="/images/showroom.svg"
                alt={t(
                  "Không gian nhận xe concept minh họa",
                  "Illustrative pickup space concept",
                )}
              />
            </div>
            <div className="hero-ctas">
              <Link className="btn btn-primary" href="/models">
                {t("Khám phá xe cho thuê", "Explore rental scooters")}
                <Arrow />
              </Link>
            </div>
          </>
        )}
        {section === "privacy" && (
          <article className="legal-content">
            {rentalPrivacy.map((p, i) => (
              <section key={p.en}>
                <h2>
                  0{i + 1}. {t(p.vi, p.en)}
                </h2>
                <p>{t(p.textVi, p.textEn)}</p>
              </section>
            ))}
          </article>
        )}
        {section === "terms" && (
          <article className="legal-content">
            <section>
              <h2>
                {t(
                  "01. Yêu cầu, không phải hợp đồng",
                  "01. An enquiry, not a contract",
                )}
              </h2>
              <p>
                {t(
                  "Form dùng để tiếp nhận nhu cầu thuê. Gửi form không xác lập hợp đồng, giữ xe, đặt cọc hoặc thanh toán. Đơn vị cho thuê cần xác nhận riêng bằng thỏa thuận phù hợp.",
                  "The form collects rental enquiries. Submission does not create a contract, reservation, deposit or payment. A separate agreement with the rental operator is required.",
                )}
              </p>
            </section>
            <section>
              <h2>{t("02. Giá và điều kiện", "02. Rates and conditions")}</h2>
              <p>
                {t(
                  "Giá thuê được công bố tại trang Bảng giá: từ 400.000đ/3 ngày, cọc 1.000.000đ, phí trễ 100.000đ giờ đầu và 50.000đ mỗi giờ tiếp theo. Điều kiện hoàn cọc, giấy tờ, quyền điều khiển xe, bảo hiểm và trách nhiệm thiệt hại cần được thống nhất trước khi nhận xe.",
                  "Published rental packages start at 400,000 VND/3 days, with a 1,000,000 VND deposit and late fees of 100,000 VND for the first hour and 50,000 VND per additional hour. Deposit refund conditions, documents, riding eligibility, insurance and damage responsibilities must be agreed before pickup.",
                )}
              </p>
            </section>
            <section>
              <h2>{t("03. Dữ liệu tham khảo", "03. Reference information")}</h2>
              <p>
                {t(
                  "Ảnh xe là concept tự tạo; màu, thông số và điểm nhận còn là minh họa. Không dùng để khẳng định tính năng xe hoặc tình trạng cho thuê thực tế.",
                  "Scooter artwork is an original concept; colours, specifications and pickup areas are illustrative. They do not verify actual vehicle features or rental availability.",
                )}
              </p>
            </section>
            <Link className="text-link" href="/privacy">
              {t("Chính sách bảo mật", "Privacy policy")}
              <Arrow />
            </Link>
          </article>
        )}
      </div>
    </div>
  );
}
export function RentalNotFound() {
  const { t } = useLanguage();
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>
        {t("Lạc một nhịp. Tìm lại hành trình.", "A wrong turn. A fresh start.")}
      </h1>
      <p>{t("Trang này không tồn tại.", "This page could not be found.")}</p>
      <Link className="btn btn-primary" href="/">
        {t("Về trang chủ", "Back to home")}
        <Arrow />
      </Link>
    </section>
  );
}
export function RentalLoading() {
  const { t } = useLanguage();
  return (
    <div className="container" role="status">
      <div className="loading-grid" aria-hidden="true">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
      {t("Đang tải nội dung…", "Loading…")}
    </div>
  );
}
