"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Shuffle, Grid3x3, Eye, Gamepad2, ArrowLeft, CalendarDays } from "lucide-react"
import { GALLERY, LOCATION_COORDS, type GalleryImage } from "@/lib/gallery"
import { ExhibitionView } from "./exhibition-view"
import { GalleryGrid } from "./gallery-grid"
import { GameRoom } from "./games/game-room"

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

// Deliberate walking order through the collection: Turkey, Jordan,
// then east coast to west. Data-file order stops mattering.
const WING_ORDER = [
  "Alanya, Turkey",
  "Antalya, Turkey",
  "Istanbul, Turkey",
  "Izmir, Turkey",
  "Cesme, Turkey",
  "Turkey",
  "Amman, Jordan",
  "New York, NY",
  "San Diego, CA",
  "Catalina Island, CA",
  "Disneyland, CA",
  "Walt Disney World, FL",
]

const wingLabel = (loc: string) => LOCATION_COORDS[loc]?.label ?? loc

type ViewMode = "wings" | "exhibition" | "grid"

export function GalleryPageClient() {
  const [view, setView] = useState<ViewMode>("wings")
  const [location, setLocation] = useState<string | null>(null)
  const [exhibitionStart, setExhibitionStart] = useState(0)
  const [gameRoomOpen, setGameRoomOpen] = useState(false)

  // The full collection in walking order
  const ordered = useMemo(() => {
    const grouped = WING_ORDER.flatMap((loc) => GALLERY.filter((img) => img.location === loc))
    const rest = GALLERY.filter((img) => !img.location || !WING_ORDER.includes(img.location))
    return [...grouped, ...rest]
  }, [])

  const wings = useMemo(
    () =>
      WING_ORDER.map((loc) => ({
        loc,
        images: GALLERY.filter((img) => img.location === loc),
      })).filter((w) => w.images.length > 0),
    []
  )

  const visible: GalleryImage[] = useMemo(
    () => (location ? ordered.filter((img) => img.location === location) : ordered),
    [ordered, location]
  )

  // Deep link: /gallery?piece=<src> opens the exhibition on that photo
  useEffect(() => {
    const piece = new URLSearchParams(window.location.search).get("piece")
    if (!piece) return
    const idx = ordered.findIndex((img) => img.src === piece)
    if (idx >= 0) {
      setLocation(null)
      setExhibitionStart(idx)
      setView("exhibition")
    }
  }, [ordered])

  const openWing = (loc: string) => {
    setLocation(loc)
    setExhibitionStart(0)
    setView("exhibition")
  }

  const switchLocation = (loc: string | null) => {
    setLocation(loc)
    setExhibitionStart(0)
  }

  const handleSurprise = () => {
    setLocation(null)
    setExhibitionStart(Math.floor(Math.random() * ordered.length))
    setView("exhibition")
  }

  const inWings = view === "wings"

  return (
    <>
      {/* Placard header */}
      <section className="bg-[#0a0c11] px-6 pb-10 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal">
            No. 03 &middot; The Gallery
          </p>
          <h1
            className="mt-3 font-display font-semibold leading-[1] text-white"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
          >
            Places I&apos;ve been.
            <br />
            <span className="italic text-white/85">Moments I couldn&apos;t let go of.</span>
          </h1>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
            {GALLERY.length} photographs &middot; {wings.length} places
          </p>
        </div>
      </section>

      {/* Wings index: the orientation home */}
      {inWings && (
        <section className="bg-[#0a0c11] px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {wings.map((wing) => (
                <button
                  key={wing.loc}
                  onClick={() => openWing(wing.loc)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 text-left transition-all hover:border-teal/50"
                >
                  <Image
                    src={wing.images[0].src}
                    alt={wing.images[0].alt}
                    fill
                    className="object-cover opacity-75 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-95"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between px-4 pb-3">
                    <span className="font-display text-lg italic text-white">
                      {wingLabel(wing.loc)}
                    </span>
                    <span className="font-mono text-[10px] text-white/55">
                      {wing.images.length}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => { switchLocation(null); setView("exhibition") }}
                className="flex items-center gap-2 rounded-full border border-teal/40 px-4 py-2 text-xs font-medium text-teal transition-all hover:bg-teal/10"
              >
                <Eye className="size-3.5" />
                Walk the Whole Tour
              </button>
              <button
                onClick={() => { switchLocation(null); setView("grid") }}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white/80"
              >
                <Grid3x3 className="size-3.5" />
                See Everything at Once
              </button>
              <button
                onClick={handleSurprise}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white/80"
              >
                <Shuffle className="size-3.5" />
                Surprise Me
              </button>
              <button
                onClick={() => setGameRoomOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white/80"
              >
                <Gamepad2 className="size-3.5" />
                Game Room
              </button>
              <Link
                href="/daily"
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white/80"
              >
                <CalendarDays className="size-3.5" />
                Daily Postcard
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Viewing controls: back to wings, location chips, view toggle */}
      {!inWings && (
        <section className="sticky top-16 z-30 border-y border-white/[0.06] bg-[#0a0c11]/95 py-3 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-6">
            <button
              onClick={() => setView("wings")}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 transition-all hover:border-white/35 hover:text-white"
            >
              <ArrowLeft className="size-3" />
              Wings
            </button>
            <div className="h-4 w-px shrink-0 bg-white/10" />
            <button
              onClick={() => switchLocation(null)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-all ${
                location === null ? "bg-teal/20 text-teal" : "text-white/45 hover:text-white/80"
              }`}
            >
              All
            </button>
            {wings.map((wing) => (
              <button
                key={wing.loc}
                onClick={() => switchLocation(wing.loc)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-all ${
                  location === wing.loc ? "bg-teal/20 text-teal" : "text-white/45 hover:text-white/80"
                }`}
              >
                {wingLabel(wing.loc)}
              </button>
            ))}
            <div className="h-4 w-px shrink-0 bg-white/10" />
            <button
              onClick={() => setView(view === "exhibition" ? "grid" : "exhibition")}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 transition-all hover:border-white/35 hover:text-white"
              aria-label={view === "exhibition" ? "Switch to grid view" : "Switch to exhibition view"}
            >
              {view === "exhibition" ? <Grid3x3 className="size-3" /> : <Eye className="size-3" />}
              {view === "exhibition" ? "Grid" : "Exhibition"}
            </button>
          </div>
        </section>
      )}

      {/* Views */}
      {view === "exhibition" && (
        <ExhibitionView
          key={`${location ?? "all"}-${exhibitionStart}`}
          images={visible}
          startIndex={Math.min(exhibitionStart, Math.max(visible.length - 1, 0))}
        />
      )}

      {view === "grid" && (
        <section className="bg-charcoal pb-24 pt-12 sm:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <GalleryGrid images={visible} />
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

      {/* Game Room overlay */}
      {gameRoomOpen && <GameRoom onClose={() => setGameRoomOpen(false)} />}
    </>
  )
}
