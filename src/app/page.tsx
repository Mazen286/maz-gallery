import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { AboutPreview } from "@/components/home/about-preview"
import { Philosophy } from "@/components/home/philosophy"
import { Story } from "@/components/home/story"
import { FeaturedOn } from "@/components/home/featured-on"
import { Marquee } from "@/components/home/marquee"
import { TypewriterQuote } from "@/components/shared/typewriter-quote"
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

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="bg-white px-6">
        <div className="mx-auto max-w-4xl">
          <ChapterMarker number="I" title="The Analyst" />
        </div>
      </div>
      <AboutPreview />

      <TypewriterQuote
        text="Numbers don't lie, but they don't speak either. Someone has to give them a voice."
        className="bg-white"
      />

      <div className="bg-slate-50 px-6">
        <div className="mx-auto max-w-4xl">
          <ChapterMarker number="II" title="The Dreamer" />
        </div>
      </div>
      <Philosophy />

      <div className="bg-charcoal px-6">
        <div className="mx-auto max-w-4xl">
          <ChapterMarker number="III" title="The Storyteller" dark />
        </div>
      </div>
      <Story />

      <div className="bg-cream px-6">
        <div className="mx-auto max-w-4xl">
          <ChapterMarker number="IV" title="Recognition" />
        </div>
      </div>
      <FeaturedOn />

      <Marquee />

      {/* Hidden scroll message */}
      <div className="bg-charcoal py-4 text-center">
        <p className="text-[10px] tracking-widest text-white/40">
          You scrolled all the way down? You must really like data.
        </p>
      </div>
    </>
  )
}
