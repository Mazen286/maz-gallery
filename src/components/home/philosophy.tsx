import Link from "next/link"
import { SlideIn } from "@/components/shared/reveals/slide-in"
import { FadeIn } from "@/components/shared/fade-in"
import { FIGMENT_URL } from "@/lib/constants"

export function Philosophy() {
  return (
    <section id="philosophy" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <SlideIn>
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            Philosophy
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-charcoal sm:text-2xl">
            I believe the best insights hide in plain sight. The patterns in a
            dataset, the geometry of a skyline, the rhythm of a city street.
            My job is to slow down, look closer, and make the invisible
            visible.
          </p>
        </SlideIn>

        <FadeIn delay={200}>
          <hr className="my-8 border-border" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            What I Do
          </p>
          <p className="mt-4 text-lg text-charcoal/80">
            I build things at the intersection of data and design. I co-founded
            a startup, I take photos, and I run{" "}
            <a
              href={FIGMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-navy underline decoration-teal/40 underline-offset-4 hover:decoration-teal"
            >
              Figment Analytics
            </a>
            , a data consultancy that helps businesses make sense of their numbers.
          </p>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="inline-block rounded-full border-2 border-navy px-8 py-3 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Say Hello
            </Link>
            <a
              href={FIGMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border-2 border-teal/30 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-teal transition-colors hover:bg-teal/10"
            >
              Need Data Help?
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
