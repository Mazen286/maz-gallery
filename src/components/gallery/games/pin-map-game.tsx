"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  // Client-only component: the first rounds and the stored best are lazy initial state
  const [rounds, setRounds] = useState<Round[]>(() => buildRounds())
  const [current, setCurrent] = useState(0)
  const [guess, setGuess] = useState<Guess | null>(null)
  const [total, setTotal] = useState(0)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem(BEST_KEY)
      return stored !== null && !Number.isNaN(Number(stored)) ? Number(stored) : null
    } catch {
      return null
    }
  })
  const [newBest, setNewBest] = useState(false)
  // Keyboard cursor over the map, in projection units; shown while the map has focus
  const [cursor, setCursor] = useState({ x: VIEW_X + VIEW_W / 2, y: VIEW_Y + VIEW_H / 2 })
  const [mapFocused, setMapFocused] = useState(false)
  const nextRef = useRef<HTMLButtonElement>(null)

  const reset = useCallback(() => {
    setRounds(buildRounds())
    setCurrent(0)
    setGuess(null)
    setTotal(0)
    setFinished(false)
    setNewBest(false)
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

  // One placement path for the pointer and the keyboard
  const placePin = (x: number, y: number) => {
    if (guess) return
    const dist = Math.hypot(x - round.target.cx, y - round.target.cy)
    const { points, verdict } = judge(dist)
    const km = kmBetween(toLonLat(x, y), toLonLat(round.target.cx, round.target.cy))
    setGuess({ x, y, points, verdict, km })
    setTotal((t) => t + points)
    // Hand focus to Next so a keyboard player can keep going without hunting
    setTimeout(() => nextRef.current?.focus(), 50)
  }

  const dropPin = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    placePin(
      VIEW_X + ((e.clientX - rect.left) / rect.width) * VIEW_W,
      VIEW_Y + ((e.clientY - rect.top) / rect.height) * VIEW_H,
    )
  }

  const onMapKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (guess) return
    const step = e.shiftKey ? 40 : 10
    const move: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    if (move[e.key]) {
      e.preventDefault()
      const [dx, dy] = move[e.key]
      setCursor((c) => ({
        x: Math.min(Math.max(c.x + dx, VIEW_X), VIEW_X + VIEW_W),
        y: Math.min(Math.max(c.y + dy, VIEW_Y), VIEW_Y + VIEW_H),
      }))
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      placePin(cursor.x, cursor.y)
    }
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
          className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-[13px] font-medium text-mist transition-colors hover:text-ivory"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          The Annex
        </button>
        <div className="flex items-center gap-4 text-sm tabular-nums">
          <span className="text-mist">
            Round {current + 1} of {ROUNDS}
          </span>
          <span className="text-ivory">{total} pts</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="label text-brass">
            Pin the Map
          </p>
          <h2 className="mt-2 font-display text-2xl italic text-ivory sm:text-3xl">
            Where in the world was this shot?
          </h2>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* The postcard */}
            <figure className="mx-auto w-full max-w-sm shrink-0 lg:mx-0 lg:w-[330px] lg:-rotate-1">
              <div className="frame">
                <Image
                  src={round.image.src}
                  alt="Mystery photo. Pin where you think it was taken."
                  width={round.image.width}
                  height={round.image.height}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 330px"
                />
              </div>
              <figcaption className="mt-3 min-h-5 text-center font-display text-[15px] italic text-mist">
                {guess
                  ? `${round.image.alt} · ${round.target.label}`
                  : "Unlabeled. That is the point."}
              </figcaption>
            </figure>

            {/* The map */}
            <div className="min-w-0 flex-1">
              <div className="relative overflow-hidden border border-brass/30 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                <svg
                  viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
                  onClick={dropPin}
                  onKeyDown={onMapKey}
                  onFocus={() => setMapFocused(true)}
                  onBlur={() => setMapFocused(false)}
                  tabIndex={guess ? -1 : 0}
                  className={`block w-full outline-none focus-visible:ring-2 focus-visible:ring-brass ${guess ? "" : "cursor-crosshair"}`}
                  role="application"
                  aria-label="World map. Click to drop your pin, or use the arrow keys to move the crosshair and Enter to drop it."
                >
                  <defs>
                    <radialGradient id="pinmap-ocean" cx="50%" cy="42%" r="75%">
                      <stop offset="0%" stopColor="#1c1f26" />
                      <stop offset="70%" stopColor="#15171c" />
                      <stop offset="100%" stopColor="#0d0e11" />
                    </radialGradient>
                    <linearGradient id="pinmap-land" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(216,189,134,0.20)" />
                      <stop offset="100%" stopColor="rgba(184,151,90,0.11)" />
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
                    stroke="rgba(184,151,90,0.35)"
                    strokeWidth="2.4"
                    filter="url(#pinmap-glow)"
                  />
                  {/* Land */}
                  <path
                    d={WORLD_LAND_PATH}
                    fill="url(#pinmap-land)"
                    stroke="rgba(216,189,134,0.55)"
                    strokeWidth="0.5"
                  />

                  {!guess && mapFocused && (
                    <g pointerEvents="none" aria-hidden="true">
                      <line x1={cursor.x - 14} y1={cursor.y} x2={cursor.x + 14} y2={cursor.y} stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                      <line x1={cursor.x} y1={cursor.y - 14} x2={cursor.x} y2={cursor.y + 14} stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                      <circle cx={cursor.x} cy={cursor.y} r="7" fill="none" stroke="#d8bd86" strokeWidth="1.5" />
                    </g>
                  )}

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
                  <span key={cls} className={`pointer-events-none absolute h-4 w-4 border-brass/50 ${cls}`} />
                ))}

                {/* Verdict chip */}
                {guess && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="absolute left-1/2 top-3 max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-full border border-teal/40 bg-wall/90 px-4 py-1.5 text-center backdrop-blur-sm"
                    style={{ animation: "placardIn 0.35s ease-out both" }}
                  >
                    <p className="text-[13px] font-medium tabular-nums text-teal">
                      {guess.verdict} &middot; +{guess.points}
                      {guess.points < 100 && (
                        <span className="text-mist"> &middot; {guess.km.toLocaleString()} km off</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-mist">
                  {guess ? "" : mapFocused ? "Arrow keys move the crosshair, Enter drops the pin" : "Tap the map to drop your pin"}
                </p>
                {guess && (
                  <button
                    ref={nextRef}
                    onClick={next}
                    className="btn btn-ivory"
                  >
                    {current + 1 >= ROUNDS ? "Final score" : "Next photo"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results overlay */}
      {finished && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-wall/90 px-6 text-center backdrop-blur-sm">
          {total >= 400 && <ConfettiOverlay />}
          <p className="label text-brass">
            Final score
          </p>
          <h2 className="mt-3 font-display text-5xl italic tabular-nums text-ivory">
            {total} / {ROUNDS * 100}
          </h2>
          <p className="mt-3 font-display text-xl italic text-brass-2">{rankFor(total)}</p>
          {newBest ? (
            <p className="label mt-3 text-teal">
              New personal best
            </p>
          ) : (
            best !== null && (
              <p className="mt-3 text-[13px] tabular-nums text-mist">
                Best: {best}
              </p>
            )
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={reset}
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
