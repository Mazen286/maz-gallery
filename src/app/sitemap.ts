import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { GALLERY } from "@/lib/gallery"
import { SITE_URL } from "@/lib/constants"

// Bump a route's date when its content meaningfully changes. The Daily
// Postcard changes every day by definition, so it always reports today.
const LAST_MODIFIED = {
  "/": "2026-09-14",
  "/about": "2026-09-14",
  "/projects": "2026-09-14",
  "/gallery": "2026-09-10",
  "/blog": "2026-09-14",
  "/booking": "2026-09-14",
} as const

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: LAST_MODIFIED["/"], changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: LAST_MODIFIED["/about"], changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: LAST_MODIFIED["/projects"], changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: LAST_MODIFIED["/gallery"],
      changeFrequency: "weekly",
      priority: 0.8,
      // Image sitemap entries make every photo discoverable in Google Images
      images: GALLERY.map((img) => `${SITE_URL}${img.src}`),
    },
    { url: `${SITE_URL}/blog`, lastModified: LAST_MODIFIED["/blog"], changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/daily`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/booking`, lastModified: LAST_MODIFIED["/booking"], changeFrequency: "yearly", priority: 0.6 },
  ]

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    images: [`${SITE_URL}${post.image}`],
  }))

  return [...staticPages, ...blogPages]
}
