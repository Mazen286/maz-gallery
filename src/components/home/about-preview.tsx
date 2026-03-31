import { StaggerText } from "@/components/shared/reveals/stagger-text"
import { FadeIn } from "@/components/shared/fade-in"

export function AboutPreview() {
  return (
    <section id="about" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            About Mazen
          </p>
        </FadeIn>
        <StaggerText
          text="I'm a data analyst and photographer based in San Diego. I studied structural engineering, got my MBA at UC San Diego, co-founded a tech startup, and somewhere along the way picked up a camera. Now I spend my days turning messy datasets into clear decisions, and my evenings turning interesting scenes into photographs."
          className="mt-6 text-xl leading-relaxed text-charcoal sm:text-2xl"
          delay={200}
        />
      </div>
    </section>
  )
}
