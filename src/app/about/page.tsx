import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { FIGMENT_URL, PRESS } from "@/lib/constants"
import { GALLERY } from "@/lib/gallery"

export const metadata: Metadata = {
  title: "About Mazen Abugharbieh | Data Analyst & Photographer",
  description:
    "Mazen Abugharbieh merges data engineering precision with creative visual storytelling. Structural engineer turned analyst, photographer, and startup founder in San Diego.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Mazen Abugharbieh",
    description: "Data analyst, photographer, and startup co-founder based in San Diego. Structural engineering background, MBA from UC San Diego.",
    url: "https://maz.gallery/about",
    images: [{ url: "/images/about-1.jpg", width: 1500, height: 1000, alt: "Mazen Abugharbieh on stairs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Mazen Abugharbieh",
    description: "Data analyst, photographer, and startup co-founder based in San Diego.",
    images: [{ url: "/images/about-1.jpg", alt: "Mazen Abugharbieh on stairs" }],
  },
}

const JOURNEY = [
  {
    year: "2015",
    title: "Structural Engineering",
    text: "Started with a degree in structural engineering. Learned how things hold together under pressure, how to read the forces behind what you see. That foundation shaped everything that came after.",
  },
  {
    year: "2019",
    title: "MBA at UC San Diego",
    text: "Got my MBA at UCSD. Realized the same principles that hold up a building hold up a business. Data is the structure. Strategy is the design.",
  },
  {
    year: "2020",
    title: "Co-Founded SurfUp",
    text: "Built automated surfboard rental stations across San Diego. Hardware, software, operations. Featured on ABC 10 News, CBS 8, and the San Diego Union-Tribune.",
  },
  {
    year: "2021",
    title: "Started Figment Analytics",
    text: "Launched a data consultancy with a team of three. Dashboards, workshops, BI programs. Helping businesses see their numbers clearly for the first time.",
  },
  {
    year: "Now",
    title: "Building & Creating",
    text: "Running the consultancy, designing games, taking photos, collecting digital art, and always looking for the next thing to build.",
  },
]

const PLACES = new Set(GALLERY.map((img) => img.location).filter(Boolean)).size

const STATS = [
  { number: "7+", label: "Projects shipped" },
  { number: `${PLACES}`, label: "Places photographed" },
  { number: `${PRESS.length}`, label: "Media features" },
  { number: `${GALLERY.length}`, label: "Photographs on display" },
]

// Pulled from the gallery manifest so captions and locations stay true
const PHOTO_BREAK_SRCS = [
  "/images/gallery/Istanbul-1.jpg",
  "/images/gallery/Jordan-3.jpg",
  "/images/gallery/IMG_3901.jpg",
]

const INTERESTS = [
  "Photography",
  "Game Design",
  "Data Visualization",
  "Travel",
  "Digital Collectibles",
  "Startups",
  "Overwatch",
  "Card Games",
]

export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mazen Abugharbieh",
    givenName: "Mazen",
    familyName: "Abugharbieh",
    url: "https://maz.gallery",
    image: "https://maz.gallery/images/hero-portrait.jpg",
    jobTitle: "Data Analyst and Photographer",
    knowsAbout: ["Data Analysis", "Data Visualization", "Photography", "Startup Entrepreneurship", "Structural Engineering", "Business Intelligence"],
    worksFor: { "@type": "Organization", name: "Figment Analytics", url: "https://figmentanalytics.com" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "UC San Diego" },
    address: { "@type": "PostalAddress", addressLocality: "San Diego", addressRegion: "CA", addressCountry: "US" },
    sameAs: ["https://www.linkedin.com/in/mazenabugharbieh/", "https://instagram.com/mazen2892"],
  }

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: personSchema,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://maz.gallery" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://maz.gallery/about" },
      ],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />
      {/* Hero - full bleed */}
      <section className="relative">
        <div className="relative overflow-hidden">
          <Image
            src="/images/about-1.jpg"
            alt="Mazen Abugharbieh"
            width={1400}
            height={600}
            className="h-[420px] w-full object-cover object-[center_15%] sm:h-[500px] lg:h-[600px]"
            preload
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 px-8 pb-10 sm:pb-14">
            <div className="mx-auto max-w-7xl">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal">
                No. 02 &middot; The Artist
              </p>
              <h1
                className="mt-3 font-display font-semibold leading-[0.95] text-white"
                style={{ fontSize: "clamp(3.2rem, 10vw, 8rem)" }}
              >
                About <span className="italic">me</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Opening statement */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <p className="font-display text-2xl leading-relaxed text-charcoal sm:text-3xl lg:text-4xl">
              I build things that help people see clearly. Whether that&apos;s a
              dashboard, a photograph, or a product, the goal is the same: take
              something complex and make it feel simple.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-12 max-w-sm border border-navy/15 bg-slate-50/70 p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-teal">
                Currently
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-charcoal/70">
                <li>Running Figment Analytics</li>
                <li>Designing the next card game</li>
                <li>Photographing wherever I happen to be</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="bg-charcoal py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              The Journey
            </h2>
          </FadeIn>

          <div className="relative mt-12">
            <div className="absolute bottom-3 left-[7px] top-2 w-px bg-white/10" aria-hidden="true" />
            {JOURNEY.map((item, i) => (
              <FadeIn key={item.year} delay={i * 100}>
                <div className="relative grid gap-2 pb-12 pl-10 last:pb-2 sm:grid-cols-[90px_1fr] sm:gap-6">
                  <span
                    className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border ${
                      item.year === "Now"
                        ? "border-teal bg-teal/30"
                        : "border-white/25 bg-charcoal"
                    }`}
                    aria-hidden="true"
                  />
                  {item.year === "Now" ? (
                    <span className="font-mono text-sm text-teal/90">{item.year}</span>
                  ) : (
                    <time dateTime={item.year} className="font-mono text-sm text-teal/90">{item.year}</time>
                  )}
                  <div>
                    <h3 className="font-display text-2xl italic text-white">{item.title}</h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/50">
                      {item.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-charcoal py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 80}>
                <div className="text-center">
                  <p className="font-display text-4xl font-semibold text-teal sm:text-5xl">
                    {stat.number}
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Photo break - framed pieces from the collection */}
      <section className="bg-charcoal pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            {PHOTO_BREAK_SRCS.map((src, i) => {
              const img = GALLERY.find((g) => g.src === src)
              if (!img) return null
              return (
                <FadeIn key={src} delay={i * 120}>
                  <Link
                    href={`/gallery?piece=${encodeURIComponent(img.src)}`}
                    className="group block"
                  >
                    <figure>
                      <div className="border border-[#a08c5f]/35 bg-[#efece4] p-2.5 shadow-[0_14px_40px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                        <div className="overflow-hidden">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={img.width}
                            height={img.height}
                            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-64"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                        <span className="font-display text-sm italic text-white/70">
                          {img.alt}
                        </span>
                        {img.location && (
                          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-teal/60">
                            {img.location}
                          </span>
                        )}
                      </figcaption>
                    </figure>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* What I'm Into */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              What I&apos;m Into
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {INTERESTS.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-navy/15 px-4 py-2 font-mono text-xs text-navy/70"
                >
                  {interest}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured on */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.4em] text-charcoal/40">
              Featured On
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-12">
              {PRESS.map((outlet) => (
                <a
                  key={outlet.name}
                  href={outlet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={outlet.logo}
                    alt={outlet.name}
                    className="h-14 w-auto object-contain sm:h-16"
                  />
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <p className="font-display text-2xl text-navy sm:text-3xl">
              Want to work <span className="italic">together</span>?
            </p>
            <p className="mt-3 text-charcoal/50">
              I run{" "}
              <a
                href={FIGMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal underline-offset-4 hover:underline"
              >
                Figment Analytics
              </a>{" "}
              for data work. For everything else, just say hello.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                Say Hello
              </Link>
              <a
                href={FIGMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-navy px-8 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
              >
                Visit Figment Analytics
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
