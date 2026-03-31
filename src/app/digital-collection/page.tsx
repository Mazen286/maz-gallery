import type { Metadata } from "next"
import { FadeIn } from "@/components/shared/fade-in"

export const metadata: Metadata = {
  title: "Digital Collection",
  description: "Explore curated digital collectibles and VeVe showcases.",
  alternates: { canonical: "/digital-collection" },
}

export default function DigitalCollectionPage() {
  return (
    <>
      <section className="bg-charcoal pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-white sm:text-6xl">
            Digital Collection
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Explore the future of art and ownership. Curated digital
            collectibles and VeVe showcases.
          </p>
        </div>
      </section>

      <section className="bg-charcoal py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <p className="text-center text-white/50">
              Digital collection showcase coming soon. Content is being migrated
              from the current site.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
