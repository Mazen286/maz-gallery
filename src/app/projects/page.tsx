import type { Metadata } from "next"
import Image from "next/image"
import { FadeIn } from "@/components/shared/fade-in"
import { ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "My Projects",
  description:
    "Explore my projects: Figment Analytics, SurfUp, LA 311, FlightPulse, Figment Gaming, Runes & Reagents, and more.",
  alternates: { canonical: "/projects" },
}

const PROJECTS = [
  {
    title: "Figment Analytics",
    subtitle: "Data Consultancy",
    description:
      "My data consultancy. We help businesses build dashboards, run workshops, and make better decisions with their data. The 6-Step Dashboard System is our flagship framework.",
    url: "https://figmentanalytics.com",
    image: "/images/projects/figment-analytics.png",
    width: 600, height: 700,
    cta: "Visit Site",
    tags: ["Tableau", "Power BI", "Data Strategy", "Workshops"],
    accent: "#78c8d6",
  },
  {
    title: "SurfUp",
    subtitle: "Hardware Startup",
    description:
      "The startup I co-founded. We built automated surfboard rental stations across San Diego. Download the app, unlock a board, and you're in the water in 60 seconds. Featured on ABC 10 News, CBS 8, and the San Diego Union-Tribune.",
    url: "https://surfupapp.com",
    image: "/images/projects/surfup.webp",
    width: 1600, height: 900,
    cta: "See It Live",
    tags: ["React Native", "IoT", "Next.js", "Stripe"],
    accent: "#4ecdc4",
  },
  {
    title: "LA 311 Dashboard",
    subtitle: "Civic Data Analytics",
    description:
      "An interactive analytics dashboard built from 369,000+ City of LA 311 service requests. Time-series analysis, geographic mapping, neighborhood comparisons, and resolution time breakdowns.",
    url: "https://figmentanalytics.com/portfolio/la-311",
    image: "/images/projects/la-311.webp",
    width: 1600, height: 1066,
    cta: "View Project",
    tags: ["Next.js", "Recharts", "Mapbox GL JS", "SODA API"],
    accent: "#f5a623",
  },
  {
    title: "FlightPulse",
    subtitle: "Geospatial Analytics",
    description:
      "An interactive geospatial flight tracking demo that brings aircraft data to life on the map. Visualizes aircraft positions, flight paths, and altitude data with temporal filtering and altitude-based coloring.",
    url: "https://figmentanalytics.com/portfolio/flightpulse",
    image: "/images/projects/flightpulse.png",
    width: 1200, height: 675,
    cta: "View Project",
    tags: ["React", "TypeScript", "Mapbox GL JS", "GIS"],
    accent: "#5b8def",
  },
  {
    title: "Figment Forge",
    subtitle: "Retail Analytics",
    description:
      "A Power BI analytics dashboard built for a retail client, tracking $1.18M+ in revenue across 109K+ orders. ML-driven sales forecasts, customer segmentation, and real-time inventory tracking.",
    url: "https://figmentanalytics.com/portfolio/figment-forge",
    image: "/images/projects/figment-forge.png",
    width: 1500, height: 836,
    cta: "View Project",
    tags: ["Power BI", "Python", "ML", "DAX", "SQL"],
    accent: "#e06c75",
  },
  {
    title: "Figment Gaming",
    subtitle: "Multi-Game Platform",
    description:
      "A free multi-game companion platform for tabletop gamers with 7+ supported game systems. Real-time multiplayer drafting rooms, AI opponents, deck building tools, and companion apps.",
    url: "https://figmentgaming.com",
    image: "/images/projects/figment-gaming.png",
    width: 1200, height: 675,
    cta: "Play Now",
    tags: ["React 19", "Supabase", "Cloudflare Workers", "AI"],
    accent: "#b464ff",
  },
  {
    title: "Runes & Reagents",
    subtitle: "Adventure Game",
    description:
      "A game I built where you gather elements, combine them to craft powerful items, complete quests, and explore an adventure world. Currently playable online.",
    url: "https://runesandreagents.netlify.app",
    image: "/images/projects/cover.png",
    width: 1024, height: 1024,
    cta: "Play It",
    tags: ["Game Design", "React", "Crafting", "Adventure"],
    accent: "#c678dd",
  },
]

export default function ProjectsPage() {
  return (
    <div className="bg-charcoal">
      {/* Hero */}
      <section className="pb-8 pt-36 sm:pt-44">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-teal">
              Portfolio
            </p>
            <h1 className="mt-4 text-[4rem] font-bold leading-[0.95] text-white sm:text-[6rem] lg:text-[8rem]">
              WHAT I<br />BUILD
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/50">
              Startups, dashboards, games, and experiments. Each one taught me
              something the last one couldn&apos;t.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-32 pt-8">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.title} delay={i * 100}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-[#2a2829] transition-colors duration-500 hover:border-white/[0.12]"
              >
                <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                  {/* Image side */}
                  <div className={`relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={project.width}
                      height={project.height}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Subtle edge gradient blending into content side */}
                    <div className={`absolute inset-0 ${
                      i % 2 === 1
                        ? "bg-gradient-to-l from-transparent via-transparent to-charcoal/30 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-charcoal/30"
                        : "bg-gradient-to-r from-transparent via-transparent to-charcoal/30"
                    }`} />
                  </div>

                  {/* Content side */}
                  <div className={`flex flex-col justify-center p-8 sm:p-10 lg:p-14 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    {/* Accent dot + subtitle */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ backgroundColor: project.accent }}
                      />
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.3em]"
                        style={{ color: project.accent }}
                      >
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Title */}
                    <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                      {project.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-5 text-[15px] leading-relaxed text-white/70">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/45 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/65"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:gap-3"
                        style={{
                          backgroundColor: `${project.accent}20`,
                          color: project.accent,
                        }}
                      >
                        {project.cta}
                        <ExternalLink className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  )
}
