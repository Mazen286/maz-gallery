import Image from "next/image"
import Link from "next/link"
import { GALLERY, photoSlug, wingLabel } from "@/lib/gallery"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHead } from "@/components/shared/section-head"

// Hand-picked pieces for the entrance wall, varied in subject and place
const PICK_SRCS = [
  "/images/gallery/NewYork-2-Edit.jpg",
  "/images/gallery/Istanbul-1.jpg",
  "/images/gallery/Alanya-(9-of-20).jpg",
  "/images/gallery/Jordan-3.jpg",
]

export function FeaturedExhibits() {
  const picks = PICK_SRCS.map((src) => GALLERY.find((img) => img.src === src)).filter(
    (img): img is NonNullable<typeof img> => !!img
  )

  return (
    <section id="collection" className="bg-wall pb-24 pt-20 text-ivory sm:pb-32 sm:pt-28">
      <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
        <SectionHead title="The Gallery" tone="dark" />

        <div className="mt-10 flex flex-col gap-8 sm:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl font-display text-[32px] leading-[1.15] tracking-[-0.01em] sm:text-[44px]">
            A few pieces from the entrance wall.{" "}
            <span className="italic text-brass-2">The rest hang one room over.</span>
          </h2>
          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <Link href="/gallery" className="btn btn-line text-ivory">
              Enter the Gallery
            </Link>
            <p className="text-[13px] text-mist-2">{GALLERY.length} works on display</p>
          </div>
        </div>

        {/* Four works hung at one height: whole photographs in ivory mats */}
        <div className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:gap-x-16 lg:gap-y-20">
          {picks.map((img, i) => (
            <FadeIn key={img.src} delay={(i % 2) * 120}>
              <Link href={`/gallery/${photoSlug(img)}`} className="group block">
                <figure>
                  <div className="frame transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <div className="overflow-hidden">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        sizes="(min-width: 1280px) 560px, (min-width: 640px) 45vw, 90vw"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="font-display text-[17px] italic text-ivory">{img.alt}</span>
                    {img.location && <span className="label shrink-0 text-mist-2">{wingLabel(img.location)}</span>}
                  </figcaption>
                </figure>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
