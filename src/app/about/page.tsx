import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { FIGMENT_URL, PRESS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About Mazen Abugharbieh | Data Analyst & Photographer",
  description:
    "Mazen Abugharbieh merges data engineering precision with creative visual storytelling. Based in San Diego.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Mazen Abugharbieh",
    description: "Data analyst, photographer, and startup co-founder based in San Diego. Structural engineering background, MBA from UC San Diego.",
    url: "https://maz.gallery/about",
    images: [{ url: "/images/about-1.jpg", width: 1200, height: 630, alt: "Mazen Abugharbieh on stairs" }],
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

const STATS = [
  { number: "7+", label: "Projects shipped" },
  { number: "10+", label: "Locations photographed" },
  { number: "3", label: "Media features" },
  { number: "57", label: "Gallery photos" },
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
            className="h-[340px] w-full object-cover object-[center_45%] sm:h-[420px] lg:h-[500px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 px-8 pb-10 sm:pb-14">
            <div className="mx-auto max-w-7xl">
              <h1
                className="font-bold uppercase leading-[0.9] tracking-tight text-white"
                style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
              >
                About Me
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Opening statement */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <p className="text-2xl leading-relaxed text-charcoal sm:text-3xl lg:text-4xl">
              I build things that help people see clearly. Whether that&apos;s a
              dashboard, a photograph, or a product, the goal is the same: take
              something complex and make it feel simple.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="bg-charcoal py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              The Journey
            </h2>
          </FadeIn>

          <div className="mt-10 space-y-0">
            {JOURNEY.map((item, i) => (
              <FadeIn key={item.year} delay={i * 100}>
                <div className="grid grid-cols-[60px_1fr] gap-6 border-l border-white/10 py-8 pl-8 sm:grid-cols-[80px_1fr]">
                  {item.year === "Now" ? (
                    <span className="font-mono text-sm font-bold text-teal">{item.year}</span>
                  ) : (
                    <time dateTime={item.year} className="font-mono text-sm font-bold text-teal">{item.year}</time>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/50">
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
      <section className="border-y border-white/10 bg-charcoal py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 80}>
                <div className="text-center">
                  <p className="text-4xl font-bold text-teal sm:text-5xl">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Photo break - 3 standout images */}
      <section className="bg-charcoal py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <FadeIn delay={0}>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/images/gallery/Istanbul-1.jpg"
                  alt="Light inside the Hagia Sophia"
                  width={1500}
                  height={1000}
                  className="h-64 w-full object-cover sm:h-80"
                  loading="lazy"
                />
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/images/gallery/Jordan-3.jpg"
                  alt="The Abdoun Bridge at night"
                  width={1500}
                  height={1000}
                  className="h-64 w-full object-cover sm:h-80"
                  loading="lazy"
                />
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/images/gallery/IMG_3901.jpg"
                  alt="Autumn in Central Park"
                  width={1500}
                  height={1000}
                  className="h-64 w-full object-cover sm:h-80"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* What I'm Into */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              What I&apos;m Into
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {INTERESTS.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-navy/15 px-5 py-2 text-sm font-medium text-navy/70"
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
            <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-charcoal/40">
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
            <p className="text-2xl font-bold text-navy sm:text-3xl">
              Want to work together?
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
