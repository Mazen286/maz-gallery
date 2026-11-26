"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"
import { ConfettiOverlay } from "./confetti"

interface PostcardsGameProps {
  images: GalleryImage[]
  onBack: () => void
}

const ROUNDS = 8
const OPTIONS = 4
const BEST_KEY = "mazgallery.postcards.best.v1"
const RECENT_KEY = "mazgallery.postcards.recent.v1"
const RECENT_LIMIT = 24

interface Round {
  image: GalleryImage
  options: string[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRounds(images: GalleryImage[], recent: Set<string>): Round[] {
  const located = images.filter((img) => img.location)
  const allLocations = [...new Set(located.map((img) => img.location as string))]
  // Prefer photos the visitor has not seen in recent games; pad with the
  // rest if the fresh pool runs short
  const fresh = shuffle(located.filter((img) => !recent.has(img.src)))
  const seen = shuffle(located.filter((img) => recent.has(img.src)))
  return [...fresh, ...seen].slice(0, ROUNDS).map((image) => {
    const wrong = shuffle(allLocations.filter((l) => l !== image.location)).slice(
      0,
      OPTIONS - 1
    )
    return { image, options: shuffle([image.location as string, ...wrong]) }
  })
}

function rankFor(score: number): string {
  if (score >= 8) return "Honorary local"
  if (score >= 6) return "Seasoned traveler"
  if (score >= 4) return "Window-seat dreamer"
  return "Time to book a flight"
}

// Fresh rounds that avoid recently shown photos, remembering what was shown
function nextRounds(images: GalleryImage[]): Round[] {
  let recent: string[] = []
  try {
    recent = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]")
  } catch {}
  const next = buildRounds(images, new Set(recent))
  try {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify([...next.map((r) => r.image.src), ...recent].slice(0, RECENT_LIMIT))
    )
  } catch {}
  return next
}

export function PostcardsGame({ images, onBack }: PostcardsGameProps) {
  // Client-only component: the first rounds and the stored best are lazy initial state
  const [rounds, setRounds] = useState<Round[]>(() => nextRounds(images))
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem(BEST_KEY)
      return raw !== null && !Number.isNaN(Number(raw)) ? Number(raw) : null
    } catch {
      return null
    }
  })
  const [newBest, setNewBest] = useState(false)

  const reset = useCallback(() => {
    setRounds(nextRounds(images))
    setCurrent(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setNewBest(false)
  }, [images])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onBack])

  const round = rounds[current]
  if (!round) return null

  const correct = round.image.location

  const choose = (option: string) => {
    if (picked) return
    setPicked(option)
    if (option === correct) setScore((s) => s + 1)
  }

  const next = () => {
    if (current + 1 >= rounds.length) {
      const finalScore = score
      setFinished(true)
      if (best === null || finalScore > best) {
        setBest(finalScore)
        setNewBest(true)
        try {
          localStorage.setItem(BEST_KEY, String(finalScore))
        } catch {}
      }
    } else {
      setCurrent((c) => c + 1)
      setPicked(null)
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
        <span className="text-sm tabular-nums text-ivory" aria-label={`Score ${score} of ${ROUNDS}`}>
          {score} / {ROUNDS}
        </span>
      </div>

      <div className="px-5 sm:px-8">
        <p className="label text-brass">
          Postcard {current + 1} of {ROUNDS}
        </p>
        <h2 className="mt-2 font-display text-2xl italic text-ivory sm:text-3xl">
          Where was this taken?
        </h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-5 py-4 sm:px-8">
        <div className="frame relative w-full max-w-2xl overflow-hidden p-2 sm:p-2.5">
          <Image
            src={round.image.src}
            alt="A photo from the collection. Guess the location."
            width={round.image.width}
            height={round.image.height}
            className="mx-auto max-h-[42vh] w-auto object-contain"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          {picked && (
            <p className="px-2 pb-1 pt-3 text-center font-display text-sm italic text-ink-2">
              {round.image.alt}
            </p>
          )}
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
          {round.options.map((option) => {
            const isCorrect = picked && option === correct
            const isWrongPick = picked === option && option !== correct
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                disabled={!!picked}
                className={`min-h-12 border px-4 py-3 text-[15px] transition-colors ${
                  isCorrect
                    ? "border-teal bg-teal/15 text-teal"
                    : isWrongPick
                      ? "border-[#e0786c]/60 bg-[#e0786c]/10 text-[#f2b1a8] line-through decoration-[#e0786c]/70"
                      : picked
                        ? "border-wall-line text-mist-2"
                        : "border-wall-line bg-wall-2 text-ivory hover:border-brass/60"
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {picked && (
          <button
            onClick={next}
            className="btn btn-ivory"
          >
            {current + 1 >= ROUNDS ? "See results" : "Next postcard"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Results overlay */}
      {finished && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-wall/90 px-6 text-center backdrop-blur-sm">
          {score >= 7 && <ConfettiOverlay />}
          <p className="label text-brass">
            Final score
          </p>
          <h2 className="mt-3 font-display text-5xl italic tabular-nums text-ivory">
            {score} / {ROUNDS}
          </h2>
          <p className="mt-3 font-display text-xl italic text-brass-2">{rankFor(score)}</p>
          {newBest ? (
            <p className="label mt-3 text-teal">
              New personal best
            </p>
          ) : (
            best !== null && (
              <p className="mt-3 text-[13px] tabular-nums text-mist">
                Best: {best} / {ROUNDS}
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
