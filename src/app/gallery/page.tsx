import type { Metadata } from "next"
import { GALLERY } from "@/lib/gallery"
import { GalleryPageClient } from "@/components/gallery/gallery-page-client"

export const metadata: Metadata = {
  title: "Photography Gallery | Travel Photos by Mazen Abugharbieh",
  description: "Discover the world through my lens. Travel photography from Turkey, Jordan, New York, San Diego, and beyond.",
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
    image: GALLERY.slice(0, 20).map((img) => ({
      "@type": "ImageObject",
      url: `https://maz.gallery${img.src}`,
      name: img.alt,
      description: img.story || img.alt,
      width: img.width,
      height: img.height,
      ...(img.location && {
        contentLocation: { "@type": "Place", name: img.location },
      }),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />
      <GalleryPageClient />
    </>
  )
}
