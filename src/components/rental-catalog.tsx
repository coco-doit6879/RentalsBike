"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera } from "lucide-react";
import { fleet, pinkPhotos, whitePhotos, type FleetVehicle } from "@/data/fleet";
import { useLanguage } from "@/components/language";
import { ImageSlot, Arrow } from "@/components/primitives";
import { ScooterVideo } from "./scooter-video";

type Translate = (vi: string, en: string) => string;

export function rentalColor(id: string, t: Translate) {
  const match = fleet.find((v) => v.id === id);
  if (match) return t(match.colorVi, match.colorEn);
  if (id === "pink") return t("Hồng phấn", "Blush pink");
  if (id === "white") return t("Trắng ngọc", "Pearl white");
  return t("Phiên bản cũ", "Previous variant");
}

export function VehicleVisual({
  vehicle,
  priority = false,
}: {
  vehicle: FleetVehicle;
  priority?: boolean;
}) {
  const { t } = useLanguage();

  if (vehicle.image) {
    const altText = t(
      `Ảnh thực tế xe ${vehicle.name}, ${rentalColor(vehicle.id, t)}`,
      `Actual photo of ${vehicle.name}, ${rentalColor(vehicle.id, t)}`,
    );
    return (
      <ImageSlot
        className="fleet-photo"
        src={vehicle.image}
        alt={altText}
        caption={false}
        priority={priority}
      />
    );
  }

  return (
    <div
      className="vehicle-placeholder"
      role="img"
      aria-label={t(
        "Ảnh xe trắng sẽ cập nhật",
        "White scooter photo coming soon",
      )}
    >
      <Camera size={36} aria-hidden="true" className="placeholder-icon" />
      <span className="placeholder-text">
        {t("Ảnh xe trắng sẽ cập nhật", "White scooter photo coming soon")}
      </span>
    </div>
  );
}

