import React from "react";
import Link from "next/link";
import { ImageSlot, Arrow } from "./primitives";
import { type Vehicle, priceFormat } from "@/data/catalog";
export function VehicleCard({
  vehicle,
  inventory = false,
}: {
  vehicle: Vehicle;
  inventory?: boolean;
}) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card-top">
        <span className="eyebrow">{vehicle.edition}</span>
        {inventory ? (
          <span className="stock">{vehicle.stock} xe · Mẫu</span>
        ) : (
          <span
            className="swatch"
            style={{ backgroundColor: vehicle.hex }}
            aria-hidden="true"
          />
        )}
      </div>
      <Link
        href={`/models/evo-lite?color=${vehicle.id}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ImageSlot
          src={vehicle.image}
          alt={`Concept xe điện màu ${vehicle.color}, không phải thiết kế chính thức`}
          caption={false}
        />
      </Link>
      <div className="vehicle-card-content">
        <p className="vehicle-color">{vehicle.color}</p>
        <h3>
          {vehicle.name}
          <span> / {vehicle.edition}</span>
        </h3>
        <p className="muted">
          Xe máy điện đô thị{inventory ? ` · ${vehicle.city}` : ""}
        </p>
        <div className="vehicle-specs">
          <div>
            <strong>
              {vehicle.range} <small>km</small>
            </strong>
            <span>Quãng đường mẫu</span>
          </div>
          <div>
            <strong>
              {vehicle.speed} <small>km/h</small>
            </strong>
            <span>Tốc độ mẫu</span>
          </div>
          <div>
            <strong>
              {vehicle.charge} <small>giờ</small>
            </strong>
            <span>Sạc đầy mẫu</span>
          </div>
        </div>
        <div className="vehicle-bottom">
          <div>
            <span>Giá tham khảo · CẦN XÁC MINH</span>
            <strong>{priceFormat(vehicle.price)}</strong>
          </div>
          <Link
            className="icon-link"
            href={`/models/evo-lite?color=${vehicle.id}`}
            aria-label={`Khám phá Evo Lite ${vehicle.color}`}
          >
            <Arrow diagonal />
          </Link>
        </div>
      </div>
    </article>
  );
}
