import type { Metadata } from "next"
import Image from "next/image"
import { FadeIn } from "@/components/shared/fade-in"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { ALL_PROJECTS as PROJECTS } from "@/lib/projects"

export const metadata: Metadata = {
  title: "Projects | Figment Analytics, SurfUp",
  description:
    "Explore my projects: Figment Analytics, SurfUp, LA 311, FlightPulse, Figment Gaming, Runes & Reagents, and more, with live demos and the lessons each one taught me.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects by Mazen Abugharbieh",
    description: "Startups, dashboards, games, and experiments. Figment Analytics, SurfUp, LA 311 Dashboard, and more.",
    url: "https://maz.gallery/projects",
    images: [{ url: "/images/projects/figment-analytics.png", width: 1200, height: 675, alt: "Figment Analytics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects by Mazen Abugharbieh",
    description: "Startups, dashboards, games, and experiments.",
    images: [{ url: "/images/projects/figment-analytics.png", alt: "Figment Analytics" }],
  },
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number]
  index: number
}) {
  const external = project.url.startsWith("http")
  // Internal projects stay inside the app; external ones open a new tab
  const Card = external ? "a" : Link
  return (
    <FadeIn delay={(index % 3) * 80}>
      <Card
        href={project.url}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
      >
        {/* Image — 16:9 (matches most sources); contain so nothing crops,
            with a faint accent panel framing any letterbox */}
        <div
          className="relative aspect-video overflow-hidden"
          style={{ backgroundColor: `${project.accent}14` }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content — fills remaining height so footers align */}
        <div className="flex flex-1 flex-col p-5">
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: project.accent }}
          >
            {project.subtitle}
          </p>
          <h2 className="mt-1.5 font-display text-xl text-navy">
            {project.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/55">
            {project.description}
          </p>

          {/* Footer pinned to the bottom of every card */}
          <div className="mt-auto pt-4">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-navy/10 px-2.5 py-0.5 text-[10px] font-medium text-navy/45"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-navy/60 transition-all duration-300 group-hover:gap-2.5 group-hover:text-navy">
              {project.cta}
              {external ? <ExternalLink className="size-3" /> : <ArrowRight className="size-3" />}
            </span>
          </div>
        </div>

        {/* Accent bottom line */}
        <div
          className="h-[3px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ backgroundColor: project.accent }}
        />
      </Card>
    </FadeIn>
  )
}

export default function ProjectsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://maz.gallery" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://maz.gallery/projects" },
    ],
  }

  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects by Mazen Abugharbieh",
    description: "Startups, dashboards, games, and experiments.",
    url: "https://maz.gallery/projects",
    hasPart: PROJECTS.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      description: p.description,
      url: p.url,
    })),
  }

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }} />
      {/* Hero */}
      <section className="bg-white pb-8 pt-36 sm:pt-44">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              No. 04 &middot; Projects Wing
            </p>
            <h1
              className="mt-4 font-display font-semibold leading-[1] text-navy"
              style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)" }}
            >
              What I<br /><span className="italic">build</span>
            </h1>
            <p className="mt-6 max-w-lg font-display text-lg italic text-charcoal/50">
              Startups, dashboards, games, and experiments. Each one taught me
              something the last one couldn&apos;t.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Uniform grid: 1 / 2 / 3 columns, identical tiles at every width */}
      <section className="pb-32 pt-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
