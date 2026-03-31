import type { Metadata } from "next"
import Image from "next/image"
import { FadeIn } from "@/components/shared/fade-in"

export const metadata: Metadata = {
  title: "My Projects",
  description: "Explore my projects: Figment Analytics, SurfUp, Runes & Reagents, and more.",
  alternates: { canonical: "/projects" },
}

const PROJECTS = [
  {
    title: "Figment Analytics",
    description:
      "My data consultancy. We help businesses build dashboards, run workshops, and make better decisions with their data. The 6-Step Dashboard System is our flagship course.",
    url: "https://figment-analytics.com",
    image: "/images/projects/Mockup-Thumbnail-6-Step-Dashboard-System.jpg",
    cta: "Learn More",
  },
  {
    title: "SurfUp",
    description:
      "The startup I co-founded. We built automated surfboard rental stations (SurfPods) across San Diego. Download the app, unlock a board, and you're in the water in 60 seconds.",
    url: "https://surfupapp.com",
    image: "/images/projects/Dashboard-Image.png",
    cta: "See It Live",
  },
  {
    title: "Runes & Reagents",
    description:
      "A card game I designed about alchemy and strategy. Collect ingredients, brew potions, sabotage your friends. Currently playable online.",
    url: "https://runesandreagents.netlify.app",
    image: "/images/projects/1.png",
    cta: "Play It",
  },
]

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-white pb-8 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold text-navy sm:text-5xl">
            Things I&apos;ve Built
          </h1>
          <p className="mt-4 text-lg text-charcoal/60">
            Side projects, startups, and experiments that keep me busy.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-24">
            {PROJECTS.map((project, i) => (
              <FadeIn key={project.title} delay={i * 100}>
                <div
                  className={`grid items-center gap-12 lg:grid-cols-2 ${
                    i % 2 === 1 ? "lg:direction-rtl" : ""
                  }`}
                >
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="overflow-hidden rounded-2xl">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={700}
                        height={500}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="text-3xl font-bold text-navy">{project.title}</h2>
                    <p className="mt-4 text-lg leading-relaxed text-charcoal/80">
                      {project.description}
                    </p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block rounded-sm border-2 border-navy px-8 py-3 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:bg-navy hover:text-white"
                    >
                      {project.cta}
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
