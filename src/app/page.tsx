import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { FeaturedExhibits } from "@/components/home/featured-exhibits"
import { Introduction } from "@/components/home/introduction"
import { SelectedWorks } from "@/components/home/selected-works"
import { AnnexTeaser } from "@/components/home/annex-teaser"
import { FeaturedOn } from "@/components/home/featured-on"
import { ChapterMarker } from "@/components/shared/chapter-marker"

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

// Five short rooms. Each one says a different thing and leads somewhere.
export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="bg-[#0a0c11] px-6 pt-8">
        <div className="mx-auto max-w-6xl">
          <ChapterMarker number="I" title="The Collection" dark />
        </div>
      </div>
      <FeaturedExhibits />

      <div className="bg-white px-6">
        <div className="mx-auto max-w-4xl">
          <ChapterMarker number="II" title="The Artist" />
        </div>
      </div>
      <Introduction />

      <div className="bg-slate-50 px-6">
        <div className="mx-auto max-w-6xl">
          <ChapterMarker number="III" title="The Builder" />
        </div>
      </div>
      <SelectedWorks />

      <div className="bg-[#0a0c11] px-6">
        <div className="mx-auto max-w-6xl">
          <ChapterMarker number="IV" title="The Annex" dark />
        </div>
      </div>
      <AnnexTeaser />

      <div className="bg-cream px-6">
        <div className="mx-auto max-w-4xl">
          <ChapterMarker number="V" title="Recognition" />
        </div>
      </div>
      <FeaturedOn />
    </>
  )
}
