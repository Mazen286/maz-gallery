"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import Link from "next/link"
import { GALLERY, photoSlug } from "@/lib/gallery"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SwipeCarousel } from "./swipe-carousel"

interface GalleryGridProps {
  filterLocation?: string | null
  images?: typeof GALLERY
}

function GalleryImage({ src, alt, width, height, onClick }: {
  src: string; alt: string; width: number; height: number; onClick: () => void
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05, once: true })

  return (
    <div ref={ref}>
      <button
        onClick={onClick}
        className="mb-4 block w-full overflow-hidden transition-all duration-700 hover:scale-[1.02]"
        style={{
          filter: isVisible ? "grayscale(0)" : "grayscale(1)",
          opacity: isVisible ? 1 : 0.6,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
          loading="lazy"
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
        />
      </button>
    </div>
  )
}

export function GalleryGrid({ filterLocation, images: imagesProp }: GalleryGridProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [storyOpen, setStoryOpen] = useState(false)
  const select = (i: number | null) => {
    setSelected(i)
    setStoryOpen(false)
  }

  const base = imagesProp ?? GALLERY
  const images = filterLocation
    ? base.filter((img) => img.location === filterLocation)
    : base

  // Escape closes; left/right are handled by the carousel
  useEffect(() => {
    if (selected === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selected])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selected !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [selected])

  if (images.length === 0) {
    return (
      <p className="py-20 text-center text-mist">
        No photos found for this location.
      </p>
    )
  }

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {images.map((img, i) => (
          <GalleryImage
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            onClick={() => select(i)}
          />
        ))}
      </div>

      {/* Depth-of-field Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => select(null)}
          style={{
            animation: "lightboxIn 0.4s ease-out forwards",
          }}
        >
          {/* Blurred background layer */}
          <div
            className="absolute inset-0 bg-wall/90 backdrop-blur-md"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          />

          {/* Close button */}
          <button
            onClick={() => select(null)}
            className="absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full bg-wall-3/80 text-ivory backdrop-blur-sm transition-colors hover:bg-wall-3"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>

          {/* Swipeable image + story */}
          <div
            className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <SwipeCarousel
              images={images}
              index={selected}
              onIndexChange={(i) => select(i)}
              heightClass="h-[64vh]"
            />

            <div className="max-w-lg px-4 pb-2 text-center">
              {images[selected].location && <p className="label text-brass">{images[selected].location}</p>}
              <h3 className="mt-2 font-display text-xl italic text-ivory">
                {images[selected].alt}
              </h3>
              {images[selected].story && (
                <>
                  <p className={`mt-2 text-sm leading-relaxed text-mist ${storyOpen ? "" : "line-clamp-3"}`}>
                    {images[selected].story}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStoryOpen((o) => !o)}
                    className="mt-1 inline-flex min-h-11 items-center text-[13px] font-semibold text-brass-2 underline-offset-4 hover:underline"
                    aria-expanded={storyOpen}
                  >
                    {storyOpen ? "Less" : "Read the story"}
                  </button>
                </>
              )}
              <p className="mt-2 text-[13px] tabular-nums text-mist-2">
                {selected + 1} of {images.length}
              </p>
              <Link href={`/gallery/${photoSlug(images[selected])}`} className="link-arrow mt-3 text-ivory">
                Open this photograph
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
