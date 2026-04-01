import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"
import { SITE_URL } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/booking`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ]

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
