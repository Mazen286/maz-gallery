import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { GALLERY } from "@/lib/gallery"
import { SITE_URL } from "@/lib/constants"

// Date of the museum redesign; bump when a page meaningfully changes
const REDESIGN = "2026-06-12"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: REDESIGN, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: REDESIGN, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: REDESIGN, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: REDESIGN,
      changeFrequency: "weekly",
      priority: 0.8,
      // Image sitemap entries make all 57 photos discoverable in Google Images
      images: GALLERY.map((img) => `${SITE_URL}${img.src}`),
    },
    { url: `${SITE_URL}/blog`, lastModified: REDESIGN, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/booking`, lastModified: REDESIGN, changeFrequency: "yearly", priority: 0.6 },
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