export function RentalCatalog() {
  const { t } = useLanguage();
  const [search, setSearch] = React.useState("");
  const [color, setColor] = React.useState("");

  const filtered = fleet.filter((vehicle) => {
    const matchesColor = !color || vehicle.id === color;
    const colorLabel = rentalColor(vehicle.id, t);
    const searchable = `${vehicle.name} ${colorLabel}`.toLowerCase();
    const matchesSearch = searchable.includes(search.trim().toLowerCase());
    return matchesColor && matchesSearch;
  });

  return (
    <section>
      <div className="filter-bar">
        <label htmlFor="rental-search">
          {t("Tìm kiếm xe", "Search vehicles")}
          <input
            id="rental-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label htmlFor="rental-color">
          {t("Màu sắc", "Color")}
          <select
            id="rental-color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          >
            <option value="">{t("Tất cả màu", "All colors")}</option>
            {fleet.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {rentalColor(vehicle.id, t)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setColor("");
          }}
        >
          {t("Xóa bộ lọc", "Clear filters")}
        </button>
      </div>

      {!filtered.length && (
        <p role="status">
          {t("Chưa tìm thấy phiên bản phù hợp.", "No matching variants found.")}
        </p>
      )}

      <div className="fleet-grid">
        {filtered.map((vehicle) => (
          <article className="vehicle-card" key={vehicle.id}>
            <VehicleVisual vehicle={vehicle} />
            <div className="vehicle-card-content">
              <span className="badge">
                {t("1 xe trong đội xe", "1 scooter in the fleet")}
              </span>
              <h2>
                {vehicle.name} · {rentalColor(vehicle.id, t)}
              </h2>
              <p>{t("Từ 400.000 ₫ / 3 ngày", "From 400,000 ₫ / 3 days")}</p>
              <Link
                className="btn btn-primary"
                href={`/rent?vehicle=${vehicle.id}`}
              >
                {t("Đăng ký thuê xe", "Request a rental")} <Arrow />
              </Link>
              <Link
                className="text-link"
                href={`/models/evo-grand-lite?color=${vehicle.id}`}
              >
                {t(
                  `Xem mẫu xe (${rentalColor(vehicle.id, t)})`,
                  `View model (${rentalColor(vehicle.id, t)})`,
                )} <Arrow />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RentalDetail() {
  const { t } = useLanguage();
  const [selected, setSelected] = React.useState("pink");
  const [activePhoto, setActivePhoto] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const color = new URLSearchParams(window.location.search).get("color");
    if (color && fleet.some((vehicle) => vehicle.id === color)) {
      setSelected(color);
    }
  }, []);

  const vehicle = fleet.find((item) => item.id === selected) ?? fleet[0];
  const isPink = vehicle.id === "pink";
  const photos = isPink ? pinkPhotos : whitePhotos;
  const currentPhoto = photos[activePhoto] ?? photos[0];

  return (
    <>
      <section className="fleet-detail container">
        <div className="photo-gallery">
          <div className="gallery-main">
            <ImageSlot
              className="fleet-photo"
              src={currentPhoto.src}
              alt={t(currentPhoto.vi, currentPhoto.en)}
              caption={false}
              priority
            />
            <p className="gallery-caption muted">
              {t(currentPhoto.vi, currentPhoto.en)}
            </p>
          </div>
          <div
            className="gallery-thumbs"
            role="group"
            aria-label={t("Ảnh chi tiết xe", "Scooter photo gallery")}
          >
            {photos.map((photo, idx) => (
              <button
                type="button"
                key={photo.src}
                className={`gallery-thumb-btn ${idx === activePhoto ? "active" : ""}`}
                aria-pressed={idx === activePhoto}
                aria-label={t(photo.vi, photo.en)}
                onClick={() => setActivePhoto(idx)}
              >
                <Image
                  src={photo.src}
                  alt={t(photo.vi, photo.en)}
                  width={160}
                  height={120}
                />
                <span className="thumb-caption">
                  {t(photo.vi, photo.en)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="fleet-detail-copy">
          <p className="eyebrow">{t("ĐỘI XE THỰC TẾ", "REAL OWNER FLEET")}</p>
          <h1>{vehicle.name}</h1>
          <p className="lead">
            {t(
              "Xe chính chủ trong đội xe (Evo Grand Lite). Chọn màu sắc để xem ảnh và gửi yêu cầu thuê.",
              "Owner-confirmed Evo Grand Lite scooters. Choose a color to view photos and send an enquiry.",
            )}
          </p>
          <div
            className="color-options"
            role="group"
            aria-label={t("Màu sắc", "Color")}
          >
            {fleet.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={selected === item.id}
                onClick={() => {
                  setSelected(item.id);
                  if (item.id === "pink") setActivePhoto(0);
                }}
              >
                <span
                  aria-hidden="true"
                  className="color-swatch"
                  style={{ backgroundColor: item.hex }}
                />
                {rentalColor(item.id, t)}
              </button>
            ))}
          </div>
          <p className="muted">
            {t(
              "Đội xe gồm 2 chiếc Evo Grand Lite (hồng và trắng). Tình trạng xe thực tế tùy thuộc vào lịch thuê và ngày bạn chọn.",
              "Our fleet consists of 2 owner-confirmed Evo Grand Lite scooters (pink and white). Actual availability depends on your requested dates.",
            )}
          </p>
          <p className="model-price">
            {t("Từ 400.000 ₫ / 3 ngày", "From 400,000 ₫ / 3 days")}
          </p>
          <Link className="text-link" href="/pricing">
            {t("Xem bảng giá thuê", "View rental rates")} <Arrow />
          </Link>
          <Link
            className="btn btn-primary"
            href={`/rent?vehicle=${vehicle.id}`}
          >
            {t("Đăng ký thuê xe", "Request a rental")} <Arrow />
          </Link>
        </div>
      </section>

      {isPink && <ScooterVideo />}
    </>
  );
}
