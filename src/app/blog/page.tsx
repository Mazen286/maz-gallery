import type { Metadata } from "next"
import { BlogPageClient } from "@/components/blog/blog-page-client"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Travel stories, food rankings, video game thoughts, board game design, and whatever else is on my mind.",
  alternates: { canonical: "/blog" },
}

export default function BlogPage() {
  return <BlogPageClient />
}
