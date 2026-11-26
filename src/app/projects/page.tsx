import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHead } from "@/components/shared/section-head"
import { ProjectCard } from "@/components/projects/project-card"
import { ALL_PROJECTS as PROJECTS, PROJECT_ROOMS, projectBySlug } from "@/lib/projects"
import { SITE_URL } from "@/lib/constants"

// The newest piece in the wing gets the featured panel
const FEATURED = "runes-brewstorm"

const DESCRIPTION =
  "Projects by Mazen Abugharbieh, a data analyst in San Diego: Figment Analytics, SurfUp, Figment Forever, Café Maz, data dashboards and browser games from Figment Gaming."

export const metadata: Metadata = {
  title: "Projects by Mazen Abugharbieh",
  description: DESCRIPTION,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects by Mazen Abugharbieh",
    description: "Startups, dashboards, games, and experiments, each with its own page.",
    url: `${SITE_URL}/projects`,
    images: [{ url: "/images/projects/figment-analytics.png", width: 1200, height: 675, alt: "Figment Analytics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects by Mazen Abugharbieh",
    description: "Startups, dashboards, games, and experiments.",
    images: [{ url: "/images/projects/figment-analytics.png", alt: "Figment Analytics" }],
  },
}

export default function ProjectsPage() {
  const featured = projectBySlug(FEATURED)

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
    ],
  }

  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects by Mazen Abugharbieh",
    description: DESCRIPTION,
    url: `${SITE_URL}/projects`,
    author: { "@id": `${SITE_URL}/about#person` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/projects/${p.slug}`,
        name: p.title,
      })),
    },
  }

  return (
    <div className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }} />

      {/* Title */}
      <section className="pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
          <FadeIn immediate>
            <p className="label text-brass-ink">No. 04 &middot; Projects Wing</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-16">
              <h1
                className="font-display font-normal leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
              >
                What I <span className="italic">build</span>
              </h1>
              <p className="font-display text-lg leading-relaxed text-ink-2 sm:text-xl">
                Startups, dashboards, games, and experiments. Each one taught me something the last one
                couldn&apos;t.
              </p>
            </div>
          </FadeIn>
          <nav aria-label="Rooms in the wing" className="mt-12 flex flex-wrap gap-2 border-t border-line pt-6">
            {PROJECT_ROOMS.map((room) => (
              <a
                key={room.id}
                href={`#${room.id}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-ink transition-colors hover:border-ink"
              >
                {room.name}
                <span className="text-ink-3">{PROJECTS.filter((p) => p.room === room.id).length}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Featured: the newest piece in the wing */}
      {featured && (
        <section className="pb-8">
          <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
            <div className="grid overflow-hidden bg-[#121a10] text-ivory lg:grid-cols-[1.5fr_1fr]">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[480px]">
                <Image
                  src="/images/projects/runes-brewstorm-wide.webp"
                  alt="Nestor the fox lifts a carved puzzle board in a sunlit forest while a ribbon of runes and potions arcs over him"
                  fill
                  className="object-cover object-[45%_50%]"
                  sizes="(min-width: 1024px) 760px, 100vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 hidden bg-gradient-to-r from-transparent from-60% to-[#121a10] lg:block"
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <p className="label text-brass-2">New in the wing &middot; {featured.subtitle}</p>
                <h2 className="mt-4 font-display text-[36px] leading-[1.05] sm:text-[44px]">{featured.title}</h2>
                <p className="mt-5 text-[15px] leading-relaxed text-mist">{featured.description}</p>
                <p className="mt-5 text-[13px] text-mist-2">{featured.tags.join(" · ")}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href={featured.url} target="_blank" rel="noopener noreferrer" className="btn btn-ivory">
                    Play it free
                  </a>
                  <Link href={`/projects/${featured.slug}`} className="btn btn-line text-ivory">
                    Read about it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The rooms of the wing */}
      {PROJECT_ROOMS.map((room) => {
        const items = PROJECTS.filter((p) => p.room === room.id)
        return (
          <section key={room.id} id={room.id} aria-labelledby={`${room.id}-title`} className="scroll-mt-24 pt-20 sm:pt-24">
            <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
              <SectionHead title={room.name} />
              <h2 id={`${room.id}-title`} className="sr-only">
                {room.name}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] text-ink-2">{room.blurb}</p>
              <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project, i) => (
                  <FadeIn key={project.slug} delay={(i % 3) * 80}>
                    <ProjectCard project={project} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* A closing line and one action */}
      <section className="px-5 pb-28 pt-28 text-center sm:pb-36 sm:pt-36">
        <h2 className="font-display text-[34px] leading-tight sm:text-[48px]">
          Have something worth <span className="italic text-brass-ink">building?</span>
        </h2>
        <Link href="/booking" className="btn btn-ink mt-8">
          Say hello at the Front Desk
        </Link>
      </section>
    </div>
  )
}
