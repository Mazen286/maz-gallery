import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { SERVICES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About",
  description: "Mazen Abugharbieh merges data engineering precision with creative visual storytelling. Based in San Diego.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-navy sm:text-6xl">About Me</h1>
        </div>
      </section>

      <section className="bg-charcoal py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
                  My Story
                </p>
                <p className="mt-6 text-lg leading-relaxed text-white/90">
                  My journey merges the precision of data engineering with the
                  clarity of data visualization. With an MBA from UC San
                  Diego&apos;s Rady School of Management and a Structural
                  Engineering background, I turn raw data into stories that
                  drive decisions.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-white/90">
                  My work has gained recognition across various platforms, from
                  local news features to university spotlights. Whether
                  building BI programs for municipal governments or co-founding
                  a tech startup, I bring an engineer&apos;s rigor and an
                  MBA&apos;s perspective to every project.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/about-1.jpg"
                  alt="Mazen Abugharbieh"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
              Services
            </p>
            <p className="mt-4 text-lg text-charcoal/80">
              My work is about clarity and impact. Ready to tell your data
              story?
            </p>
            <ul className="mt-8 space-y-4">
              {SERVICES.map((service) => (
                <li key={service} className="border-b border-border pb-4 text-lg font-medium text-navy">
                  {service}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-block rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                Book a Consultation
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
