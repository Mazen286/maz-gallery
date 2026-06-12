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
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Game Room
        </button>
        <button
          onClick={surprise}
          className="flex items-center gap-2 rounded-full border border-teal/40 px-4 py-2 text-xs font-medium text-teal transition-all hover:bg-teal/10"
        >
          <Shuffle className="size-3.5" />
          Surprise Me
        </button>
      </div>

      <div className="px-5 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
          Choose a piece
        </p>
        <h2 className="mt-1 font-display text-2xl italic text-white/90 sm:text-3xl">
          Pick from the collection
        </h2>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto px-5 pb-8 sm:px-8">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-7">
          {images.map((img) => (
            <button
              key={img.src}
              onClick={() => onPick(img)}
              className="group relative aspect-square overflow-hidden rounded-md border border-white/10 transition-all hover:border-teal/60 focus-visible:border-teal"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
              />
              {img.location && (
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1 pt-4 text-left text-[9px] text-white/0 transition-colors group-hover:text-white/80">
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
