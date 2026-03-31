import { Hero } from "@/components/home/hero"
import { AboutPreview } from "@/components/home/about-preview"
import { Philosophy } from "@/components/home/philosophy"
import { Story } from "@/components/home/story"
import { FeaturedOn } from "@/components/home/featured-on"
import { Marquee } from "@/components/home/marquee"
import { TypewriterQuote } from "@/components/shared/typewriter-quote"
import { ChapterMarker } from "@/components/shared/chapter-marker"

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

      <TypewriterQuote
        text="The best photograph is the one that makes you feel something you can't put into a spreadsheet."
        className="bg-slate-50"
      />

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
        <p className="text-[10px] tracking-widest text-white/10">
          You scrolled all the way down? You must really like data.
        </p>
      </div>
    </>
  )
}
