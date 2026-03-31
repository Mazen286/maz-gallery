import { PRESS } from "@/lib/constants"
import { PhotoDevelop } from "@/components/shared/reveals/photo-develop"
import { FadeIn } from "@/components/shared/fade-in"

export function FeaturedOn() {
  return (
    <section id="featured" className="bg-cream py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
            As Featured On
          </h2>
        </FadeIn>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-12">
          {PRESS.map((outlet, i) => (
            <PhotoDevelop key={outlet.name} delay={i * 200}>
              <a
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
            </PhotoDevelop>
          ))}
        </div>
      </div>
    </section>
  )
}
