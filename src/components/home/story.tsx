import Image from "next/image"
import Link from "next/link"
import { DiagonalWipe } from "@/components/shared/reveals/diagonal-wipe"
import { FadeIn } from "@/components/shared/fade-in"

export function Story() {
  return (
    <section id="story" className="bg-charcoal py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <DiagonalWipe>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/about-2.jpg"
                alt="Mazen Abugharbieh"
                width={700}
                height={1050}
                className="h-auto w-full object-cover"
              />
            </div>
          </DiagonalWipe>
          <FadeIn delay={300}>
            <div>
              <h3 className="text-2xl font-bold leading-relaxed text-white sm:text-3xl">
                A spreadsheet and a camera have more in common than you think.
                Both are tools for seeing what others miss. I use them to tell
                stories that move people.
              </h3>
              <Link
                href="/about"
                className="mt-8 inline-block rounded-full border-2 border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Discover My Story
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
