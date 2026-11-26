import Link from "next/link"
import { ALL_PROJECTS } from "@/lib/projects"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHead } from "@/components/shared/section-head"
import { ProjectCard } from "@/components/projects/project-card"

// Three projects with strong art, one from each room of the wing
const PICKS = ["surfup", "figment-forever", "runes-brewstorm"]

export function SelectedWorks() {
  const picks = PICKS.map((slug) => ALL_PROJECTS.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => !!p
  )
  return (
    <section id="works" className="bg-paper pb-24 pt-16 text-ink sm:pb-32 sm:pt-24">
      <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
        <SectionHead number="No. 04" title="Projects Wing" />

        <div className="mt-10 flex flex-col gap-8 sm:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl font-display text-[32px] leading-[1.15] tracking-[-0.01em] sm:text-[44px]">
            Things I build when the camera is charging.{" "}
            <span className="italic text-brass-ink">Startups, dashboards and games.</span>
          </h2>
          <Link href="/projects" className="btn btn-ink shrink-0 self-start lg:self-auto">
            The Projects Wing
          </Link>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {picks.map((project, i) => (
            <FadeIn key={project.slug} delay={i * 120}>
              <ProjectCard project={project} showTags={false} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
