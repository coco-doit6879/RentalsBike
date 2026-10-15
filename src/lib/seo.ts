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
      title: `${title} | Evo Lite Showroom`,
      description,
      url: path,
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: "Evo Lite Showroom — concept demo",
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
