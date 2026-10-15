import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
// Keep demonstration content out of search engines. Change only after legal/data verification.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
