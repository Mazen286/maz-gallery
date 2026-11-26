import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { FeaturedExhibits } from "@/components/home/featured-exhibits"
import { Introduction } from "@/components/home/introduction"
import { SelectedWorks } from "@/components/home/selected-works"
import { AnnexTeaser } from "@/components/home/annex-teaser"
import { FeaturedOn } from "@/components/home/featured-on"
import { GALLERY, LOCATIONS } from "@/lib/gallery"

export const metadata: Metadata = {
  title: "Mazen Abugharbieh | Data Analyst, Photographer, San Diego",
  description:
    "Mazen Abugharbieh is a data analyst, photographer, and startup co-founder based in San Diego. Explore his portfolio, gallery, and projects.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mazen Abugharbieh | Data Analyst, Photographer, San Diego",
    description: "Data analyst, photographer, and startup co-founder based in San Diego.",
    url: "https://maz.gallery",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Mazen Abugharbieh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mazen Abugharbieh | Data Analyst, Photographer, San Diego",
    description: "Data analyst, photographer, and startup co-founder based in San Diego.",
  },
}

// The entrance is a directory of the rooms behind it. Each section carries
// the number of the room it leads to, the same number the header, the
// placards and the footer use. Dark walls and warm paper alternate, and each
// section paints its own band, so no seam shows between them.
export default function HomePage() {
  return (
    <div data-tone="dark">
      <Hero works={GALLERY.length} places={LOCATIONS.length} />
      <FeaturedExhibits />
      <Introduction />
      <SelectedWorks />
      <AnnexTeaser />
      <FeaturedOn />
    </div>
  )
}
