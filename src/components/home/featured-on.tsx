import { PRESS } from "@/lib/constants"
import { FadeIn } from "@/components/shared/fade-in"

export function FeaturedOn() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
            As Featured On
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-12">
            {PRESS.map((outlet) => (
              <a
                key={outlet.name}
                href={outlet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={outlet.logo}
                  alt={outlet.name}
                  className="h-16 w-auto object-contain sm:h-20"
                />
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
