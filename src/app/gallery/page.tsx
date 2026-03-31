import type { Metadata } from "next"
import { GalleryGrid } from "@/components/gallery/gallery-grid"

export const metadata: Metadata = {
  title: "Gallery",
  description: "Discover the world through my lens. Travel photography from Turkey, Jordan, New York, San Diego, and beyond.",
  alternates: { canonical: "/gallery" },
}

export default function GalleryPage() {
  return (
    <>
      <section className="bg-white pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-navy sm:text-6xl">Gallery</h1>
          <p className="mt-4 text-lg text-charcoal/70">
            Discover the world through my lens. Every photograph tells a story.
          </p>
        </div>
      </section>

      <section className="bg-white pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <GalleryGrid />
        </div>
      </section>
    </>
  )
}
