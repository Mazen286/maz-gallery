import type { Metadata } from "next"
import Image from "next/image"
import { FadeIn } from "@/components/shared/fade-in"
import { PROJECTS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "My Projects",
  description: "Explore my projects: Figment Analytics, SurfUp, Runes & Reagents, and more.",
  alternates: { canonical: "/projects" },
}

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-charcoal pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-white sm:text-6xl">
            My Projects
          </h1>
          <p className="mt-4 text-lg text-white/70">
            A collection of things I&apos;ve built and contributed to.
          </p>
        </div>
      </section>

      <section className="bg-charcoal py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <FadeIn key={project.title} delay={i * 100}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-teal/30 hover:bg-white/10"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white">{project.title}</h2>
                    <p className="mt-2 text-sm text-white/60">{project.description}</p>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
