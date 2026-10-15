"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Bike,
  CalendarDays,
  MapPin,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Leaf,
} from "lucide-react";
import { useLanguage } from "./language";
import { ImageSlot, SectionHeading, Arrow, Reveal } from "./primitives";
import { RentalCatalog } from "./rental-catalog";
import { RentalPricing } from "./rental-pricing";
import { ScooterVideo } from "./scooter-video";
import { rentalSteps } from "@/data/rental-content";
const slides = [
  {
    vi: "Evo Grand Lite.",
    en: "Evo Grand Lite.",
    subVi: "Hồng phấn thanh lịch.",
    subEn: "Blush pink elegance.",
    descVi:
      "Phiên bản hồng phấn thuộc đội xe 2 chiếc Evo Grand Lite của chúng tôi. Thiết kế thanh thoát, vận hành êm ái cho mọi hành trình.",
    descEn:
      "The blush pink edition from our 2-scooter Evo Grand Lite fleet. Refined design and smooth electric performance for every journey.",
    image: "/images/scooter-pink-real.svg",
    colorVi: "Hồng phấn",
    colorEn: "Blush pink",
    hex: "#dca3ad",
  },
  {
    vi: "Evo Grand Lite.",
    en: "Evo Grand Lite.",
    subVi: "Trắng ngọc tinh tế.",
    subEn: "Pearl white elegance.",
    descVi:
      "Phiên bản trắng ngọc thanh lịch trong đội xe. Tối giản, hiện đại, sẵn sàng cho những chuyến khám phá thành phố của bạn.",
    descEn:
      "The pearl white edition in our fleet. Minimalist, modern, and ready for your city exploration.",
    image: "/images/scooter-white-real.svg",
    colorVi: "Trắng ngọc",
    colorEn: "Pearl white",
    hex: "#eae6dc",
  },
  {
    vi: "Đội xe thực tế.",
    en: "Actual fleet.",
    subVi: "Ảnh & video trên phố.",
    subEn: "Real photos & video.",
    descVi:
      "Đội xe gồm 2 chiếc Evo Grand Lite màu hồng và trắng ngọc. Khám phá ảnh chụp thực tế và video trước khi gửi yêu cầu thuê.",
    descEn:
      "Our fleet features 2 Evo Grand Lite scooters in blush pink and pearl white. Explore actual photos and walkaround video before booking.",
    image: "/media/evo-grand-lite/pink-front-34.webp",
    colorVi: "Ảnh thực tế TP.HCM",
    colorEn: "Actual photo HCMC",
    hex: "#dca3ad",
  },
];
export function RentalHome() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const s = slides[index];
  return (
    <>
      <section
        className="hero"
        aria-roledescription="carousel"
        aria-label={t("Khám phá xe cho thuê", "Explore rental scooters")}
      >
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="hero-copy" aria-live="polite">
          <p className="eyebrow">
            <span className="live-dot" />
            {t(
              "THUÊ XE ĐIỆN. KHÁM PHÁ TỰ DO.",
              "ELECTRIC RENTALS. EVERYDAY FREEDOM.",
            )}
          </p>
          <p className="hero-model">VinFast Evo Grand Lite / Rentals</p>
          <h1>
            {t(s.vi, s.en)}
            <br />
            <span>{t(s.subVi, s.subEn)}</span>
          </h1>
          <p className="hero-description">{t(s.descVi, s.descEn)}</p>
          <div className="hero-ctas">
            <Link className="btn btn-light" href="/models">
              {t("Khám phá xe cho thuê", "Explore rental scooters")}
              <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-ghost" href="/rent">
              {t("Đăng ký thuê xe", "Request a rental")}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-watermark" aria-hidden="true">
            EVO
          </span>
          <div className="hero-product" key={s.image}>
            <ImageSlot
              src={s.image}
              alt={t(
                `Ảnh concept xe điện ${s.colorVi}, không phải xe thực tế`,
                `Electric scooter concept in ${s.colorEn}, not an actual product photograph`,
              )}
              priority
              caption={false}
            />
          </div>
          <div className="hero-color">
            <span style={{ background: s.hex }} />
            {t(s.colorVi, s.colorEn)}
            <span className="color-line" />
          </div>
          <p className="hero-image-note">
            {index === 2 ? t("ẢNH CHỤP THỰC TẾ TẠI TP.HCM", "ACTUAL PHOTO IN HCMC") : t("STUDIO THIẾT KẾ CHI TIẾT", "DETAILED STUDIO RENDERING")}
          </p>
        </div>
        <div className="hero-bottom">
          <div className="hero-pagination">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Banner ${i + 1}`}
                aria-pressed={index === i}
                className={index === i ? "active" : ""}
                onClick={() => setIndex(i)}
              >
                <span>0{i + 1}</span>
                <i />
              </button>
            ))}
          </div>
          <p className="hero-caption">
            {t(
              "Hành trình của bạn. Lựa chọn của bạn.",
              "Your journey. Your choice.",
            )}
          </p>
          <div className="hero-arrows">
            <button
              aria-label={t("Banner trước", "Previous banner")}
              onClick={() => setIndex((index + 2) % 3)}
            >
              <ChevronLeft size={19} />
            </button>
            <button
              aria-label={t("Banner tiếp theo", "Next banner")}
              onClick={() => setIndex((index + 1) % 3)}
            >
              <ChevronRight size={19} />
            </button>
          </div>
          <a href="#rental-collection" className="scroll-hint">
            {t("CUỘN ĐỂ KHÁM PHÁ", "SCROLL TO DISCOVER")}
            <span>↓</span>
          </a>
        </div>
      </section>
      <nav
        className="quick-actions container rental-quick"
        aria-label={t("Thao tác nhanh", "Quick actions")}
      >
        {[
          {
            vi: "Xe cho thuê",
            en: "Rental scooters",
            href: "/models",
            icon: Bike,
          },
          {
            vi: "Đăng ký thuê xe",
            en: "Request a rental",
            href: "/rent",
            icon: CalendarDays,
          },
          {
            vi: "Điểm nhận xe",
            en: "Pickup locations",
            href: "/locations",
            icon: MapPin,
          },
          {
            vi: "Hướng dẫn thuê",
            en: "How it works",
            href: "/how-it-works",
            icon: MessageCircle,
          },
        ].map((a) => (
          <Link href={a.href} key={a.href}>
            <a.icon size={23} strokeWidth={1.35} />
            <span>{t(a.vi, a.en)}</span>
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </nav>
      <section className="section collection" id="rental-collection">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow={t("BỘ SƯU TẬP XE CHO THUÊ", "THE RENTAL COLLECTION")}
              title={t(
                "Một chiếc xe tinh gọn.\nVô vàn điều để khám phá.",
                "One considered ride.\nEndless possibilities.",
              )}
              description={t(
                "Giá thuê từ 150.000đ/ngày. Chọn sắc màu và thời gian thuê; tình trạng xe cần được xác nhận.",
                "Rentals from 150,000 VND/day. Pick a colour and your preferred dates; availability is subject to confirmation.",
              )}
            />
          </Reveal>
          <RentalCatalog />
        </div>
      </section>
      <section className="section bg-soft">
        <div className="container">
          <RentalPricing />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ScooterVideo />
        </div>
      </section>
      <section className="technology">
        <div className="technology-visual">
          <ImageSlot
            src="/images/detail.svg"
            alt={t("Chi tiết xe concept", "Scooter detail concept")}
          />
          <span className="image-index">01 / MADE FOR THE CITY</span>
        </div>
        <div className="technology-copy">
          <p className="eyebrow">
            {t("ĐỒNG HÀNH CÙNG BẠN", "DESIGNED AROUND YOUR JOURNEY")}
          </p>
          <h2 className="section-title">
            {t(
              "Thuê xe đơn giản.\nTrải nghiệm trọn vẹn.",
              "Simple rentals.\nMeaningful journeys.",
            )}
          </h2>
          <p className="muted">
            {t(
              "Không cần mua xe để bắt đầu khám phá. Gửi yêu cầu và cùng trao đổi phương án thuê phù hợp.",
              "You do not need to own a scooter to explore. Send an enquiry and discuss the rental that works for you.",
            )}
          </p>
          {[
            {
              icon: Globe,
              vi: "Tiếng Việt & English",
              en: "Vietnamese & English",
              textVi: "Thông tin và đăng ký bằng ngôn ngữ bạn thấy thoải mái.",
              textEn: "Browse and enquire in the language you feel at home in.",
            },
            {
              icon: ShieldCheck,
              vi: "Rõ ràng trước khi xác nhận",
              en: "Clarity before confirmation",
              textVi: "Giá, xe và điều kiện được thống nhất trước khi nhận xe.",
              textEn:
                "Rates, scooter availability and terms are agreed before pickup.",
            },
          ].map((f) => (
            <div className="tech-feature" key={f.en}>
              <f.icon size={23} />
              <div>
                <h3>{t(f.vi, f.en)}</h3>
                <p>{t(f.textVi, f.textEn)}</p>
              </div>
            </div>
          ))}
          <Link className="btn btn-light" href="/how-it-works">
            {t("Tìm hiểu cách thuê", "How rental works")}
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow={t(
              "BA BƯỚC CHO HÀNH TRÌNH MỚI",
              "THREE STEPS TO YOUR NEXT JOURNEY",
            )}
            title={t(
              "Chọn xe. Gửi yêu cầu. Lên đường.",
              "Choose. Enquire. Explore.",
            )}
          />
          <div className="editorial-grid">
            {rentalSteps.map((step, i) => (
              <article className="feature-item" key={step.en}>
                <span>0{i + 1}</span>
                <h3>{t(step.vi, step.en)}</h3>
                <p>{t(step.textVi, step.textEn)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="lifestyle">
        <ImageSlot
          src="/images/city.svg"
          alt={t(
            "Kiến trúc thành phố minh họa",
            "City architecture illustration",
          )}
          caption={false}
        />
        <div className="container lifestyle-copy">
          <p className="eyebrow">
            {t(
              "THÀNH PHỐ CỦA BẠN. NHỊP ĐIỆU CỦA BẠN.",
              "YOUR CITY. YOUR OWN RHYTHM.",
            )}
          </p>
          <h2>
            {t(
              "Mỗi con phố.\nMột cảm hứng mới.",
              "Every street.\nA new perspective.",
            )}
          </h2>
          <Link className="btn btn-light" href="/rent">
            {t("Đăng ký thuê xe", "Request a rental")}
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="home-bottom-cta section">
        <div className="container">
          <p className="eyebrow">
            {t(
              "SẴN SÀNG CHO HÀNH TRÌNH CỦA BẠN",
              "READY FOR YOUR NEXT CHAPTER",
            )}
          </p>
          <h2 className="section-title">
            {t(
              "Bạn chọn hành trình.\nChúng tôi tiếp nhận yêu cầu.",
              "You choose the journey.\nWe take care of the enquiry.",
            )}
          </h2>
          <div className="hero-ctas">
            <Link className="btn btn-primary" href="/rent">
              {t("Đăng ký thuê xe", "Request a rental")}
              <Arrow />
            </Link>
            <Link className="btn btn-outline" href="/locations">
              {t("Điểm nhận xe", "Pickup locations")}
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
