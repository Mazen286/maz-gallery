import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHead } from "@/components/shared/section-head"
import { FIGMENT_URL } from "@/lib/constants"

// One paragraph, one line of what to do next. The full story lives on /about.
export function Introduction() {
  return (
    <section id="about" className="bg-paper pb-8 pt-20 text-ink sm:pt-28">
      <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
        <SectionHead number="No. 02" title="The Artist" />
        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1fr_20rem] lg:gap-20">
          <FadeIn>
            <p className="max-w-[46rem] font-display text-[22px] leading-[1.55] text-ink sm:text-[26px]">
              I&apos;m a data analyst and photographer in San Diego. I studied structural engineering, got an MBA at
              UC San Diego, co-founded a surfboard rental startup, and picked up a camera somewhere along the way.
              Days go to turning messy datasets into clear decisions. Evenings go to the photographs in the next room.
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="border-l border-brass-ink/40 pl-6">
              <p className="font-display text-lg italic leading-relaxed text-ink-2">
                Numbers don&apos;t lie, but they don&apos;t speak either. Someone has to give them a voice.
              </p>
              <Link href="/about" className="link-arrow mt-6 text-ink">
                The full story
              </Link>
              <p className="mt-5 text-sm leading-relaxed text-ink-2">
                Need data work?{" "}
                <a
                  href={FIGMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink underline decoration-brass-ink/50 underline-offset-4 hover:decoration-ink"
                >
                  That&apos;s Figment Analytics
                </a>
                .
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
