import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { FIGMENT_URL } from "@/lib/constants"

// One paragraph, one line of what to do next. The full story lives on /about.
export function Introduction() {
  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn>
          <p className="font-display text-2xl leading-relaxed text-charcoal sm:text-3xl">
            I&apos;m a data analyst and photographer in San Diego. I studied structural
            engineering, got an MBA at UC San Diego, co-founded a surfboard rental
            startup, and picked up a camera somewhere along the way. Days go to turning
            messy datasets into clear decisions. Evenings go to the photographs in the
            next room.
          </p>
        </FadeIn>

        <FadeIn delay={150}>
          <p className="mt-8 border-l-2 border-teal/40 pl-5 font-display text-lg italic text-charcoal/55">
            Numbers don&apos;t lie, but they don&apos;t speak either. Someone has to give them a voice.
          </p>
        </FadeIn>

        <FadeIn delay={250}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-navy px-7 py-3 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:bg-navy hover:text-white"
            >
              The full story
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="text-sm text-charcoal/60">
              Need data work?{" "}
              <a
                href={FIGMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-navy underline decoration-teal/40 underline-offset-4 hover:decoration-teal"
              >
                That&apos;s Figment Analytics
              </a>
              .
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
