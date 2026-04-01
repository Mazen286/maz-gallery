"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Shuffle, Grid3x3, Eye, Puzzle } from "lucide-react"
import { GALLERY } from "@/lib/gallery"
import { GalleryIntro } from "./gallery-intro"
import { ExhibitionView } from "./exhibition-view"
import { GalleryGrid } from "./gallery-grid"
import { JigsawPuzzle } from "./jigsaw-puzzle"

const COLLECTION = [
  { src: "/images/collection/IMG_7908.jpeg", alt: "Digital collectible showcase", width: 600, height: 800 },
  { src: "/images/collection/IMG_7895.jpeg", alt: "VeVe collectible display", width: 600, height: 800 },
  { src: "/images/collection/IMG_7903.jpeg", alt: "Digital art piece", width: 600, height: 800 },
  { src: "/images/collection/IMG_7906.jpeg", alt: "Collectible figure", width: 600, height: 800 },
  { src: "/images/collection/IMG_7914.jpeg", alt: "VeVe showcase room", width: 600, height: 800 },
  { src: "/images/collection/IMG_7915.jpeg", alt: "Digital art display", width: 600, height: 800 },
  { src: "/images/collection/IMG_7519.jpeg", alt: "Collectible exhibit", width: 600, height: 800 },
  { src: "/images/collection/IMG_1438.jpg", alt: "Digital art collection", width: 600, height: 800 },
  { src: "/images/collection/IMG_1909.jpg", alt: "VeVe collection piece", width: 600, height: 800 },
  { src: "/images/collection/IMG_0253.jpeg", alt: "Digital showcase", width: 600, height: 800 },
  { src: "/images/collection/IMG_0637.jpeg", alt: "Collectible art", width: 600, height: 800 },
  { src: "/images/collection/IMG_1007.jpeg", alt: "Digital gallery", width: 600, height: 800 },
  { src: "/images/collection/87192.jpg", alt: "VeVe collectible", width: 600, height: 800 },
]

type ViewMode = "exhibition" | "grid"

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: typeof Eye }[] = [
  { mode: "exhibition", label: "Exhibition", icon: Eye },
  { mode: "grid", label: "Grid", icon: Grid3x3 },
]

export function GalleryPageClient() {
  const [introComplete, setIntroComplete] = useState(false)
  const [view, setView] = useState<ViewMode>("exhibition")
  const [exhibitionStart, setExhibitionStart] = useState(0)
  const [puzzleIndex, setPuzzleIndex] = useState<number | null>(null)

  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])
  const handleSurprise = () => {
    setExhibitionStart(Math.floor(Math.random() * GALLERY.length))
    setView("exhibition")
  }

  return (
    <>
      {/* Intro overlay */}
      {!introComplete && <GalleryIntro onComplete={handleIntroComplete} />}

      {/* Header with hero image - full bleed */}
      <section className="relative">
        <div className="relative overflow-hidden">
          <Image
            src="/images/gallery/NewYork-2-Edit.jpg"
            alt="Rainy New York night"
            width={1500}
            height={1000}
            className="h-[340px] w-full object-cover sm:h-[420px] lg:h-[480px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 px-8 pb-10 text-center sm:pb-12">
            <h1 className="text-5xl font-bold text-white sm:text-6xl">Gallery</h1>
            <p className="mt-3 text-lg text-white/60">
              Places I&apos;ve been. Moments I couldn&apos;t let go of.
            </p>
          </div>
        </div>

      </section>

      {/* View switcher - dark strip */}
      <section className="bg-charcoal py-5">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 px-6">
          {VIEW_OPTIONS.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                view === mode
                  ? "bg-teal/20 text-teal"
                  : "border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
          <button
            onClick={handleSurprise}
            className="flex items-center gap-2 rounded-full border border-teal/30 px-4 py-2 text-xs font-medium text-teal transition-all hover:bg-teal/10"
          >
            <Shuffle className="size-3.5" />
            Surprise Me
          </button>
          <button
            onClick={() => setPuzzleIndex(Math.floor(Math.random() * GALLERY.length))}
            className="flex items-center gap-2 rounded-full border border-teal/30 px-4 py-2 text-xs font-medium text-teal transition-all hover:bg-teal/10"
          >
            <Puzzle className="size-3.5" />
            Jigsaw
          </button>
        </div>
      </section>

      {/* Views */}
      {view === "exhibition" && (
        <ExhibitionView key={exhibitionStart} images={GALLERY} startIndex={exhibitionStart} />
      )}

      {view === "grid" && (
        <section className="bg-charcoal pb-24 pt-12 sm:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <GalleryGrid />
          </div>
        </section>
      )}

      {/* Digital Collection - collapsed by default */}
      <section className="bg-charcoal pb-16 pt-8">
        <div className="mx-auto max-w-7xl px-6">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-center gap-3 py-4 text-center list-none">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/25 transition-colors group-open:text-teal/60">
                Digital Collection
              </span>
              <span className="text-white/20 transition-transform duration-300 group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="pt-6">
              <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
                {COLLECTION.map((item) => (
                  <div key={item.src} className="mb-4 break-inside-avoid overflow-hidden rounded-lg">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      className="h-auto w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Jigsaw Puzzle overlay */}
      {puzzleIndex !== null && (
        <JigsawPuzzle
          image={GALLERY[puzzleIndex]}
          onClose={() => setPuzzleIndex(null)}
          onNewImage={() => {
            let next: number
            do { next = Math.floor(Math.random() * GALLERY.length) } while (next === puzzleIndex)
            setPuzzleIndex(next)
          }}
        />
      )}
    </>
  )
}
