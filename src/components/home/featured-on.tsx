import { PRESS } from "@/lib/constants"

// Logos sized by eye, so a square badge and a wide wordmark read at the same weight
const HEIGHTS: Record<string, string> = {
  "SD Voyager": "h-8 sm:h-9",
  "ABC 10 News San Diego": "h-12 sm:h-14",
  "UC San Diego": "h-12 sm:h-14",
}

export function FeaturedOn() {
  return (
    <section id="featured" className="bg-paper py-16 text-ink sm:py-20">
      <div className="mx-auto flex max-w-[1312px] flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <h2 className="label text-ink-2">As featured in</h2>
        <ul className="flex flex-wrap items-center gap-x-12 gap-y-6">
          {PRESS.map((outlet) => (
            <li key={outlet.name}>
              <a
                href={outlet.url}
                target="_blank"
                rel="external noopener noreferrer"
                className="block opacity-80 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={outlet.logo}
                  alt={`Featured in ${outlet.name}`}
                  loading="lazy"
                  decoding="async"
                  className={`w-auto object-contain ${HEIGHTS[outlet.name] ?? "h-12"}`}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
