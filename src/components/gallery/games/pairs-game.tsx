"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"
import { ConfettiOverlay } from "./confetti"

interface PairsGameProps {
  images: GalleryImage[]
  onBack: () => void
}

type Difficulty = "easy" | "medium" | "hard"

const PAIR_COUNT: Record<Difficulty, number> = {
  easy: 6,
  medium: 8,
  hard: 12,
}

interface Card {
  id: number
  image: GalleryImage
}

const BEST_KEY = "mazgallery.pairs.best.v1"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dealCards(images: GalleryImage[], pairs: number): Card[] {
  const picks = shuffle(images).slice(0, pairs)
  return shuffle([...picks, ...picks].map((image, id) => ({ id, image })))
}

export function PairsGame({ images, onBack }: PairsGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [best, setBest] = useState<Record<string, number> | null>(null)
  const [newBest, setNewBest] = useState(false)
  const [streak, setStreak] = useState(0)
  const lockRef = useRef(false)

  const won = cards.length > 0 && matched.size === cards.length / 2

  const reset = useCallback(
    (diff: Difficulty) => {
      setCards(dealCards(images, PAIR_COUNT[diff]))
      setFlipped([])
      setMatched(new Set())
      setMoves(0)
      setElapsed(0)
      setRunning(false)
      setNewBest(false)
      setStreak(0)
      lockRef.current = false
    },
    [images]
  )

  useEffect(() => reset(difficulty), [difficulty, reset])

  useEffect(() => {
    try {
      setBest(JSON.parse(localStorage.getItem(BEST_KEY) ?? "{}"))
    } catch {
      setBest({})
    }
  }, [])

  // Timer
  useEffect(() => {
    if (!running || won) return
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [running, won])

  // Record best (fewest moves) on win
  useEffect(() => {
    if (!won || best === null) return
    const prev = best[difficulty]
    if (prev === undefined || moves < prev) {
      const next = { ...best, [difficulty]: moves }
      setBest(next)
      setNewBest(true)
      try {
        localStorage.setItem(BEST_KEY, JSON.stringify(next))
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won])

  // ESC goes back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onBack])

  const flip = (idx: number) => {
    if (lockRef.current || won) return
    if (flipped.includes(idx) || matched.has(cards[idx].image.src)) return
    setRunning(true)

    if (flipped.length === 0) {
      setFlipped([idx])
      return
    }

    const [first] = flipped
    setFlipped([first, idx])
    setMoves((m) => m + 1)

    if (cards[first].image.src === cards[idx].image.src) {
      setMatched((prev) => new Set(prev).add(cards[idx].image.src))
      setFlipped([])
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
      lockRef.current = true
      setTimeout(() => {
        setFlipped([])
        lockRef.current = false
      }, 850)
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  const gridCols =
    difficulty === "easy"
      ? "grid-cols-3 sm:grid-cols-4"
      : difficulty === "medium"
        ? "grid-cols-4"
        : "grid-cols-4 sm:grid-cols-6"

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={onBack}
          className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-[13px] font-medium text-mist transition-colors hover:text-ivory"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          The Annex
        </button>
        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <span
              key={streak}
              className="label text-teal"
              style={{ animation: "placardIn 0.3s ease-out both" }}
            >
              streak x{streak}
            </span>
          )}
          <span className="text-sm tabular-nums text-ivory">{formatTime(elapsed)}</span>
          <span className="text-sm tabular-nums text-mist">
            {moves} move{moves !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="px-5 sm:px-8">
        <p className="label text-brass">
          Pairs
        </p>
        <h2 className="mt-2 font-display text-2xl italic text-ivory sm:text-3xl">
          The Curator&apos;s Memory
        </h2>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-4 sm:px-8">
        <div className={`grid w-full max-w-2xl gap-2 sm:gap-3 ${gridCols}`}>
          {cards.map((card, idx) => {
            const isUp = flipped.includes(idx) || matched.has(card.image.src)
            const isMatched = matched.has(card.image.src)
            return (
              <button
                key={card.id}
                onClick={() => flip(idx)}
                className="relative aspect-square"
                style={{ perspective: "600px" }}
                aria-label={isUp ? card.image.alt : "Face-down card"}
              >
                <div
                  className="absolute inset-0 transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isUp ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Back of card */}
                  <div
                    className="absolute inset-0 flex items-center justify-center border border-wall-line bg-gradient-to-br from-wall-3 to-wall-2 transition-colors hover:border-brass/60"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="font-display text-xl italic text-brass" aria-hidden="true">M</span>
                  </div>
                  {/* Face of card */}
                  <div
                    className={`absolute inset-0 overflow-hidden border ${
                      isMatched ? "border-teal" : "border-ivory/40"
                    }`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 12vw"
                    />
                    {isMatched && <div className="absolute inset-0 bg-teal/15" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex items-center justify-center gap-3 px-4 pb-5">
        <div className="flex rounded-full border border-wall-line p-1" role="group" aria-label="Difficulty">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              aria-pressed={difficulty === d}
              className={`min-h-11 rounded-full px-4 text-[13px] font-medium capitalize transition-colors ${
                difficulty === d ? "bg-ivory text-wall" : "text-mist hover:text-ivory"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          onClick={() => reset(difficulty)}
          className="btn btn-line text-ivory"
        >
          Redeal
        </button>
      </div>

      {/* Win overlay */}
      {won && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-wall/90 px-6 text-center backdrop-blur-sm">
          <ConfettiOverlay />
          <h2 className="font-display text-3xl italic text-ivory sm:text-4xl">
            All pairs matched
          </h2>
          <p className="mt-3 text-lg tabular-nums text-mist">
            {formatTime(elapsed)} &middot; {moves} moves
          </p>
          {newBest ? (
            <p className="label mt-2 text-teal">
              New personal best
            </p>
          ) : (
            best?.[difficulty] !== undefined && (
              <p className="mt-2 text-[13px] tabular-nums text-mist">
                Best: {best[difficulty]} moves
              </p>
            )
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => reset(difficulty)}
              className="btn btn-ivory"
            >
              Play again
            </button>
            <button
              onClick={onBack}
              className="btn btn-line text-ivory"
            >
              The Annex
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
