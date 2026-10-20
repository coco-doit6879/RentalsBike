// Verified owner fleet: 2 scooters (Pink and White Evo Grand Lite).
// Real photography is available for the Pink scooter; White scooter photo is pending.

export interface FleetVehicle {
  id: "pink" | "white";
  name: string;
  colorVi: string;
  colorEn: string;
  hex: string;
  image: string | null;
  quantity: number;
}

export const fleet: FleetVehicle[] = [
  {
    id: "pink",
    name: "Evo Grand Lite",
    colorVi: "Hồng phấn",
    colorEn: "Blush pink",
    hex: "#dca3ad",
    image: "/media/evo-grand-lite/pink-front-34.webp",
    quantity: 1,
  },
  {
    id: "white",
    name: "Evo Grand Lite",
    colorVi: "Trắng ngọc",
    colorEn: "Pearl white",
    hex: "#eae6dc",
    image: null,
    quantity: 1,
  },
];

export interface ScooterPhoto {
  src: string;
  vi: string;
  en: string;
}

export const pinkPhotos: ScooterPhoto[] = [
  {
    src: "/media/evo-grand-lite/pink-front-34.webp",
    vi: "Toàn xe góc trước 3/4 (ảnh thật)",
    en: "Front three-quarter view (actual photo)",
  },
  {
    src: "/media/evo-grand-lite/pink-rear-34.webp",
    vi: "Góc sau 3/4 (biển số đã che để bảo mật)",
    en: "Rear three-quarter view (plate masked for privacy)",
  },
  {
    src: "/media/evo-grand-lite/pink-side.webp",
    vi: "Ngang thân xe và sàn để chân",
    en: "Side profile and footboard",
  },
  {
    src: "/media/evo-grand-lite/pink-front-low.webp",
    vi: "Góc trước thấp, chi tiết đèn pha",
    en: "Low-angle front view with headlight detail",
  },
  {
    src: "/media/evo-grand-lite/pink-storage.webp",
    vi: "Khoang chứa đồ dưới yên xe",
    en: "Under-seat storage compartment",
  },
];

export const scooterVideo = {
  srcMp4: "/media/evo-grand-lite/scooter-walkaround.mp4",
  poster: "/media/evo-grand-lite/video-poster.webp",
  durationSec: 23,
};
