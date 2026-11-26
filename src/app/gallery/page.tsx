import type { Metadata } from "next"
import { GALLERY, LOCATIONS, ORDERED_GALLERY, photoSlug } from "@/lib/gallery"
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
    image: ORDERED_GALLERY.map((img) => ({
      "@type": "ImageObject",
      "@id": `https://maz.gallery/gallery/${photoSlug(img)}#image`,
      url: `https://maz.gallery/gallery/${photoSlug(img)}`,
      contentUrl: `https://maz.gallery${img.src}`,
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
    <div data-tone="dark" className="bg-wall text-ivory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />

      {/* The room's title is in the page's HTML, so it never waits for the
          viewer's scripts (which need the URL to pick a view) */}
      <section className="px-5 pb-10 pt-28 sm:px-8 sm:pt-36 lg:px-12">
        <div className="mx-auto max-w-[1216px] animate-rise-in">
          <p className="label text-brass">The Gallery</p>
          <h1
            className="mt-5 font-display font-normal leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.75rem)" }}
          >
            Places I&apos;ve been.
            <br />
            <span className="italic text-brass-2">Moments I couldn&apos;t let go of.</span>
          </h1>
          <p className="mt-6 text-[15px] text-mist">
            {GALLERY.length} photographs from {LOCATIONS.length} places
          </p>
        </div>
      </section>

      {/* useSearchParams in the client needs a boundary for static rendering */}
      <Suspense fallback={<div className="min-h-screen bg-wall" />}>
        <GalleryPageClient />
      </Suspense>
    </div>
  )
}
