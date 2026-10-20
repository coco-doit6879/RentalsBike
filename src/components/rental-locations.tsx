"use client";
import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Zap,
  Building2,
  Navigation,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "./language";
import { Arrow } from "./primitives";

export function RentalLocations() {
  const { t } = useLanguage();

  const zones = [
    { vi: "Phân khu The Rainbow (S1, S2, S3, S5)", en: "The Rainbow Zone (S1, S2, S3, S5)" },
    { vi: "Phân khu The Origami (S6, S7, S8, S9, S10)", en: "The Origami Zone (S6 - S10)" },
    { vi: "Phân khu The Beverly & Beverly Solari", en: "The Beverly & Beverly Solari" },
    { vi: "Phân khu Glory Heights & Masteri Centre Point", en: "Glory Heights & Masteri Centre Point" },
    { vi: "Biệt thự / Nhà phố The Manhattan & Manhattan Glory", en: "The Manhattan & Manhattan Glory Villas" },
    { vi: "Vincom Mega Mall & Công viên Ánh Sáng 36ha", en: "Vincom Mega Mall & 36ha Grand Park" },
  ];

  const highlights = [
    {
      icon: <Building2 size={24} style={{ color: "#2563eb" }} />,
      titleVi: "Giao xe tận sảnh toà nhà",
      titleEn: "Door-to-Door Lobby Delivery",
      descVi: "Giao nhận hỏa tốc 15–30 phút tại mọi sảnh chung cư và nhà phố trong nội khu Vinhomes Grand Park.",
      descEn: "Fast 15–30 min delivery directly to your building lobby or villa anywhere in Vinhomes Grand Park.",
    },
    {
      icon: <Zap size={24} style={{ color: "#16a34a" }} />,
      titleVi: "Pin đầy 100% & Phụ kiện chu đáo",
      titleEn: "100% Charged & Full Gear",
      descVi: "Xe luôn được sạc đầy pin, vệ sinh sạch sẽ, trang bị sẵn 2 mũ bảo hiểm đạt chuẩn, áo mưa và bộ sạc xe.",
      descEn: "Every scooter is fully charged, cleaned, and supplied with 2 helmets, raincoats, and a smart charger.",
    },
    {
      icon: <ShieldCheck size={24} style={{ color: "#ca8a04" }} />,
      titleVi: "Thủ tục 5 phút — Cọc chỉ 1.000.000đ",
      titleEn: "5-Min Rental — 1M VND Deposit",
      descVi: "Chỉ cần CCCD hoặc Hộ chiếu. Hợp đồng điện tử minh bạch, hoàn trả cọc 100% ngay khi kết thúc hợp đồng.",
      descEn: "Only ID/Passport needed. Transparent digital contract, 100% refundable deposit returned upon handover.",
    },
    {
      icon: <Clock size={24} style={{ color: "#0891b2" }} />,
      titleVi: "Hỗ trợ kỹ thuật 24/7 nội khu",
      titleEn: "24/7 Township Support",
      descVi: "Đội ngũ kỹ thuật túc trực tại Vinhomes Grand Park, hỗ trợ đổi pin, cứu hộ và giải đáp kỹ thuật nhanh chóng.",
      descEn: "On-site team at Vinhomes Grand Park ready to assist with battery swaps, maintenance, and inquiries.",
    },
  ];

  const faqs = [
    {
      qVi: "Tôi không cư trú tại Vinhomes Grand Park có thuê xe được không?",
      qEn: "Can I rent if I do not live inside Vinhomes Grand Park?",
      aVi: "Hoàn toàn được! Bạn có thể hẹn nhận xe tại cổng chào, công viên 36ha, Vincom Mega Mall hoặc bất kỳ vị trí thuận tiện nào tại Vinhomes Grand Park. Vui lòng nhắn tin WhatsApp trước 30 phút để chuẩn bị xe chu đáo.",
      aEn: "Absolutely! You can meet us at the main gate, 36ha Grand Park, Vincom Mega Mall, or any convenient lobby in Vinhomes Grand Park. Please contact us via WhatsApp 30 minutes in advance so we can prepare your scooter.",
    },
    {
      qVi: "Thời gian phục vụ giao nhận xe là mấy giờ?",
      qEn: "What are the operating and pickup hours?",
      aVi: "Thời gian phục vụ giao nhận tiêu chuẩn từ 08:00 đến 21:00 hàng ngày. Đội ngũ hỗ trợ 24/7 khi bạn đặt lịch trước qua WhatsApp hoặc gọi trực tiếp hotline 0797 330 518.",
      aEn: "Standard delivery hours are 08:00 to 21:00 daily. 24/7 service is available for pre-arranged bookings via WhatsApp or hotline +84 797 330 518.",
    },
    {
      qVi: "Tôi đang ở căn hộ dịch vụ / homestay ngắn hạn tại Vinhomes thì nhận xe thế nào?",
      qEn: "How do I receive the scooter if I stay at a short-term homestay?",
      aVi: "Bạn chỉ cần cung cấp tên phân khu và số toà (ví dụ: S1.02 Origami hoặc Beverly). Chúng tôi sẽ chạy xe đến bàn giao tận sảnh toà nhà, hướng dẫn vận hành và ký nhận chỉ trong 5 phút.",
      aEn: "Simply share your building code and lobby (e.g., S1.02 Origami or Beverly). Our staff will bring the scooter directly to your building lobby and guide you through operation within 5 minutes.",
    },
  ];

  return (
    <div className="location-showcase-wrapper">
      {/* Top Status Banner */}
      <aside className="location-status-banner" aria-label="Location status">
        <div className="status-indicator">
          <span className="status-dot-pulse" aria-hidden="true" />
          <span className="status-text">
            {t(
              "TRẠM HOẠT ĐỘNG CHÍNH THỨC • GIAO XE TẬN SẢNH NỘI KHU 15–30 PHÚT",
              "OFFICIAL PICKUP HUB • 15–30 MIN DOOR-TO-DOOR TOWNSHIP DELIVERY",
            )}
          </span>
        </div>
        <p className="status-note">
          {t(
            "MS TAM Rentals phục vụ độc quyền tại Khu đô thị Vinhomes Grand Park, TP. Thủ Đức, TP. Hồ Chí Minh. Miễn phí giao nhận nội khu.",
            "MS TAM Rentals exclusively serves Vinhomes Grand Park, Thu Duc City, Ho Chi Minh City. Free doorstep delivery inside the township.",
          )}
        </p>
      </aside>

      {/* Main Hub Card */}
      <section className="location-hub-card" aria-labelledby="hub-heading">
        <div className="location-hub-header">
          <div className="location-hub-title-group">
            <div className="location-icon-badge" aria-hidden="true">
              <MapPin size={32} />
            </div>
            <div>
              <span className="location-tag">
                <Sparkles size={13} style={{ display: "inline-block", marginRight: "4px" }} />
                {t("Điểm nhận xe chính thức", "Official Pickup Hub")}
              </span>
              <h2 id="hub-heading" className="location-hub-title">
                Vinhomes Grand Park — TP. Hồ Chí Minh
              </h2>
              <address className="location-address">
                <Navigation size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px", color: "#16a34a" }} />
                <span>
                  {t(
                    "Khu đô thị Vinhomes Grand Park, Đường Nguyễn Xiển & Phước Thiện, Phường Long Bình & Phường Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh.",
                    "Vinhomes Grand Park, Nguyen Xien & Phuoc Thien St, Long Binh & Long Thanh My Ward, Thu Duc City, Ho Chi Minh City.",
                  )}
                </span>
              </address>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="location-action-bar">
            <Link className="btn btn-primary location-btn-main" href="/rent?pickup=hcm">
              {t("Đăng ký nhận xe tại đây", "Rent scooter here")}
              <Arrow />
            </Link>
            <a
              className="btn btn-whatsapp location-btn-whatsapp"
              href="https://wa.me/84797330518?text=Xin%20chao%20MS%20TAM%20Rentals,%20toi%20muon%20thue%20xe%20tai%20Vinhomes%20Grand%20Park"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("Chat WhatsApp nhận xe ngay", "Chat on WhatsApp for instant scooter delivery")}
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span>WhatsApp: 0797 330 518</span>
            </a>
            <a
              className="btn btn-outline location-btn-call"
              href="tel:+84797330518"
              aria-label={t("Gọi hotline 0797 330 518", "Call hotline +84 797 330 518")}
            >
              <Phone size={16} aria-hidden="true" />
              <span>{t("Gọi Hotline", "Call hotline")}</span>
            </a>
          </div>
        </div>

        {/* Operating Quick Info Bar */}
        <div className="location-quick-meta">
          <div className="meta-item">
            <Clock size={18} aria-hidden="true" />
            <div>
              <strong>{t("08:00 – 21:00 hàng ngày", "08:00 – 21:00 Daily")}</strong>
              <small>{t("Hỗ trợ 24/7 khi đặt lịch trước", "24/7 support with advance booking")}</small>
            </div>
          </div>
          <div className="meta-item">
            <Building2 size={18} aria-hidden="true" />
            <div>
              <strong>{t("Giao xe tận sảnh miễn phí", "Free lobby delivery")}</strong>
              <small>{t("Tất cả toà căn hộ & nhà phố", "All towers and residential villas")}</small>
            </div>
          </div>
          <div className="meta-item">
            <ShieldCheck size={18} aria-hidden="true" />
            <div>
              <strong>{t("Cọc 1.000.000đ", "1,000,000 VND deposit")}</strong>
              <small>{t("Hoàn tiền ngay khi kết thúc hợp đồng", "Refunded immediately at return")}</small>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights 4-Grid */}
      <section className="location-highlights-section" aria-label="Hub features">
        <div className="section-heading-center">
          <p className="eyebrow">{t("TIỆN ÍCH DỊCH VỤ", "SERVICE ADVANTAGES")}</p>
          <h2>{t("Trải nghiệm nhận xe tinh gọn & nhanh chóng", "Effortless, premium pickup experience")}</h2>
          <p className="muted">
            {t(
              "Chúng tôi mang đến dịch vụ xe điện tiện nghi nhất cho cư dân và du khách lưu trú tại Vinhomes Grand Park.",
              "Delivering an easy, premium electric scooter experience for residents and guests at Vinhomes Grand Park.",
            )}
          </p>
        </div>

        <div className="location-highlights-grid">
          {highlights.map((h, i) => (
            <article key={i} className="highlight-card">
              <div className="highlight-icon-box">{h.icon}</div>
              <h3>{t(h.titleVi, h.titleEn)}</h3>
              <p>{t(h.descVi, h.descEn)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Residential Zones Coverage */}
      <section className="location-zones-section" aria-label="Residential zones served">
        <div className="zones-card">
          <div className="zones-header">
            <div>
              <p className="eyebrow">{t("PHẠM VI PHỤC VỤ HỎA TỐC", "DELIVERY COVERAGE")}</p>
              <h2>{t("Giao xe tận nơi toàn bộ các phân khu", "Fast delivery to all residential zones")}</h2>
              <p className="muted">
                {t(
                  "Chỉ cần cung cấp số toà hoặc vị trí sảnh, nhân viên sẽ giao xe đến đúng nơi bạn cần trong 15–30 phút.",
                  "Simply provide your tower name or lobby location, and our team will bring your scooter right to you in 15–30 mins.",
                )}
              </p>
            </div>
            <a
              className="btn btn-outline btn-map-link"
              href="https://www.google.com/maps/search/?api=1&query=Vinhomes+Grand+Park+Thu+Duc+Ho+Chi+Minh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("Xem vị trí trên Google Maps", "Open location on Google Maps")}
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span>{t("Mở Google Maps", "Open Google Maps")}</span>
            </a>
          </div>

          <div className="zones-grid">
            {zones.map((z, idx) => (
              <div key={idx} className="zone-item">
                <CheckCircle2 size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                <span>{t(z.vi, z.en)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location FAQs */}
      <section className="location-faq-section" aria-label="Frequently asked questions">
        <h2 className="section-title">
          {t("Câu hỏi thường gặp về điểm nhận xe", "Frequently asked questions about pickup")}
        </h2>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={i} className="location-faq-item">
              <summary>{t(f.qVi, f.qEn)}</summary>
              <p>{t(f.aVi, f.aEn)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA Box */}
      <section className="location-bottom-cta">
        <div className="bottom-cta-content">
          <p className="eyebrow">{t("ĐỒNG HÀNH CÙNG BẠN", "READY TO RIDE")}</p>
          <h2>{t("Sẵn sàng khám phá Vinhomes Grand Park cùng xe điện?", "Ready to explore Vinhomes Grand Park on an EV?")}</h2>
          <p className="muted">
            {t(
              "Đặt xe nhanh trực tuyến hoặc liên hệ trực tiếp WhatsApp để chúng tôi phục vụ bạn chu đáo nhất.",
              "Request your rental online or chat directly on WhatsApp for immediate support.",
            )}
          </p>
          <div className="bottom-cta-buttons">
            <Link className="btn btn-primary" href="/rent?pickup=hcm">
              {t("Đăng ký thuê xe ngay", "Request rental now")}
              <Arrow />
            </Link>
            <a
              className="btn btn-whatsapp"
              href="https://wa.me/84797330518?text=Xin%20chao%20MS%20TAM%20Rentals,%20toi%20muon%20thue%20xe%20tai%20Vinhomes%20Grand%20Park"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span>{t("Chat WhatsApp: 0797 330 518", "Chat WhatsApp: 0797 330 518")}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
