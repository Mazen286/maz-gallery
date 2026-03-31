import Link from "next/link"
import { SlideIn } from "@/components/shared/reveals/slide-in"
import { Cascade } from "@/components/shared/reveals/cascade"
import { FadeIn } from "@/components/shared/fade-in"
import { SERVICES } from "@/lib/constants"

export function Philosophy() {
  return (
    <section id="philosophy" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SlideIn>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            Philosophy
          </p>
          <p className="mt-6 text-xl leading-relaxed text-charcoal sm:text-2xl">
            I believe the best insights hide in plain sight. The patterns in a
            dataset, the geometry of a skyline, the rhythm of a city street.
            My job is to slow down, look closer, and make the invisible
            visible.
          </p>
        </SlideIn>

        <FadeIn delay={200}>
          <hr className="my-12 border-border" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            Services
          </p>
          <p className="mt-4 text-lg text-charcoal/80">
            Whether you need a dashboard that actually gets used or a workshop
            that changes how your team thinks about data, I can help.
          </p>
        </FadeIn>

        <Cascade staggerMs={120} className="mt-6 space-y-4">
          {SERVICES.map((service) => (
            <div key={service} className="border-b border-border pb-4 text-lg font-medium text-navy">
              {service}
            </div>
          ))}
        </Cascade>

        <FadeIn delay={600}>
          <div className="mt-8">
            <Link
              href="/booking"
              className="inline-block rounded-full border-2 border-navy px-8 py-3 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Book Me
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
