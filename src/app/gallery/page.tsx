import type { Metadata } from "next"
import { GALLERY } from "@/lib/gallery"
import { Suspense } from "react"
import { GalleryPageClient } from "@/components/gallery/gallery-page-client"

export const metadata: Metadata = {
  title: "Travel Photography Gallery",
  description: `${GALLERY.length} travel photographs with the stories behind them, shot in Alanya, Istanbul, Amman, New York, San Diego, Orlando, and beyond.`,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Photography Gallery - Mazen Abugharbieh",
    description: "Travel photography from Turkey, Jordan, New York, San Diego, and beyond.",
    url: "https://maz.gallery/gallery",
    images: [{ url: "/images/gallery/NewYork-2-Edit.jpg", width: 1200, height: 630, alt: "Rainy New York night" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography Gallery - Mazen Abugharbieh",
    description: "Travel photography from Turkey, Jordan, New York, San Diego, and beyond.",
    images: [{ url: "/images/gallery/NewYork-2-Edit.jpg", alt: "Rainy New York night" }],
  },
}

export default function GalleryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://maz.gallery" },
      { "@type": "ListItem", position: 2, name: "Gallery", item: "https://maz.gallery/gallery" },
    ],
  }

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Photography Gallery",
    description: "Travel photography from Turkey, Jordan, New York, San Diego, and beyond.",
    url: "https://maz.gallery/gallery",
    author: { "@type": "Person", name: "Mazen Abugharbieh" },
    image: GALLERY.map((img) => ({
      "@type": "ImageObject",
      url: `https://maz.gallery${img.src}`,
      name: img.alt,
      description: img.story || img.alt,
      width: img.width,
      height: img.height,
      creator: { "@type": "Person", name: "Mazen Abugharbieh" },
      creditText: "Mazen Abugharbieh",
      ...(img.location && {
        contentLocation: { "@type": "Place", name: img.location },
      }),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />
      {/* useSearchParams in the client needs a boundary for static rendering */}
      <Suspense fallback={<div className="min-h-screen bg-[#0a0c11]" />}>
        <GalleryPageClient />
      </Suspense>
    </>
  )
}
