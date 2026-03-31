"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { GALLERY } from "@/lib/gallery"

export function GalleryGrid() {
  const [selected, setSelected] = useState<number | null>(null)

  if (GALLERY.length === 0) {
    return (
      <p className="py-20 text-center text-charcoal/50">
        Gallery images coming soon.
      </p>
    )
  }

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {GALLERY.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setSelected(i)}
            className="mb-4 block w-full overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              className="h-auto w-full"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 text-white/70 hover:text-white"
            aria-label="Close"
          >
            <X className="size-8" />
          </button>
          <Image
            src={GALLERY[selected].src}
            alt={GALLERY[selected].alt}
            width={GALLERY[selected].width}
            height={GALLERY[selected].height}
            className="max-h-[90vh] w-auto rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {GALLERY[selected].location && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {GALLERY[selected].location}
            </p>
          )}
        </div>
      )}
    </>
  )
}
