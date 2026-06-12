import Image from "next/image"
import Link from "next/link"
import { GALLERY } from "@/lib/gallery"
import { FadeIn } from "@/components/shared/fade-in"

// Hand-picked pieces for the entrance wall, varied in subject and place
const PICK_SRCS = [
  "/images/gallery/NewYork-2-Edit.jpg",
  "/images/gallery/Istanbul-1.jpg",
  "/images/gallery/Jordan-3.jpg",
  "/images/gallery/Alanya-(9-of-20).jpg",
]

const OFFSETS = ["", "md:mt-16", "md:-mt-6", "md:mt-10"]

export function FeaturedExhibits() {
  const picks = PICK_SRCS.map((src) => GALLERY.find((img) => img.src === src)).filter(
    (img): img is NonNullable<typeof img> => !!img
  )

  return (
    <section id="collection" className="bg-[#0a0c11] pb-20 pt-10 sm:pb-28">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <p className="max-w-md text-lg leading-relaxed text-white/50">
            A few pieces from the entrance wall. The rest hang one room over.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-14">
          {picks.map((img, i) => (
            <FadeIn key={img.src} delay={i * 150}>
              <Link
                href={`/gallery?piece=${encodeURIComponent(img.src)}`}
                className={`group block ${OFFSETS[i]}`}
              >
                <figure>
                  <div className="border border-[#a08c5f]/35 bg-[#efece4] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(255,214,150,0.08)] sm:p-4">
                    <div className="overflow-hidden">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 90vw, 45vw"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="font-display text-sm italic text-white/75">
                      {img.alt}
                    </span>
                    {img.location && (
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-teal/60">
                        {img.location}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={300}>
          <div className="mt-16 flex flex-col items-center gap-3">
            <Link
              href="/gallery"
              className="rounded-full border-2 border-teal/50 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-teal transition-colors hover:bg-teal/10"
            >
              Enter the Gallery
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              {GALLERY.length} works on display
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
