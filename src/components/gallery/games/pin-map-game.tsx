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
  km: number
}

// Projection back to lon/lat, then great-circle distance for the verdict
function toLonLat(x: number, y: number): [number, number] {
  return [x / 2.5 - 180, 90 - y / 2.5]
}

function kmBetween(a: [number, number], b: [number, number]): number {
  const rad = Math.PI / 180
  const dLat = (b[1] - a[1]) * rad
  const dLon = (b[0] - a[0]) * rad
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)))
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
    const km = kmBetween(toLonLat(x, y), toLonLat(round.target.cx, round.target.cy))
    setGuess({ x, y, points, verdict, km })
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
        <div className="mx-auto w-full max-w-6xl">
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
              <div className="relative overflow-hidden rounded-xl border border-[#a08c5f]/30 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                <svg
                  viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
                  onClick={dropPin}
                  className={`block w-full ${guess ? "" : "cursor-crosshair"}`}
                  role="img"
                  aria-label="World map. Click to drop your pin."
                >
                  <defs>
                    <radialGradient id="pinmap-ocean" cx="50%" cy="42%" r="75%">
                      <stop offset="0%" stopColor="#0e1726" />
                      <stop offset="70%" stopColor="#0a111c" />
                      <stop offset="100%" stopColor="#070b12" />
                    </radialGradient>
                    <linearGradient id="pinmap-land" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(126,205,219,0.17)" />
                      <stop offset="100%" stopColor="rgba(120,200,214,0.09)" />
                    </linearGradient>
                    <radialGradient id="pinmap-vignette" cx="50%" cy="48%" r="72%">
                      <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="78%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                    </radialGradient>
                    <filter id="pinmap-glow" x="-5%" y="-5%" width="110%" height="110%">
                      <feGaussianBlur stdDeviation="2.4" />
                    </filter>
                  </defs>

                  {/* Ocean */}
                  <rect x={VIEW_X} y={VIEW_Y} width={VIEW_W} height={VIEW_H} fill="url(#pinmap-ocean)" />

                  {/* Coastline glow under the land */}
                  <path
                    d={WORLD_LAND_PATH}
                    fill="none"
                    stroke="rgba(120,200,214,0.35)"
                    strokeWidth="2.4"
                    filter="url(#pinmap-glow)"
                  />
                  {/* Land */}
                  <path
                    d={WORLD_LAND_PATH}
                    fill="url(#pinmap-land)"
                    stroke="rgba(150,215,226,0.55)"
                    strokeWidth="0.5"
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
                      {/* True pin with a slow pulse */}
                      <circle
                        cx={round.target.cx}
                        cy={round.target.cy}
                        r="11"
                        fill="none"
                        stroke="rgba(120,200,214,0.5)"
                        strokeWidth="1.5"
                        className="animate-pulse-dot"
                        style={{ transformOrigin: `${round.target.cx}px ${round.target.cy}px` }}
                      />
                      <circle cx={round.target.cx} cy={round.target.cy} r="5" fill="#78c8d6" />
                      <text
                        x={round.target.cx}
                        y={round.target.cy - 16}
                        textAnchor="middle"
                        fill="#b5e4ec"
                        fontSize="13"
                        fontWeight="600"
                        stroke="#06090f"
                        strokeWidth="3.5"
                        paintOrder="stroke"
                      >
                        {round.target.label}
                      </text>
                    </>
                  )}

                  {/* Vignette */}
                  <rect
                    x={VIEW_X}
                    y={VIEW_Y}
                    width={VIEW_W}
                    height={VIEW_H}
                    fill="url(#pinmap-vignette)"
                    pointerEvents="none"
                  />
                </svg>

                {/* Brass corner accents */}
                {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-l border-b", "right-2 bottom-2 border-r border-b"].map((cls) => (
                  <span key={cls} className={`pointer-events-none absolute h-4 w-4 border-[#a08c5f]/50 ${cls}`} />
                ))}

                {/* Verdict chip */}
                {guess && (
                  <div
                    className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-teal/40 bg-[#0a111c]/90 px-4 py-1.5 backdrop-blur-sm"
                    style={{ animation: "placardIn 0.35s ease-out both" }}
                  >
                    <p className="font-mono text-xs text-teal">
                      {guess.verdict} &middot; +{guess.points}
                      {guess.points < 100 && (
                        <span className="text-white/45"> &middot; {guess.km.toLocaleString()} km off</span>
                      )}
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
