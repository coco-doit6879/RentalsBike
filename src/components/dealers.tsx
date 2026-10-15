"use client";

import React, { useState } from "react";
import { dealers } from "@/data/dealers";

export function MapPanel() {
  const [selectedId, setSelectedId] = useState(dealers[0].id);
  const selected =
    dealers.find((dealer) => dealer.id === selectedId) ?? dealers[0];

  return (
    <aside className="map-panel" aria-label="Sơ đồ showroom minh họa">
      <p className="eyebrow">Sơ đồ minh họa</p>
      <h3>Chọn điểm trải nghiệm</h3>
      <p className="muted">
        Đây là bản đồ placeholder, không phải tọa độ thực và không dùng để chỉ
        đường. TODO: xác minh địa chỉ trước khi đi.
      </p>
      <svg
        viewBox="0 0 400 160"
        width="100%"
        height="160"
        aria-hidden="true"
        focusable="false"
        fill="none"
      >
        <path
          d="M0 40H400M0 120H400M80 0V160M210 0V160M330 0V160"
          stroke="currentColor"
          strokeOpacity=".15"
          strokeWidth="12"
        />
        <path
          d="M80 120H210V40H330"
          stroke="currentColor"
          strokeOpacity=".4"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <circle cx="210" cy="80" r="13" stroke="currentColor" strokeWidth="2" />
        <circle cx="210" cy="80" r="4" fill="currentColor" />
      </svg>
      <div className="field">
        <label htmlFor="map-dealer">Địa điểm trên sơ đồ</label>
        <select
          id="map-dealer"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          {dealers.map((dealer) => (
            <option key={dealer.id} value={dealer.id}>
              {dealer.name}
            </option>
          ))}
        </select>
      </div>
      <p>{selected.address}</p>
      <a
        className="btn btn-outline"
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.address)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Tìm địa chỉ minh họa trên Google Maps
      </a>
      <a className="btn btn-primary" href={`/test-drive?dealer=${selected.id}`}>
        Đặt lịch tại địa điểm đã chọn
      </a>
    </aside>
  );
}

function searchable(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function DealerSearch() {
  const [province, setProvince] = useState("");
  const [query, setQuery] = useState("");
  const matches = dealers.filter(
    (dealer) =>
      (!province || dealer.province === province) &&
      searchable(`${dealer.name} ${dealer.address}`).includes(
        searchable(query.trim()),
      ),
  );

  return (
    <div>
      <p className="notice">
        Danh sách demo, không phải mạng lưới đại lý chính thức. TODO: xác minh
        showroom, địa chỉ và giờ mở cửa trước khi sử dụng thực tế.
      </p>
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="dealer-province">Tỉnh / thành phố</label>
          <select
            id="dealer-province"
            value={province}
            onChange={(event) => setProvince(event.target.value)}
          >
            <option value="">Tất cả tỉnh / thành phố</option>
            {[...new Set(dealers.map((dealer) => dealer.province))].map(
              (city) => (
                <option key={city}>{city}</option>
              ),
            )}
          </select>
        </div>
        <div className="field">
          <label htmlFor="dealer-query">Tìm showroom</label>
          <input
            id="dealer-query"
            type="search"
            placeholder="Tên showroom hoặc khu vực"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <p className="muted" role="status">
        {matches.length} showroom minh họa
      </p>
      <div className="dealer-layout">
        {matches.length ? (
          matches.map((dealer) => (
            <article className="dealer-card" key={dealer.id}>
              <p className="eyebrow">{dealer.province}</p>
              <h3>{dealer.name}</h3>
              <p>{dealer.address}</p>
              <p className="muted">{dealer.hours}</p>
              <a
                className="btn btn-primary"
                href={`/test-drive?dealer=${dealer.id}`}
              >
                Đặt lịch tại đây
              </a>
            </article>
          ))
        ) : (
          <p className="empty-state">Không tìm thấy showroom phù hợp.</p>
        )}
      </div>
    </div>
  );
}
