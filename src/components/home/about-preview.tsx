import { FadeIn } from "@/components/shared/fade-in"

export function AboutPreview() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            About Mazen
          </p>
          <p className="mt-6 text-xl leading-relaxed text-charcoal sm:text-2xl">
            Mazen Abugharbieh is a Data & Analytics professional and
            photographer from San Diego, known for his work across private and
            public sectors and as a startup co-founder. With an MBA from UC San
            Diego&apos;s Rady School of Management and a background in
            Structural Engineering, he merges analytical rigor with creative
            storytelling.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
