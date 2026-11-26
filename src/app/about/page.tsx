import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHead } from "@/components/shared/section-head"
import { FIGMENT_URL, PRESS } from "@/lib/constants"
import { GALLERY, photoSlug, wingLabel } from "@/lib/gallery"
import { ALL_PROJECTS } from "@/lib/projects"

export const metadata: Metadata = {
  title: "About Mazen | Data Analyst & Photographer",
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
    text: "Built SurfPods, self-service surfboard rental stations that run 24/7 with no staff. We started in San Diego and launched in Waikiki at the Hyatt Regency in October 2026. Featured in Surfer, KHON2, Pacific Business News, AOL, ABC 10 and CBS 8.",
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
  { number: `${ALL_PROJECTS.length}`, label: "Projects shipped" },
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
    "@id": "https://maz.gallery/about#person",
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
    <div className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />

      {/* Title and portrait. The photograph hangs whole in a mat, so no screen width crops the head. Both are
          there from the first paint, with no rise: the title showed at 0.9 s before the redesign and a rise
          would hold it back. */}
      <section className="pb-20 pt-28 sm:pb-28 sm:pt-36">
        <div className="mx-auto grid max-w-[1312px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-12">
          <div>
            <p className="label text-brass-ink">The Artist</p>
            <h1
              className="mt-5 font-display font-normal leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
            >
              About <span className="italic">me</span>
            </h1>
            <p className="mt-8 max-w-xl font-display text-[22px] leading-[1.5] sm:text-[26px]">
              I build things that help people see clearly. Whether that&apos;s a dashboard, a photograph, or a
              product, the goal is the same: take something complex and make it feel simple.
            </p>
            <div className="mt-10 max-w-sm border-l border-brass-ink/40 pl-6">
              <p className="label text-brass-ink">Currently</p>
              <ul className="mt-3 space-y-1.5 text-[15px] text-ink-2">
                <li>Running Figment Analytics</li>
                <li>Designing the next card game</li>
                <li>Photographing wherever I happen to be</li>
              </ul>
            </div>
          </div>
          <div>
            <figure>
              <div className="frame-light">
                <Image
                  src="/images/about-1.jpg"
                  alt="Mazen Abugharbieh sitting on concrete steps in a checked shirt"
                  width={1500}
                  height={1000}
                  className="h-auto w-full"
                  sizes="(min-width: 1312px) 640px, (min-width: 1024px) 50vw, 92vw"
                  preload
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* The journey, the numbers and three framed pieces share one dark wall */}
      <section className="bg-wall py-20 text-ivory sm:py-28">
        <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
          <SectionHead title="The Journey" tone="dark" />

          <ol className="relative mt-12 max-w-4xl">
            <span className="absolute bottom-3 left-[7px] top-2 w-px bg-wall-line" aria-hidden="true" />
            {JOURNEY.map((item, i) => (
              <li key={item.year}>
                <FadeIn delay={i * 80}>
                  <div className="relative grid gap-2 pb-12 pl-10 sm:grid-cols-[90px_1fr] sm:gap-6">
                    <span
                      className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border ${
                        item.year === "Now" ? "border-brass bg-brass/30" : "border-mist-2 bg-wall"
                      }`}
                      aria-hidden="true"
                    />
                    {item.year === "Now" ? (
                      <span className="font-display text-lg italic text-brass">{item.year}</span>
                    ) : (
                      <time dateTime={item.year} className="font-display text-lg italic text-brass">
                        {item.year}
                      </time>
                    )}
                    <div>
                      <h3 className="font-display text-2xl text-ivory">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-mist">{item.text}</p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 border-y border-wall-line py-12 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse items-center text-center">
                <dt className="label mt-3 text-mist">{stat.label}</dt>
                <dd className="font-display text-5xl text-brass-2">{stat.number}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {PHOTO_BREAK_SRCS.map((src, i) => {
              const img = GALLERY.find((g) => g.src === src)
              if (!img) return null
              return (
                <FadeIn key={src} delay={i * 120}>
                  <Link href={`/gallery/${photoSlug(img)}`} className="group block">
                    <figure>
                      <div className="frame transition-transform duration-500 ease-out group-hover:-translate-y-1">
                        <div className="overflow-hidden">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={img.width}
                            height={img.height}
                            className="aspect-[3/2] h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            sizes="(min-width: 1312px) 380px, (min-width: 640px) 30vw, 92vw"
                           
                          />
                        </div>
                      </div>
                      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
                        <span className="font-display text-[17px] italic text-ivory">{img.alt}</span>
                        {img.location && <span className="label shrink-0 text-mist-2">{wingLabel(img.location)}</span>}
                      </figcaption>
                    </figure>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* What I'm into, and the press, on paper */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
          <SectionHead title="What I'm into" />
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {INTERESTS.map((interest) => (
              <li key={interest} className="rounded-full border border-line px-4 py-2 text-sm text-ink-2">
                {interest}
              </li>
            ))}
          </ul>

          <div className="mt-20 flex flex-col gap-8 border-t border-line pt-12 md:flex-row md:items-center md:justify-between">
            <h2 className="label text-ink-2">As featured in</h2>
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-6">
              {PRESS.map((outlet) => (
                <li key={outlet.name}>
                  <a
                    href={outlet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block opacity-80 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={outlet.logo}
                      alt={`Featured in ${outlet.name}`}
                     
                      decoding="async"
                      className={`w-auto object-contain ${outlet.name === "SD Voyager" ? "h-8 sm:h-9" : "h-12 sm:h-14"}`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* One closing line and two ways forward */}
      <section className="border-t border-line bg-paper-2 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-display text-[34px] leading-tight sm:text-[44px]">
            Want to work <span className="italic text-brass-ink">together?</span>
          </h2>
          <p className="mt-4 text-[15px] text-ink-2">
            I run Figment Analytics for data work. For everything else, just say hello.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="btn btn-ink">
              Say hello
            </Link>
            <a href={FIGMENT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line text-ink">
              Visit Figment Analytics
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
