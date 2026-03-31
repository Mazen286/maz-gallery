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
      <section className="bg-white pb-8 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-[6rem] font-bold uppercase leading-[0.9] tracking-tight text-navy sm:text-[10rem]">
            About Me
          </h1>
        </div>
      </section>

      <section className="bg-white pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/about-1.jpg"
              alt="Mazen Abugharbieh"
              width={1400}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
              My Story
            </p>
            <p className="mt-6 text-lg leading-relaxed text-charcoal">
              I studied structural engineering because I wanted to understand
              how things hold together. Then I got my MBA at UC San Diego and
              realized the same question applies to businesses, decisions, and
              stories. Data is the structure. Visualization is the architecture.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-charcoal">
              Along the way, I co-founded a tech startup, built BI programs
              for city governments, and picked up a camera that I haven&apos;t
              put down since. My work has been featured on ABC 10 News, SD
              Voyager, and UC San Diego. But the work I&apos;m most proud of
              is the kind that makes someone say &ldquo;I finally understand
              the data.&rdquo;
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
              Services
            </p>
            <p className="mt-4 text-lg text-charcoal/80">
              I help teams and businesses see their data clearly for the
              first time. Here&apos;s how we can work together.
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
