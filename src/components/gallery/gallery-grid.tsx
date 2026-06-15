"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { GALLERY } from "@/lib/gallery"
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
        className="mb-4 block w-full overflow-hidden rounded-lg transition-all duration-700 hover:scale-[1.02]"
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
        />
      </button>
    </div>
  )
}

export function GalleryGrid({ filterLocation, images: imagesProp }: GalleryGridProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const base = imagesProp ?? GALLERY
  const images = filterLocation
    ? base.filter((img) => img.location === filterLocation)
    : base

  // Escape closes; left/right are handled by the carousel
  useEffect(() => {
    if (selected === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
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
      <p className="py-20 text-center text-white/50">
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
            onClick={() => setSelected(i)}
          />
        ))}
      </div>

      {/* Depth-of-field Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          style={{
            animation: "lightboxIn 0.4s ease-out forwards",
          }}
        >
          {/* Blurred background layer */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          />

          {/* Close button */}
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
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
              onIndexChange={(i) => setSelected(i)}
              heightClass="h-[64vh]"
            />

            <div className="max-w-lg px-4 pb-2 text-center">
              {images[selected].location && (
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
                  {images[selected].location}
                </p>
              )}
              <h3 className="mt-1.5 font-display text-lg italic text-white">
                {images[selected].alt}
              </h3>
              {images[selected].story && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/45">
                  {images[selected].story}
                </p>
              )}
              <p className="mt-3 font-mono text-[9px] text-white/25">
                {selected + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
