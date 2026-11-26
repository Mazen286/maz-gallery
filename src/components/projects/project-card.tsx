import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/lib/projects"

// One card in the Projects Wing (and on the entrance). The art is drawn in
// the 1200x630 shape most of it was made in, so nothing is letterboxed or
// cut; the line under the title is written to fit, never clamped.
export function ProjectCard({
  project,
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 45vw, 92vw",
  showTags = true,
}: {
  project: Project
  sizes?: string
  showTags?: boolean
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[1200/630] overflow-hidden bg-paper-2 shadow-[0_0_0_1px_var(--line)]">
        <Image
          src={project.image}
          alt={`${project.title}: ${project.line}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes={sizes}
        />
      </div>
      <p className="label mt-5 text-brass-ink">{project.subtitle}</p>
      <h3 className="mt-2 flex items-baseline justify-between gap-3 font-display text-[24px] leading-tight text-ink">
        <span>{project.title}</span>
        <span aria-hidden="true" className="text-base text-ink-3 transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{project.line}</p>
      {showTags && <p className="mt-3 text-[13px] text-ink-3">{project.tags.slice(0, 3).join(" · ")}</p>}
    </Link>
  )
}
