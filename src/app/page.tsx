import { Hero } from "@/components/home/hero"
import { AboutPreview } from "@/components/home/about-preview"
import { Philosophy } from "@/components/home/philosophy"
import { Story } from "@/components/home/story"
import { FeaturedOn } from "@/components/home/featured-on"
import { Marquee } from "@/components/home/marquee"

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <Philosophy />
      <Story />
      <FeaturedOn />
      <Marquee />
    </>
  )
}
