"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowRight, Check } from "lucide-react";
import { vehicles, priceFormat } from "@/data/catalog";
import { VehicleCard } from "./vehicle-card";
import { ImageSlot } from "./primitives";
export function VehicleGrid({ inventory = false }: { inventory?: boolean }) {
  const [color, setColor] = useState("all");
  const [edition, setEdition] = useState("all");
  const [budget, setBudget] = useState("all");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const list = vehicles.filter(
    (v) =>
      (color === "all" || v.id === color) &&
      (edition === "all" || v.edition === edition) &&
      (budget === "all" ||
        (budget === "under" ? v.price < 20000000 : v.price >= 20000000)) &&
      (city === "all" || v.city === city) &&
      `${v.name} ${v.edition} ${v.color} ${v.city}`
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  const reset = () => {
    setColor("all");
    setEdition("all");
    setBudget("all");
    setQuery("");
    setCity("all");
  };
  return (
    <div>
      <div className="filter-bar">
        <SlidersHorizontal size={20} aria-hidden="true" />
        <label>
          Phiên bản
          <select value={edition} onChange={(e) => setEdition(e.target.value)}>
            <option value="all">Tất cả phiên bản</option>
            <option>Urban</option>
            <option>Signature</option>
          </select>
        </label>
        <label>
          Màu sắc
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="all">Tất cả màu sắc</option>
            {vehicles.map((v) => (
              <option value={v.id} key={v.id}>
                {v.color}
              </option>
            ))}
          </select>
        </label>
        <label>
          Mức giá
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="all">Tất cả mức giá</option>
            <option value="under">Dưới 20 triệu</option>
            <option value="over">Từ 20 triệu</option>
          </select>
        </label>
        {inventory && (
          <label>
            Tỉnh / thành phố
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="all">Tất cả khu vực</option>
              {vehicles.map((v) => (
                <option key={v.id}>{v.city}</option>
              ))}
            </select>
          </label>
        )}
        <label className="search-field">
          <span>Tìm kiếm xe</span>
          <div>
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tên xe, màu sắc…"
            />
          </div>
        </label>
      </div>
      <div className="result-meta">
        <p role="status">
          {list.length} phiên bản {inventory && "có sẵn (mẫu)"}
        </p>
        <button className="text-button" onClick={reset}>
          Xóa bộ lọc
        </button>
      </div>
      {list.length ? (
        <div className="vehicle-grid">
          {list.map((v) => (
            <VehicleCard key={v.id} vehicle={v} inventory={inventory} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} />
          <h2>Chưa tìm thấy phiên bản phù hợp.</h2>
          <p>Thử thay đổi màu sắc, mức giá hoặc từ khóa tìm kiếm.</p>
        </div>
      )}
      <p className="data-note">
        Thông số mang tính tham khảo. Tất cả giá, phiên bản và tồn kho đều là dữ
        liệu mẫu · CẦN XÁC MINH.
      </p>
    </div>
  );
}
export function ModelDetail() {
  const [color, setColor] = useState(vehicles[0]);
  const [view, setView] = useState("side");
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("color");
    const match = vehicles.find((v) => v.id === id);
    if (match) setColor(match);
  }, []);
  return (
    <>
      <section className="model-detail container">
        <div className="model-gallery">
          <ImageSlot
            src={view === "side" ? color.image : "/images/detail.svg"}
            alt={
              view === "side"
                ? `Concept Evo Lite màu ${color.color}, không phải hình sản phẩm thực tế`
                : "Ảnh minh họa chi tiết concept"
            }
            priority
          />
          <div className="gallery-tabs">
            <button
              aria-pressed={view === "side"}
              onClick={() => setView("side")}
            >
              01 · Tổng thể
            </button>
            <button
              aria-pressed={view === "detail"}
              onClick={() => setView("detail")}
            >
              02 · Chi tiết
            </button>
          </div>
        </div>
        <div className="model-copy">
          <p className="eyebrow">THUẦN ĐIỆN. THUẦN PHONG CÁCH.</p>
          <h1>
            VinFast
            <br />
            <span>Evo Lite.</span>
          </h1>
          <p className="muted">
            Thiết kế tinh gọn dành cho những hành trình rộng mở. Khám phá phiên
            bản {color.edition} và lựa chọn sắc màu của riêng bạn.
          </p>
          <p className="color-label">
            Màu minh họa: <strong>{color.color}</strong>
          </p>
          <div className="color-picker">
            {vehicles.map((v) => (
              <button
                key={v.id}
                aria-label={v.color}
                aria-pressed={color.id === v.id}
                style={{ backgroundColor: v.hex }}
                onClick={() => setColor(v)}
              >
                {color.id === v.id && (
                  <Check
                    size={17}
                    style={{ color: v.id === "ivory" ? "#222" : "#fff" }}
                  />
                )}
              </button>
            ))}
          </div>
          <p className="model-price-label">GIÁ THAM KHẢO · CẦN XÁC MINH</p>
          <p className="model-price">{priceFormat(color.price)}</p>
          <Link
            className="btn btn-primary"
            href={`/test-drive?color=${color.id}`}
          >
            Lái thử sắc màu này <ArrowRight size={18} />
          </Link>
          <p className="data-note">
            Thông số mang tính tham khảo. Giá, tên phiên bản và hình ảnh đều là
            mẫu.
          </p>
        </div>
      </section>
      <section className="section bg-soft" id="technology">
        <div className="container">
          <p className="eyebrow">TRẢI NGHIỆM CỐT LÕI</p>
          <h2 className="section-title">Gọn nhẹ. Trực quan. Thuần điện.</h2>
          <div className="editorial-grid">
            {[
              {
                n: "01",
                title: "Thiết kế đô thị",
                text: "Tỷ lệ gọn gàng, ngôn ngữ thiết kế tối giản. Hình ảnh concept không mô tả chính xác mẫu xe thương mại.",
              },
              {
                n: "02",
                title: "Pin và hệ thống sạc",
                text: "Tìm hiểu cách sạc và chăm sóc pin. Loại pin, công suất và thời gian sạc cần kiểm chứng bằng tài liệu chính thức.",
              },
              {
                n: "03",
                title: "An toàn & kết nối",
                text: "Màn hình kỹ thuật số, kết nối thông minh và tiện ích là nhóm nội dung minh họa. Chưa xác nhận được trang bị thực tế.",
              },
            ].map((f) => (
              <article key={f.n} className="feature-item">
                <span>{f.n}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
          <h2 className="section-title specs-title">Thông số tham khảo.</h2>
          <dl className="spec-table">
            <div>
              <dt>Phiên bản (mẫu)</dt>
              <dd>{color.edition}</dd>
            </div>
            <div>
              <dt>Quãng đường mỗi lần sạc (mẫu)</dt>
              <dd>{color.range} km</dd>
            </div>
            <div>
              <dt>Tốc độ tối đa (mẫu)</dt>
              <dd>{color.speed} km/h</dd>
            </div>
            <div>
              <dt>Thời gian sạc đầy (mẫu)</dt>
              <dd>{color.charge} giờ</dd>
            </div>
            <div>
              <dt>Loại pin / công suất / tái tạo phanh</dt>
              <dd>Chưa xác minh</dd>
            </div>
          </dl>
          <p className="data-note">
            TODO: CẦN XÁC MINH theo nguồn chính thức. Không sử dụng thông số
            demo để tư vấn mua bán.
          </p>
        </div>
      </section>
    </>
  );
}
