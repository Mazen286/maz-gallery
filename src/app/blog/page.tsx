import type { Metadata } from "next"
import { BlogPageClient } from "@/components/blog/blog-page-client"

export const metadata: Metadata = {
  title: "Blog | Travel, Food, and Games by Mazen Abugharbieh",
  description:
    "Travel stories, food rankings, video game thoughts, board game design, and whatever else is on my mind.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog - Mazen Abugharbieh",
    description: "Travel stories, food rankings, video game thoughts, board game design, and whatever else is on my mind.",
    url: "https://maz.gallery/blog",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "MazGallery Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Mazen Abugharbieh",
    description: "Travel stories, food rankings, video game thoughts, and more.",
    images: [{ url: "/images/og-default.jpg", alt: "MazGallery Blog" }],
  },
}

export default function BlogPage() {
  return <BlogPageClient />
}
