import type { Metadata } from "next"
import { GalleryPageClient } from "@/components/gallery/gallery-page-client"

export const metadata: Metadata = {
  title: "Gallery",
  description: "Discover the world through my lens. Travel photography from Turkey, Jordan, New York, San Diego, and beyond.",
  alternates: { canonical: "/gallery" },
}

export default function GalleryPage() {
  return <GalleryPageClient />
}
