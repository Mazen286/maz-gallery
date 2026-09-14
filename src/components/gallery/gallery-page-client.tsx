"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Shuffle, Grid3x3, Eye, Gamepad2, ArrowLeft, CalendarDays, MapPin } from "lucide-react"
import { GALLERY, LOCATIONS, ORDERED_GALLERY, wingLabel, wingSlug, type GalleryImage } from "@/lib/gallery"
import { ExhibitionView } from "./exhibition-view"
import { GalleryGrid } from "./gallery-grid"
import { LocationMap } from "./location-map"

// Wing tiles and chips use a short slug in the URL: /gallery?wing=alanya
const locFromSlug = (slug: string | null) => LOCATIONS.find((loc) => wingSlug(loc) === slug) ?? null

type ViewMode = "wings" | "map" | "exhibition" | "grid"

const VIEWS: ViewMode[] = ["wings", "map", "exhibition", "grid"]

export function GalleryPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const ordered = ORDERED_GALLERY

  const wings = useMemo(
    () =>
      LOCATIONS.map((loc) => ({
        loc,
        images: GALLERY.filter((img) => img.location === loc),
      })),
    [],
  )

  // Initial state comes from the URL so a refreshed or shared link lands on
  // the same view. ?piece=<src> is the older deep-link form and still works.
  const [view, setView] = useState<ViewMode>(() => {
    const v = searchParams.get("view")
    if (searchParams.get("piece")) return "exhibition"
    return VIEWS.includes(v as ViewMode) ? (v as ViewMode) : "wings"
  })
  const [location, setLocation] = useState<string | null>(() => locFromSlug(searchParams.get("wing")))
  const [exhibitionStart, setExhibitionStart] = useState(() => {
    const piece = searchParams.get("piece")
    if (piece) {
      const idx = ordered.findIndex((img) => img.src === piece)
      if (idx >= 0) return idx
    }
    const i = Number(searchParams.get("i"))
    return Number.isInteger(i) && i >= 0 ? i : 0
  })
  const [liveIndex, setLiveIndex] = useState(exhibitionStart)

  const visible: GalleryImage[] = useMemo(
    () => (location ? ordered.filter((img) => img.location === location) : ordered),
    [ordered, location],
  )

  // Mirror state into the URL (replace, no scroll) so back/refresh/share work
  const lastUrl = useRef<string | null>(null)
  useEffect(() => {
    const params = new URLSearchParams()
    if (view !== "wings") params.set("view", view)
    if (location) params.set("wing", wingSlug(location))
    if (view === "exhibition" && liveIndex > 0) params.set("i", String(liveIndex))
    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    if (url === lastUrl.current) return
    lastUrl.current = url
    router.replace(url, { scroll: false })
  }, [view, location, liveIndex, pathname, router])

  const openWing = (loc: string) => {
    setLocation(loc)
    setExhibitionStart(0)
    setLiveIndex(0)
    setView("exhibition")
  }

  const switchLocation = (loc: string | null) => {
    setLocation(loc)
    setExhibitionStart(0)
    setLiveIndex(0)
  }

  const handleSurprise = () => {
    const idx = Math.floor(Math.random() * ordered.length)
    setLocation(null)
    setExhibitionStart(idx)
    setLiveIndex(idx)
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
                onClick={() => { switchLocation(null); setView("map") }}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:border-white/30 hover:text-white/80"
              >
                <MapPin className="size-3.5" />
                The Map
              </button>
            </div>

            {/* The Annex: games and the daily puzzle get their own shelf */}
            <div className="mt-14 border-t border-white/[0.08] pt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
                The Annex &middot; After hours
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/annex"
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-all hover:border-teal/50 hover:bg-white/[0.05]"
                >
                  <span>
                    <span className="flex items-center gap-2 font-display text-lg italic text-white">
                      <Gamepad2 className="size-4 text-teal" />
                      The Game Room
                    </span>
                    <span className="mt-1 block text-xs text-white/45">
                      Jigsaw, Pairs, Postcards, and Pin the Map, all built from the collection.
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-teal">Open</span>
                </Link>
                <Link
                  href="/daily"
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-all hover:border-teal/50 hover:bg-white/[0.05]"
                >
                  <span>
                    <span className="flex items-center gap-2 font-display text-lg italic text-white">
                      <CalendarDays className="size-4 text-teal" />
                      The Daily Postcard
                    </span>
                    <span className="mt-1 block text-xs text-white/45">
                      One photo, three guesses, a new one every day.
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-teal">Play</span>
                </Link>
              </div>
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
      {view === "map" && (
        <section className="bg-[#0a0c11] pb-20 pt-12">
          <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
            Pick a pin to walk that wing
          </p>
          <LocationMap
            activeLocation={location}
            onSelectLocation={(loc) => (loc ? openWing(loc) : setView("wings"))}
          />
        </section>
      )}

      {view === "exhibition" && (
        <ExhibitionView
          key={`${location ?? "all"}-${exhibitionStart}`}
          images={visible}
          startIndex={Math.min(exhibitionStart, Math.max(visible.length - 1, 0))}
          onIndexChange={setLiveIndex}
        />
      )}

      {view === "grid" && (
        <section className="bg-charcoal pb-24 pt-12 sm:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <GalleryGrid images={visible} />
          </div>
        </section>
      )}

    </>
  )
}
