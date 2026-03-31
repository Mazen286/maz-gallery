import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"

export function Story() {
  return (
    <section className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/story.jpg"
                alt="Mazen photographing"
                width={700}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div>
              <h3 className="text-2xl font-bold leading-relaxed text-white sm:text-3xl">
                From a young age, I was fascinated by the power of
                storytelling. Today, I channel that passion through data and
                photography.
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
