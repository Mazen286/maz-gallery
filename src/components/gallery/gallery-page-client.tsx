"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Shuffle, Grid3x3, Eye, Gamepad2, ArrowLeft, CalendarDays, MapPin } from "lucide-react"
import { SectionHead } from "@/components/shared/section-head"
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
  const chip = (on: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-[13px] font-medium transition-colors ${
      on ? "bg-ivory text-wall" : "text-mist hover:text-ivory"
    }`
  const tool = "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-wall-line px-4 text-[13px] font-medium text-mist transition-colors hover:border-ivory/40 hover:text-ivory"

  return (
    <>
      {/* Wings index: the orientation home. Each place hangs as a framed work. */}
      {inWings && (
        <section className="px-5 pb-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1216px]">
            <div className="flex flex-wrap items-center gap-3 border-t border-wall-line pt-8">
              <button onClick={() => { switchLocation(null); setView("exhibition") }} className="btn btn-ivory">
                <Eye className="size-4" aria-hidden="true" />
                Walk the whole tour
              </button>
              <button onClick={() => { switchLocation(null); setView("grid") }} className="btn btn-line text-ivory">
                <Grid3x3 className="size-4" aria-hidden="true" />
                See everything at once
              </button>
              <button onClick={handleSurprise} className="btn btn-line text-ivory">
                <Shuffle className="size-4" aria-hidden="true" />
                Surprise me
              </button>
              <button onClick={() => { switchLocation(null); setView("map") }} className="btn btn-line text-ivory">
                <MapPin className="size-4" aria-hidden="true" />
                The map
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4 lg:gap-y-14">
              {wings.map((wing) => (
                <button key={wing.loc} onClick={() => openWing(wing.loc)} className="group block text-left">
                  <span className="frame block p-1.5 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:p-2.5">
                    <span className="relative block aspect-[4/3] overflow-hidden">
                      <Image
                        src={wing.images[0].src}
                        alt={wing.images[0].alt}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px"
                      />
                    </span>
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-2">
                    <span className="font-display text-[17px] italic text-ivory sm:text-lg">{wingLabel(wing.loc)}</span>
                    <span className="shrink-0 text-[13px] tabular-nums text-mist-2">
                      {wing.images.length} {wing.images.length === 1 ? "photo" : "photos"}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* The Annex: games and the daily puzzle get their own shelf */}
            <div className="mt-20">
              <SectionHead number="No. 07" title="The Annex" tone="dark" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/annex"
                  className="group flex items-center justify-between gap-4 border border-wall-line bg-wall-2 p-6 transition-colors hover:border-brass/50"
                >
                  <span>
                    <span className="flex items-center gap-2 font-display text-xl italic text-ivory">
                      <Gamepad2 className="size-4 text-brass" aria-hidden="true" />
                      The Game Room
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-mist">
                      Jigsaw, Pairs, Postcards, and Pin the Map, all built from the collection.
                    </span>
                  </span>
                  <span className="link-arrow shrink-0 text-ivory">Open</span>
                </Link>
                <Link
                  href="/daily"
                  className="group flex items-center justify-between gap-4 border border-wall-line bg-wall-2 p-6 transition-colors hover:border-brass/50"
                >
                  <span>
                    <span className="flex items-center gap-2 font-display text-xl italic text-ivory">
                      <CalendarDays className="size-4 text-teal" aria-hidden="true" />
                      The Daily Postcard
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-mist">
                      One photo, three guesses, a new one every day.
                    </span>
                  </span>
                  <span className="link-arrow shrink-0 text-ivory">Play</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Viewing controls: back to wings, location chips, view toggle */}
      {!inWings && (
        <section className="sticky top-16 z-30 border-y border-wall-line bg-wall/95 py-2 backdrop-blur-sm lg:top-[76px]">
          <div className="mx-auto flex max-w-[1312px] items-center gap-2 overflow-x-auto px-5 sm:px-8 lg:px-12">
            <button onClick={() => setView("wings")} className={tool}>
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Wings
            </button>
            <div className="h-5 w-px shrink-0 bg-wall-line" />
            <button onClick={() => switchLocation(null)} aria-pressed={location === null} className={chip(location === null)}>
              All
            </button>
            {wings.map((wing) => (
              <button
                key={wing.loc}
                onClick={() => switchLocation(wing.loc)}
                aria-pressed={location === wing.loc}
                className={chip(location === wing.loc)}
              >
                {wingLabel(wing.loc)}
              </button>
            ))}
            <div className="h-5 w-px shrink-0 bg-wall-line" />
            <button
              onClick={() => setView(view === "exhibition" ? "grid" : "exhibition")}
              className={tool}
              aria-label={view === "exhibition" ? "Switch to grid view" : "Switch to exhibition view"}
            >
              {view === "exhibition" ? <Grid3x3 className="size-3.5" aria-hidden="true" /> : <Eye className="size-3.5" aria-hidden="true" />}
              {view === "exhibition" ? "Grid" : "Exhibition"}
            </button>
          </div>
        </section>
      )}

      {/* Views */}
      {view === "map" && (
        <section className="pb-24 pt-12">
          <p className="mb-6 text-center text-[15px] text-mist">Pick a pin to walk that wing</p>
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
        <section className="pb-24 pt-12 sm:pb-32">
          <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
            <GalleryGrid images={visible} />
          </div>
        </section>
      )}
    </>
  )
}
