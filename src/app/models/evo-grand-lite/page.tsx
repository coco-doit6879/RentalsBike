import React from "react";
import { RentalDetail } from "@/components/rental-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Evo Grand Lite — Xe cho thuê / Rental scooter",
  "Khám phá Evo Grand Lite với ảnh thực tế và gửi yêu cầu thuê xe. Explore Evo Grand Lite with actual photography and send an enquiry.",
  "/models/evo-grand-lite",
);

export default function Page() {
  return (
    <div className="page-wrapper">
      <RentalDetail />
    </div>
  );
}
