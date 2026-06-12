import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PROJECTS } from "@/lib/constants"
import { FadeIn } from "@/components/shared/fade-in"

export function SelectedWorks() {
  return (
    <section id="works" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            Selected Works
          </h2>
          <p className="mt-4 max-w-xl font-display text-2xl text-charcoal sm:text-3xl">
            Some things I have built when the camera was charging.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.title} delay={i * 150}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="overflow-hidden rounded-lg border border-border">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={640}
                    height={400}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 90vw, 30vw"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg text-navy transition-colors group-hover:text-teal">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal/60">
                      {project.description}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-charcoal/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" />
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={300}>
          <div className="mt-12">
            <Link
              href="/projects"
              className="inline-block rounded-full border-2 border-navy px-8 py-3 text-sm font-semibold uppercase tracking-wider text-navy transition-colors hover:bg-navy hover:text-white"
            >
              The Projects Wing
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
