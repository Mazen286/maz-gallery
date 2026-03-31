import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { SERVICES } from "@/lib/constants"

export function Philosophy() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            Philosophy
          </p>
          <p className="mt-6 text-xl leading-relaxed text-charcoal sm:text-2xl">
            My guiding principle is to dream big and relentlessly pursue those
            dreams. Life is a canvas where every experience, challenge, and
            triumph contributes to an ever-evolving narrative.
          </p>
        </FadeIn>

        <FadeIn delay={200}>
          <hr className="my-12 border-border" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            Services
          </p>
          <p className="mt-4 text-lg text-charcoal/80">
            Ready to tell your data story? Browse available services, then book
            a free consultation.
          </p>
          <ul className="mt-6 space-y-4">
            {SERVICES.map((service) => (
              <li key={service} className="border-b border-border pb-4 text-lg font-medium text-navy">
                {service}
              </li>
            ))}
          </ul>
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
