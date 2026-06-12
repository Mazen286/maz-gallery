"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Puzzle, Copy, Mail, MapPin, CalendarDays, ArrowRight } from "lucide-react"
import { getDailyPuzzle } from "@/lib/daily"
import { GALLERY, type GalleryImage } from "@/lib/gallery"
import { JigsawPuzzle } from "../jigsaw-puzzle"
import { PhotoPicker } from "./photo-picker"
import { PairsGame } from "./pairs-game"
import { PostcardsGame } from "./postcards-game"
import { PinMapGame } from "./pin-map-game"

interface GameRoomProps {
  onClose: () => void
}

type Screen = "hub" | "pick" | "jigsaw" | "pairs" | "postcards" | "pinmap"

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

// Pull each game's personal best out of localStorage for the hub cards
function readBests(): Record<string, string> {
  const out: Record<string, string> = {}
  try {
    const j = JSON.parse(localStorage.getItem("mazgallery.jigsaw.best.v1") ?? "{}")
    for (const d of ["medium", "easy", "hard"]) {
      if (j[d] !== undefined) {
        out.jigsaw = `Best (${d}): ${fmtTime(j[d])}`
        break
      }
    }
  } catch {}
  try {
    const p = JSON.parse(localStorage.getItem("mazgallery.pairs.best.v1") ?? "{}")
    for (const d of ["medium", "easy", "hard"]) {
      if (p[d] !== undefined) {
        out.pairs = `Best (${d}): ${p[d]} moves`
        break
      }
    }
  } catch {}
  const pc = localStorage.getItem("mazgallery.postcards.best.v1")
  if (pc !== null) out.postcards = `Best: ${pc} / 8`
  const pm = localStorage.getItem("mazgallery.pinmap.best.v1")
  if (pm !== null) out.pinmap = `Best: ${pm} / 500`
  return out
}

const randomImage = () => GALLERY[Math.floor(Math.random() * GALLERY.length)]

export function GameRoom({ onClose }: GameRoomProps) {
  const [screen, setScreen] = useState<Screen>("hub")
  const [jigsawImage, setJigsawImage] = useState<GalleryImage | null>(null)

  // One random photo per card, fresh every visit
  const cardArt = useMemo(() => {
    const shuffled = [...GALLERY].sort(() => Math.random() - 0.5)
    return [shuffled[0], shuffled[1], shuffled[2], shuffled[3]]
  }, [])

  // Personal bests, refreshed whenever the visitor returns to the hub
  const [bests, setBests] = useState<Record<string, string>>({})
  useEffect(() => {
    if (screen === "hub") setBests(readBests())
  }, [screen])

  // Lock page scroll while the room is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // ESC closes only from the hub; games handle their own escape
  useEffect(() => {
    if (screen !== "hub") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [screen, onClose])

  const games = [
    {
      key: "jigsaw",
      icon: Puzzle,
      title: "Jigsaw",
      blurb: "Reassemble a photo from the collection, piece by piece.",
      art: cardArt[0],
      start: () => setScreen("pick"),
    },
    {
      key: "pairs",
      icon: Copy,
      title: "Pairs",
      blurb: "Flip the cards and match the moments. Fewest moves wins.",
      art: cardArt[1],
      start: () => setScreen("pairs"),
    },
    {
      key: "postcards",
      icon: Mail,
      title: "Postcards",
      blurb: "Eight photos, one question each: where was this taken?",
      art: cardArt[2],
      start: () => setScreen("postcards"),
    },
    {
      key: "pinmap",
      icon: MapPin,
      title: "Pin the Map",
      blurb: "Five photos, one world map. Drop a pin where each was shot.",
      art: cardArt[3],
      start: () => setScreen("pinmap"),
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #161a26 0%, #0b0d13 55%, #08090d 100%)",
      }}
    >
      {screen === "hub" && (
        <>
          <div className="flex items-center justify-end px-5 py-4 sm:px-8">
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Leave the game room"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-6">
            <div className="m-auto flex w-full max-w-4xl flex-col items-center pb-12 pt-2">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.45em] text-teal/70"
              style={{ animation: "placardIn 0.5s ease-out both" }}
            >
              The Annex &middot; After Hours
            </p>
            <h2
              className="mt-3 text-center font-display text-4xl italic text-white sm:text-5xl"
              style={{ animation: "placardIn 0.55s ease-out 0.08s both" }}
            >
              The Game Room
            </h2>
            <p
              className="mt-3 max-w-md text-center text-sm text-white/45"
              style={{ animation: "placardIn 0.55s ease-out 0.16s both" }}
            >
              When the museum closes, the collection comes out to play.
            </p>

            {/* Today's challenge */}
            <Link
              href="/daily"
              className="group mt-10 flex w-full max-w-5xl items-center justify-between gap-4 rounded-lg border border-teal/30 bg-teal/[0.05] px-5 py-4 transition-all hover:border-teal/60 hover:bg-teal/10"
              style={{ animation: "menuItemIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.14s both" }}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="size-5 text-teal" />
                <div>
                  <p className="font-display text-lg italic text-white">
                    The Daily Postcard
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                    No. {getDailyPuzzle().number} &middot; one photo, three tries, every day
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-teal/60 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div className="mt-4 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {games.map((game, i) => (
                <button
                  key={game.key}
                  onClick={game.start}
                  className="group relative overflow-hidden rounded-lg border border-white/10 text-left transition-all hover:border-teal/50 hover:shadow-[0_0_30px_rgba(120,200,214,0.12)]"
                  style={{ animation: `menuItemIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.09}s both` }}
                >
                  <div className="relative h-36 overflow-hidden sm:h-44">
                    <Image
                      src={game.art.src}
                      alt=""
                      fill
                      className="object-cover opacity-50 transition-all duration-500 group-hover:scale-105 group-hover:opacity-75"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] to-transparent" />
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center gap-2">
                      <game.icon className="size-4 text-teal" />
                      <h3 className="font-display text-xl italic text-white">{game.title}</h3>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/45">{game.blurb}</p>
                    <div className="mt-3 flex items-baseline justify-between gap-2">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-teal/60 transition-colors group-hover:text-teal">
                        Play
                      </p>
                      {bests[game.key] && (
                        <p className="font-mono text-[9px] text-white/35">{bests[game.key]}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              </div>
            </div>
          </div>
        </>
      )}

      {screen === "pick" && (
        <PhotoPicker
          images={GALLERY}
          onBack={() => setScreen("hub")}
          onPick={(image) => {
            setJigsawImage(image)
            setScreen("jigsaw")
          }}
        />
      )}

      {screen === "jigsaw" && jigsawImage && (
        <JigsawPuzzle
          image={jigsawImage}
          onClose={() => setScreen("hub")}
          onChangePhoto={() => setScreen("pick")}
          onRandomPhoto={() => setJigsawImage(randomImage())}
        />
      )}

      {screen === "pairs" && <PairsGame images={GALLERY} onBack={() => setScreen("hub")} />}

      {screen === "postcards" && (
        <PostcardsGame images={GALLERY} onBack={() => setScreen("hub")} />
      )}

      {screen === "pinmap" && <PinMapGame onBack={() => setScreen("hub")} />}
    </div>
  )
}
