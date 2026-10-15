"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Navigation,
  CalendarDays,
  MapPin,
  Headphones,
  Bike,
  Zap,
  BatteryCharging,
  MoveUpRight,
} from "lucide-react";
import { heroSlides, vehicles } from "@/data/catalog";
import { ImageSlot, Reveal, SectionHeading, Arrow } from "./primitives";
import { VehicleCard } from "./vehicle-card";
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index];
  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Khám phá Evo Lite"
    >
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="hero-copy" aria-live="polite">
        <p className="eyebrow">
          <span className="live-dot" />
          {slide.kicker}
        </p>
        <p className="hero-model">VinFast Evo Lite</p>
        <h1>
          {slide.title}
          <br />
          <span>{slide.subtitle}</span>
        </h1>
        <p className="hero-description">{slide.description}</p>
        <div className="hero-ctas">
          <Link className="btn btn-light" href="/models/evo-lite">
            Khám phá mẫu xe <ArrowRight size={17} />
          </Link>
          <Link className="btn btn-ghost" href="/test-drive">
            Đăng ký lái thử <MoveUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="hero-visual">
        <span className="hero-watermark" aria-hidden="true">
          EVO
        </span>
        <div className="hero-product" key={slide.image}>
          <ImageSlot
            src={slide.image}
            alt={`Concept xe điện ${slide.color}. Minh họa không phải sản phẩm VinFast thực tế.`}
            priority
            caption={false}
          />
        </div>
        <div className="hero-color">
          <span
            style={{
              background: vehicles[index === 1 ? 2 : index === 2 ? 1 : 0].hex,
            }}
          />
          {slide.color}
          <span className="color-line" />
        </div>
        <p className="hero-image-note">HÌNH ẢNH CONCEPT MINH HỌA</p>
      </div>
      <div className="hero-bottom">
        <div className="hero-pagination">
          {heroSlides.map((s, i) => (
            <button
              key={s.label}
              aria-label={`Banner ${i + 1}: ${s.label}`}
              aria-pressed={index === i}
              className={index === i ? "active" : ""}
              onClick={() => setIndex(i)}
            >
              <span>0{i + 1}</span>
              <i />
            </button>
          ))}
        </div>
        <p className="hero-caption">{slide.label}</p>
        <div className="hero-arrows">
          <button
            aria-label="Banner trước"
            onClick={() => setIndex((index + 2) % 3)}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            aria-label="Banner tiếp theo"
            onClick={() => setIndex((index + 1) % 3)}
          >
            <ChevronRight size={19} />
          </button>
        </div>
        <a href="#collection" className="scroll-hint">
          CUỘN ĐỂ KHÁM PHÁ <span>↓</span>
        </a>
      </div>
    </section>
  );
}
export function QuickActions() {
  const actions = [
    { icon: Bike, title: "Đăng ký lái thử", href: "/test-drive" },
    { icon: Navigation, title: "Tìm xe có sẵn", href: "/inventory" },
    { icon: CalendarDays, title: "Đặt lịch dịch vụ", href: "/service" },
    { icon: MapPin, title: "Tìm đại lý", href: "/dealers" },
    {
      icon: Headphones,
      title: "Liên hệ tư vấn",
      href: "/test-drive#registration",
    },
  ];
  return (
    <nav className="quick-actions container" aria-label="Thao tác nhanh">
      {actions.map((a) => (
        <Link href={a.href} key={a.title}>
          <a.icon size={23} strokeWidth={1.35} />
          <span>{a.title}</span>
          <ArrowUpRight size={16} className="action-arrow" />
        </Link>
      ))}
    </nav>
  );
}
export function Home() {
  return (
    <>
      <HeroCarousel />
      <QuickActions />
      <section className="section collection" id="collection">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="BỘ SƯU TẬP EVO LITE"
              title="Tối giản trong thiết kế.
Khác biệt trong từng hành trình."
              description="Chọn sắc màu dành cho bạn. Cùng một tinh thần, những dấu ấn riêng."
            >
              <Link className="text-link" href="/models">
                Tất cả phiên bản <Arrow />
              </Link>
            </SectionHeading>
          </Reveal>
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <Reveal key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
              </Reveal>
            ))}
          </div>
          <p className="data-note">
            Thông số mang tính tham khảo. Phiên bản, giá và tình trạng xe là dữ
            liệu mẫu, cần xác minh theo nguồn chính thức.
          </p>
        </div>
      </section>
      <section className="technology" id="technology">
        <div className="technology-visual">
          <ImageSlot
            src="/images/detail.svg"
            alt="Minh họa concept chi tiết thân xe và công nghệ"
          />
          <span className="image-index">01 / ENGINEERED FOR EVERYDAY</span>
        </div>
        <div className="technology-copy">
          <Reveal>
            <p className="eyebrow">TINH TẾ ĐẾN TỪ BÊN TRONG</p>
            <h2 className="section-title">
              Công nghệ tạo nên
              <br />
              <span>khác biệt.</span>
            </h2>
            <p className="muted">
              Vận hành êm ái. Thiết kế trực quan. Mỗi chi tiết được đặt trong
              một trải nghiệm di chuyển đơn giản hơn.
            </p>
            <div className="tech-feature">
              <Zap size={23} strokeWidth={1.3} />
              <div>
                <h3>Chuyển động thuần điện</h3>
                <p>Khám phá ý tưởng động cơ điện cho nhịp sống đô thị.</p>
              </div>
            </div>
            <div className="tech-feature">
              <BatteryCharging size={23} strokeWidth={1.3} />
              <div>
                <h3>Năng lượng cho ngày dài</h3>
                <p>Tìm hiểu pin, sạc và cách chăm sóc xe mỗi ngày.</p>
              </div>
            </div>
            <Link className="btn btn-light" href="/models/evo-lite#technology">
              Khám phá công nghệ <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="section electric-section">
        <div className="container">
          <div className="electric-heading">
            <p className="eyebrow">MỘT LỰA CHỌN MỚI CHO ĐÔ THỊ</p>
            <h2 className="section-title">
              Bước vào kỷ nguyên
              <br />
              di chuyển mới.
            </h2>
            <p className="muted">
              Ít tiếng ồn hơn. Nhiều cảm hứng hơn.
              <br />
              Hành trình thay đổi bắt đầu từ lựa chọn hôm nay.
            </p>
          </div>
          <div className="large-stats">
            <div>
              <strong>
                {vehicles[0].range}
                <span> km</span>
              </strong>
              <p>
                Quãng đường mỗi lần sạc<small>Số liệu mẫu · CẦN XÁC MINH</small>
              </p>
            </div>
            <div>
              <strong>
                {vehicles[0].charge}
                <span> giờ</span>
              </strong>
              <p>
                Thời gian sạc đầy<small>Số liệu mẫu · CẦN XÁC MINH</small>
              </p>
            </div>
            <div>
              <strong>
                0<span> g</span>
              </strong>
              <p>
                Khí thải tại ống xả khi vận hành
                <small>Không đại diện phát thải toàn vòng đời</small>
              </p>
            </div>
          </div>
          <p className="data-note">
            Thông số mang tính tham khảo. Điều kiện sử dụng, tải trọng và môi
            trường có thể làm thay đổi quãng đường thực tế.
          </p>
        </div>
      </section>
      <section className="lifestyle">
        <ImageSlot
          src="/images/city.svg"
          alt="Minh họa kiến trúc đô thị tối giản"
          caption={false}
        />
        <div className="container lifestyle-copy">
          <p className="eyebrow">THÀNH PHỐ CỦA BẠN. NHỊP ĐIỆU CỦA BẠN.</p>
          <h2>
            Mỗi con phố.
            <br />
            Một cảm hứng mới.
          </h2>
          <Link className="btn btn-light" href="/test-drive">
            Cảm nhận cùng Evo Lite <Arrow />
          </Link>
        </div>
      </section>
      <section className="home-bottom-cta section">
        <div className="container">
          <p className="eyebrow">HÀNH TRÌNH BẮT ĐẦU TỪ ĐÂY</p>
          <h2 className="section-title">
            Đừng chỉ ngắm nhìn.
            <br />
            Hãy tự mình trải nghiệm.
          </h2>
          <div className="hero-ctas">
            <Link className="btn btn-primary" href="/test-drive">
              Đăng ký lái thử <Arrow />
            </Link>
            <Link className="btn btn-outline" href="/dealers">
              Tìm showroom <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
