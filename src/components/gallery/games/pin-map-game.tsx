"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { GALLERY, LOCATION_COORDS, type GalleryImage } from "@/lib/gallery"
import { WORLD_PATHS } from "../location-map"
import { ConfettiOverlay } from "./confetti"

interface PinMapGameProps {
  onBack: () => void
}

const ROUNDS = 5
const BEST_KEY = "mazgallery.pinmap.best.v1"

interface Round {
  image: GalleryImage
  target: { cx: number; cy: number; label: string }
}

interface Guess {
  x: number
  y: number
  points: number
  verdict: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRounds(): Round[] {
  // One photo from each of five different places for variety
  const locations = shuffle(
    Object.keys(LOCATION_COORDS).filter((loc) =>
      GALLERY.some((img) => img.location === loc)
    )
  ).slice(0, ROUNDS)
  return locations.map((loc) => {
    const pool = GALLERY.filter((img) => img.location === loc)
    return {
      image: pool[Math.floor(Math.random() * pool.length)],
      target: LOCATION_COORDS[loc],
    }
  })
}

function judge(dist: number): { points: number; verdict: string } {
  if (dist < 18) return { points: 100, verdict: "Bullseye" }
  if (dist < 45) return { points: 75, verdict: "So close" }
  if (dist < 90) return { points: 50, verdict: "Right region" }
  if (dist < 180) return { points: 25, verdict: "Wrong neighborhood" }
  return { points: 10, verdict: "Different hemisphere" }
}

function rankFor(total: number): string {
  if (total >= 450) return "Cartographer"
  if (total >= 350) return "Navigator"
  if (total >= 250) return "Tourist with a map"
  return "Lost, but happily"
}

export function PinMapGame({ onBack }: PinMapGameProps) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [current, setCurrent] = useState(0)
  const [guess, setGuess] = useState<Guess | null>(null)
  const [total, setTotal] = useState(0)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState<number | null>(null)
  const [newBest, setNewBest] = useState(false)

  const reset = useCallback(() => {
    setRounds(buildRounds())
    setCurrent(0)
    setGuess(null)
    setTotal(0)
    setFinished(false)
    setNewBest(false)
  }, [])

  useEffect(() => reset(), [reset])

  useEffect(() => {
    const stored = localStorage.getItem(BEST_KEY)
    if (stored !== null && !Number.isNaN(Number(stored))) setBest(Number(stored))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onBack])

  const round = rounds[current]
  if (!round) return null

  const dropPin = (e: React.MouseEvent<SVGSVGElement>) => {
    if (guess) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 900
    const y = ((e.clientY - rect.top) / rect.height) * 450
    const dist = Math.hypot(x - round.target.cx, y - round.target.cy)
    const { points, verdict } = judge(dist)
    setGuess({ x, y, points, verdict })
    setTotal((t) => t + points)
  }

  const next = () => {
    if (current + 1 >= rounds.length) {
      setFinished(true)
      const finalTotal = total
      if (best === null || finalTotal > best) {
        setBest(finalTotal)
        setNewBest(true)
        try {
          localStorage.setItem(BEST_KEY, String(finalTotal))
        } catch {}
      }
    } else {
      setCurrent((c) => c + 1)
      setGuess(null)
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Game Room
        </button>
        <span className="font-mono text-sm text-teal">{total} pts</span>
      </div>

      <div className="px-5 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
          Pin the Map &middot; {current + 1} of {ROUNDS}
        </p>
        <h2 className="mt-1 font-display text-2xl italic text-white/90 sm:text-3xl">
          {guess ? guess.verdict : "Where in the world was this shot?"}
        </h2>
      </div>

      <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto px-5 py-4 sm:px-8 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
        <div className="w-full max-w-md shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/40 p-2">
          <Image
            src={round.image.src}
            alt="Mystery photo. Pin where you think it was taken."
            width={round.image.width}
            height={round.image.height}
            className="mx-auto max-h-[32vh] w-auto rounded object-contain lg:max-h-[48vh]"
          />
          {guess && (
            <p className="px-2 pb-1 pt-2 text-center text-xs italic text-white/55">
              {round.image.alt} &middot; {round.target.label}
            </p>
          )}
        </div>

        <div className="w-full max-w-2xl">
          <svg
            viewBox="0 0 900 450"
            onClick={dropPin}
            className={`w-full rounded-lg border border-white/10 bg-white/[0.02] ${guess ? "" : "cursor-crosshair"}`}
            role="img"
            aria-label="World map. Click to drop your pin."
          >
            {WORLD_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="rgba(120,200,214,0.05)"
                stroke="rgba(120,200,214,0.2)"
                strokeWidth="1"
              />
            ))}

            {guess && (
              <>
                <line
                  x1={guess.x}
                  y1={guess.y}
                  x2={round.target.cx}
                  y2={round.target.cy}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
                {/* Your pin */}
                <circle cx={guess.x} cy={guess.y} r="6" fill="rgba(255,255,255,0.9)" />
                <text x={guess.x} y={guess.y - 12} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">
                  you
                </text>
                {/* True pin */}
                <circle cx={round.target.cx} cy={round.target.cy} r="7" fill="#78c8d6" />
                <text
                  x={round.target.cx}
                  y={round.target.cy - 13}
                  textAnchor="middle"
                  fill="#78c8d6"
                  fontSize="12"
                  fontWeight="600"
                >
                  {round.target.label}
                </text>
              </>
            )}
          </svg>

          <div className="mt-3 flex min-h-10 items-center justify-between">
            <p className="text-xs text-white/40">
              {guess ? `+${guess.points} points` : "Tap the map to drop your pin"}
            </p>
            {guess && (
              <button
                onClick={next}
                className="flex items-center gap-2 rounded-full border border-teal px-5 py-2 text-sm text-teal transition-all hover:bg-teal/10"
              >
                {current + 1 >= ROUNDS ? "Final score" : "Next photo"}
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results overlay */}
      {finished && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 px-6 text-center">
          {total >= 400 && <ConfettiOverlay />}
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
            Final score
          </p>
          <h2 className="mt-2 font-display text-5xl italic text-white">
            {total} / {ROUNDS * 100}
          </h2>
          <p className="mt-3 font-display text-xl italic text-teal">{rankFor(total)}</p>
          {newBest ? (
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-teal/80">
              New personal best
            </p>
          ) : (
            best !== null && (
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-white/35">
                Best: {best}
              </p>
            )
          )}
          <div className="mt-7 flex gap-3">
            <button
              onClick={reset}
              className="rounded-full border border-teal px-5 py-2 text-sm text-teal transition-all hover:bg-white/10"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/50 transition-all hover:text-white"
            >
              Game Room
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
