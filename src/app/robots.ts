import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/cafe-maz",
    },
    sitemap: "https://maz.gallery/sitemap.xml",
  }
}
