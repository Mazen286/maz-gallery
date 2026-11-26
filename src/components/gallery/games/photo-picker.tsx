"use client"

import Image from "next/image"
import { ArrowLeft, Shuffle } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"

interface PhotoPickerProps {
  images: GalleryImage[]
  onPick: (image: GalleryImage) => void
  onBack: () => void
}

export function PhotoPicker({ images, onPick, onBack }: PhotoPickerProps) {
  const surprise = () => onPick(images[Math.floor(Math.random() * images.length)])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={onBack}
          className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-[13px] font-medium text-mist transition-colors hover:text-ivory"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          The Annex
        </button>
        <button
          onClick={surprise}
          className="btn btn-line text-ivory"
        >
          <Shuffle className="size-4" aria-hidden="true" />
          Surprise me
        </button>
      </div>

      <div className="px-5 sm:px-8">
        <p className="label text-brass">
          Choose a piece
        </p>
        <h2 className="mt-2 font-display text-2xl italic text-ivory sm:text-3xl">
          Pick from the collection
        </h2>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto px-5 pb-8 sm:px-8">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-7">
          {images.map((img) => (
            <button
              key={img.src}
              onClick={() => onPick(img)}
              className="group relative aspect-square overflow-hidden border border-wall-line transition-colors hover:border-brass focus-visible:border-brass"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) calc((100vw - 56px) / 3), (max-width: 1024px) calc((100vw - 112px) / 5), calc((100vw - 136px) / 7)"
              />
              {img.location && (
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-1.5 pb-1 pt-5 text-left text-[11px] text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {img.location}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
