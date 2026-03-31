"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { GALLERY } from "@/lib/gallery"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface GalleryGridProps {
  filterLocation?: string | null
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

export function GalleryGrid({ filterLocation }: GalleryGridProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const images = filterLocation
    ? GALLERY.filter((img) => img.location === filterLocation)
    : GALLERY

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      if (selected === null) return
      if (direction === "prev") {
        setSelected(selected > 0 ? selected - 1 : images.length - 1)
      } else {
        setSelected(selected < images.length - 1 ? selected + 1 : 0)
      }
    },
    [selected, images.length]
  )

  // Keyboard navigation
  useEffect(() => {
    if (selected === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
      if (e.key === "ArrowLeft") navigate("prev")
      if (e.key === "ArrowRight") navigate("next")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selected, navigate])

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
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate("prev") }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate("next") }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Next photo"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Image + story panel */}
          <div
            className="pointer-events-none relative z-10 mx-auto flex max-h-[92vh] max-w-3xl flex-col items-center gap-4 overflow-y-auto px-6 py-4"
          >
            <div
              className="pointer-events-auto flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "imageFloatIn 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards" }}
            >
              <Image
                src={images[selected].src}
                alt={images[selected].alt}
                width={images[selected].width}
                height={images[selected].height}
                className="max-h-[50vh] max-w-[90vw] w-auto rounded-lg object-contain shadow-2xl"
                priority
              />
            </div>

            <div
              className="pointer-events-auto max-w-lg pb-6 text-center"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "fadeSlideIn 0.6s ease-out 0.2s both" }}
            >
              {images[selected].location && (
                <p className="text-[10px] uppercase tracking-[0.4em] text-teal/70">
                  {images[selected].location}
                </p>
              )}
              <h3 className="mt-1.5 text-lg font-bold text-white">
                {images[selected].alt}
              </h3>
              {images[selected].story && (
                <p className="mt-3 text-sm leading-relaxed text-white/45 italic">
                  {images[selected].story}
                </p>
              )}
              <p className="mt-3 font-mono text-[9px] text-white/20">
                {selected + 1} / {images.length} &middot; arrow keys to navigate
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
