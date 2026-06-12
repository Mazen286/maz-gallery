"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { X, Puzzle, Copy, MapPin } from "lucide-react"
import { GALLERY, type GalleryImage } from "@/lib/gallery"
import { JigsawPuzzle } from "../jigsaw-puzzle"
import { PhotoPicker } from "./photo-picker"
import { PairsGame } from "./pairs-game"
import { PostcardsGame } from "./postcards-game"

interface GameRoomProps {
  onClose: () => void
}

type Screen = "hub" | "pick" | "jigsaw" | "pairs" | "postcards"

const randomImage = () => GALLERY[Math.floor(Math.random() * GALLERY.length)]

export function GameRoom({ onClose }: GameRoomProps) {
  const [screen, setScreen] = useState<Screen>("hub")
  const [jigsawImage, setJigsawImage] = useState<GalleryImage | null>(null)

  // One random photo per card, fresh every visit
  const cardArt = useMemo(() => {
    const shuffled = [...GALLERY].sort(() => Math.random() - 0.5)
    return [shuffled[0], shuffled[1], shuffled[2]]
  }, [])

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
      icon: MapPin,
      title: "Postcards",
      blurb: "Eight photos, one question each: where was this taken?",
      art: cardArt[2],
      start: () => setScreen("postcards"),
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

            <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-teal/60 transition-colors group-hover:text-teal">
                      Play
                    </p>
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
    </div>
  )
}
