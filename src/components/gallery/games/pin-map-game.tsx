"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { GALLERY, LOCATION_COORDS, type GalleryImage } from "@/lib/gallery"
import { WORLD_LAND_PATH } from "./world-map-data"
import { ConfettiOverlay } from "./confetti"

interface PinMapGameProps {
  onBack: () => void
}

const ROUNDS = 5
const BEST_KEY = "mazgallery.pinmap.best.v1"

// The svg shows latitudes 85 down to -60: a viewBox crop of the full
// equirectangular projection, so pin math stays in projection units
const VIEW_X = 0
const VIEW_Y = 12.5
const VIEW_W = 900
const VIEW_H = 362.5

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
    const x = VIEW_X + ((e.clientX - rect.left) / rect.width) * VIEW_W
    const y = VIEW_Y + ((e.clientY - rect.top) / rect.height) * VIEW_H
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
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-white/40">
            Round {current + 1} / {ROUNDS}
          </span>
          <span className="text-sm text-teal">{total} pts</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
            Pin the Map
          </p>
          <h2 className="mt-1 font-display text-2xl italic text-white/90 sm:text-3xl">
            Where in the world was this shot?
          </h2>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* The postcard */}
            <figure className="mx-auto w-full max-w-sm shrink-0 lg:mx-0 lg:w-[330px] lg:-rotate-1">
              <div className="border border-[#a08c5f]/35 bg-[#efece4] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.5)]">
                <Image
                  src={round.image.src}
                  alt="Mystery photo. Pin where you think it was taken."
                  width={round.image.width}
                  height={round.image.height}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 330px"
                />
              </div>
              <figcaption className="mt-3 min-h-5 text-center font-display text-sm italic text-white/60">
                {guess
                  ? `${round.image.alt} · ${round.target.label}`
                  : "Unlabeled. That is the point."}
              </figcaption>
            </figure>

            {/* The map */}
            <div className="min-w-0 flex-1">
              <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                <svg
                  viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
                  onClick={dropPin}
                  className={`block w-full ${guess ? "" : "cursor-crosshair"}`}
                  role="img"
                  aria-label="World map. Click to drop your pin."
                >
                  {/* Ocean */}
                  <rect x={VIEW_X} y={VIEW_Y} width={VIEW_W} height={VIEW_H} fill="#0a111c" />
                  {/* Graticules */}
                  {[75, 150, 225, 300].map((y) => (
                    <line key={`lat${y}`} x1="0" y1={y} x2="900" y2={y} stroke="rgba(120,200,214,0.05)" strokeWidth="0.75" />
                  ))}
                  {Array.from({ length: 11 }, (_, i) => (i + 1) * 75).map((x) => (
                    <line key={`lon${x}`} x1={x} y1={VIEW_Y} x2={x} y2={VIEW_Y + VIEW_H} stroke="rgba(120,200,214,0.05)" strokeWidth="0.75" />
                  ))}
                  {/* Land: Natural Earth */}
                  <path
                    d={WORLD_LAND_PATH}
                    fill="rgba(120,200,214,0.13)"
                    stroke="rgba(120,200,214,0.45)"
                    strokeWidth="0.6"
                  />

                  {guess && (
                    <>
                      <line
                        x1={guess.x}
                        y1={guess.y}
                        x2={round.target.cx}
                        y2={round.target.cy}
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth="1.5"
                        strokeDasharray="5 4"
                      />
                      {/* Your pin */}
                      <circle cx={guess.x} cy={guess.y} r="9" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                      <circle cx={guess.x} cy={guess.y} r="4.5" fill="rgba(255,255,255,0.92)" />
                      {/* True pin */}
                      <circle cx={round.target.cx} cy={round.target.cy} r="10" fill="none" stroke="rgba(120,200,214,0.5)" strokeWidth="1.5" />
                      <circle cx={round.target.cx} cy={round.target.cy} r="5" fill="#78c8d6" />
                      <text
                        x={round.target.cx}
                        y={round.target.cy - 16}
                        textAnchor="middle"
                        fill="#9fdce6"
                        fontSize="13"
                        fontWeight="600"
                        stroke="#06090f"
                        strokeWidth="3"
                        paintOrder="stroke"
                      >
                        {round.target.label}
                      </text>
                    </>
                  )}
                </svg>

                {/* Verdict chip */}
                {guess && (
                  <div
                    className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-teal/40 bg-[#0a111c]/90 px-4 py-1.5 backdrop-blur-sm"
                    style={{ animation: "placardIn 0.35s ease-out both" }}
                  >
                    <p className="font-mono text-xs text-teal">
                      {guess.verdict} &middot; +{guess.points}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 flex min-h-10 items-center justify-between">
                <p className="text-xs text-white/40">
                  {guess ? "" : "Tap the map to drop your pin"}
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
