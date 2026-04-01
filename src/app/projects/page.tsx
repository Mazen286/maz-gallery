import type { Metadata } from "next"
import Image from "next/image"
import { FadeIn } from "@/components/shared/fade-in"
import { ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Projects | Figment Analytics, SurfUp, and More",
  description:
    "Explore my projects: Figment Analytics, SurfUp, LA 311, FlightPulse, Figment Gaming, Runes & Reagents, and more.",
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

const PROJECTS = [
  {
    title: "Figment Analytics",
    subtitle: "Data Consultancy",
    description:
      "My data consultancy. We help businesses build dashboards, run workshops, and make better decisions with their data.",
    url: "https://figmentanalytics.com",
    image: "/images/projects/figment-analytics.png",
    cta: "Visit Site",
    tags: ["Tableau", "Power BI", "Data Strategy", "Workshops"],
    accent: "#78c8d6",
  },
  {
    title: "SurfUp",
    subtitle: "Hardware Startup",
    description:
      "The startup I co-founded. Automated surfboard rental stations across San Diego. Featured on ABC 10 News, CBS 8, and the San Diego Union-Tribune.",
    url: "https://surfupapp.com",
    image: "/images/projects/surfup-banner.png",
    cta: "See It Live",
    tags: ["React Native", "TypeScript", "Square", "Maps"],
    accent: "#4ecdc4",
  },
  {
    title: "LA 311 Dashboard",
    subtitle: "Civic Data Analytics",
    description:
      "Interactive analytics from 369,000+ City of LA service requests. Time-series analysis, geographic mapping, and resolution tracking.",
    url: "https://figmentanalytics.com/portfolio/la-311",
    image: "/images/projects/la-311.webp",
    cta: "View Project",
    tags: ["Next.js", "Recharts", "Mapbox GL JS"],
    accent: "#f5a623",
  },
  {
    title: "FlightPulse",
    subtitle: "Geospatial Analytics",
    description:
      "Interactive flight tracking that brings aircraft data to life on the map. Temporal filtering, altitude coloring, and individual tracking.",
    url: "https://figmentanalytics.com/portfolio/flightpulse",
    image: "/images/projects/flightpulse.png",
    cta: "View Project",
    tags: ["React", "TypeScript", "Mapbox GL JS"],
    accent: "#5b8def",
  },
  {
    title: "Figment Forge",
    subtitle: "Retail Analytics",
    description:
      "Power BI dashboard tracking $1.18M+ in revenue across 109K+ orders. ML-driven forecasts and customer segmentation.",
    url: "https://figmentanalytics.com/portfolio/figment-forge",
    image: "/images/projects/figment-forge.png",
    cta: "View Project",
    tags: ["Power BI", "Python", "ML", "SQL"],
    accent: "#e06c75",
  },
  {
    title: "Figment Gaming",
    subtitle: "Multi-Game Platform",
    description:
      "Free companion platform for tabletop gamers. 7+ game systems, multiplayer drafting, AI opponents, and deck building.",
    url: "https://figmentgaming.com",
    image: "/images/projects/figment-gaming.png",
    cta: "Play Now",
    tags: ["React 19", "Supabase", "Cloudflare Workers"],
    accent: "#b464ff",
  },
  {
    title: "Runes & Reagents",
    subtitle: "Adventure Game",
    description:
      "Gather elements, combine them to craft powerful items, complete quests, and explore an adventure world.",
    url: "https://runesandreagents.netlify.app",
    image: "/images/projects/runes-reagents.png",
    cta: "Play It",
    tags: ["Game Design", "React", "Crafting"],
    accent: "#c678dd",
  },
]

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number]
  index: number
}) {
  return (
    <FadeIn delay={index * 80}>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Subtitle */}
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: project.accent }}
          >
            {project.subtitle}
          </p>

          {/* Title */}
          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            {project.title}
          </h2>

          {/* Description */}
          <p className="mt-3 text-[15px] leading-relaxed text-charcoal/60">
            {project.description}
          </p>

          {/* Tags + CTA */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-navy/10 px-3 py-1 text-[11px] font-medium text-navy/50"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-navy/60 transition-all duration-300 group-hover:gap-2.5 group-hover:text-navy">
              {project.cta}
              <ExternalLink className="size-3.5" />
            </span>
          </div>
        </div>

        {/* Accent bottom line */}
        <div
          className="h-[3px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ backgroundColor: project.accent }}
        />
      </a>
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
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              Portfolio
            </p>
            <h1
              className="mt-4 font-bold leading-[0.95] text-navy"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
            >
              WHAT I<br />BUILD
            </h1>
            <p className="mt-6 max-w-lg text-lg text-charcoal/50">
              Startups, dashboards, games, and experiments. Each one taught me
              something the last one couldn&apos;t.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Featured projects - full width */}
      <section className="bg-white pb-6 pt-4">
        <div className="mx-auto max-w-6xl px-6 space-y-6">
          {PROJECTS.slice(0, 2).map((project, i) => (
            <FadeIn key={project.title} delay={i * 100}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[2.2/1] overflow-hidden bg-slate-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="100vw"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                        style={{ color: project.accent }}
                      >
                        {project.subtitle}
                      </p>
                      <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
                        {project.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-charcoal/60">
                        {project.description}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-navy/60 transition-all duration-300 group-hover:gap-2.5 group-hover:text-navy">
                      {project.cta}
                      <ExternalLink className="size-3.5" />
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-navy/10 px-3 py-1 text-[11px] font-medium text-navy/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="h-[3px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: project.accent }}
                />
              </a>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Grid projects */}
      <section className="pb-32 pt-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {PROJECTS.slice(2).map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
