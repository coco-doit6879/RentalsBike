import type { Metadata } from "next";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export function pageMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | MS TAM Rentals`,
      description,
      url: path,
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: "MS TAM Rentals — Thuê xe điện",
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
