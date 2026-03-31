"use client"

import { useState, useCallback } from "react"
import { Shuffle, Grid3x3, Eye, Sparkles, DoorOpen, Puzzle } from "lucide-react"
import { GALLERY } from "@/lib/gallery"
import { GalleryIntro } from "./gallery-intro"
import { ExhibitionView } from "./exhibition-view"
import { GalleryGrid } from "./gallery-grid"
import { MemorySpace } from "./memory-space"
import { PortalRooms } from "./portal-rooms"
import { JigsawPuzzle } from "./jigsaw-puzzle"

type ViewMode = "exhibition" | "grid" | "memory" | "portal" | "surprise"

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: typeof Eye }[] = [
  { mode: "exhibition", label: "Exhibition", icon: Eye },
  { mode: "grid", label: "Grid", icon: Grid3x3 },
  { mode: "memory", label: "Memory Space", icon: Sparkles },
  { mode: "portal", label: "Portal", icon: DoorOpen },
]

export function GalleryPageClient() {
  const [introComplete, setIntroComplete] = useState(false)
  const [view, setView] = useState<ViewMode>("exhibition")
  const [surpriseIndex, setSurpriseIndex] = useState<number | null>(null)
  const [puzzleIndex, setPuzzleIndex] = useState<number | null>(null)

  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])
  const handleSurprise = () => {
    const idx = Math.floor(Math.random() * GALLERY.length)
    setSurpriseIndex(idx)
    setView("surprise")
  }

  const surprisePhoto = surpriseIndex !== null ? GALLERY[surpriseIndex] : null

  return (
    <>
      {/* Intro overlay */}
      {!introComplete && <GalleryIntro onComplete={handleIntroComplete} />}

      {/* Surprise Me overlay */}
      {view === "surprise" && surprisePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-8"
          onClick={() => setView("exhibition")}
        >
          <div
            className="max-w-4xl text-center"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "imageFloatIn 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards" }}
          >
            <img
              src={surprisePhoto.src}
              alt={surprisePhoto.alt}
              className="mx-auto max-h-[70vh] w-auto rounded-lg shadow-2xl"
            />
            {surprisePhoto.location && (
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-teal">
                {surprisePhoto.location}
              </p>
            )}
            <p className="mt-2 text-sm text-white/40">{surprisePhoto.alt}</p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={handleSurprise}
                className="rounded-full border border-teal/30 px-6 py-2 text-sm text-teal transition-all hover:bg-teal/10"
              >
                Another One
              </button>
              <button
                onClick={() => setView("exhibition")}
                className="rounded-full border border-white/20 px-6 py-2 text-sm text-white/50 transition-all hover:text-white"
              >
                Back to Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-charcoal pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-white sm:text-6xl">Gallery</h1>
          <p className="mt-4 text-lg text-white/50">
            Places I&apos;ve been. Moments I couldn&apos;t let go of.
          </p>
        </div>

        {/* View switcher */}
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2 px-6">
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
        <ExhibitionView images={GALLERY} />
      )}

      {view === "grid" && (
        <section className="bg-charcoal pb-24 pt-12 sm:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <GalleryGrid />
          </div>
        </section>
      )}

      {view === "memory" && (
        <MemorySpace images={GALLERY} />
      )}

      {view === "portal" && (
        <PortalRooms images={GALLERY} />
      )}

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
