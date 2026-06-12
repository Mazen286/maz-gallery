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

function buildRounds(images: GalleryImage[]): Round[] {
  const located = images.filter((img) => img.location)
  const allLocations = [...new Set(located.map((img) => img.location as string))]
  return shuffle(located)
    .slice(0, ROUNDS)
    .map((image) => {
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

export function PostcardsGame({ images, onBack }: PostcardsGameProps) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState<number | null>(null)
  const [newBest, setNewBest] = useState(false)

  const reset = useCallback(() => {
    setRounds(buildRounds(images))
    setCurrent(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setNewBest(false)
  }, [images])

  useEffect(() => reset(), [reset])

  useEffect(() => {
    const stored = Number(localStorage.getItem(BEST_KEY))
    if (!Number.isNaN(stored) && localStorage.getItem(BEST_KEY) !== null) setBest(stored)
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
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Game Room
        </button>
        <span className="font-mono text-sm text-teal">
          {score} / {ROUNDS}
        </span>
      </div>

      <div className="px-5 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
          Postcard {current + 1} of {ROUNDS}
        </p>
        <h2 className="mt-1 font-display text-2xl italic text-white/90 sm:text-3xl">
          Where was this taken?
        </h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-5 py-4 sm:px-8">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-white/15 bg-black/40 p-2 shadow-2xl">
          <Image
            src={round.image.src}
            alt="A photo from the collection. Guess the location."
            width={round.image.width}
            height={round.image.height}
            className="mx-auto max-h-[42vh] w-auto rounded object-contain"
          />
          {picked && (
            <p className="px-2 pb-1 pt-3 text-center text-xs italic text-white/50">
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
                className={`rounded-md border px-4 py-3 text-sm transition-all ${
                  isCorrect
                    ? "border-teal bg-teal/20 text-teal"
                    : isWrongPick
                      ? "border-red-400/60 bg-red-400/10 text-red-300"
                      : picked
                        ? "border-white/10 text-white/30"
                        : "border-white/15 text-white/70 hover:border-teal/50 hover:text-white"
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
            className="flex items-center gap-2 rounded-full border border-teal px-5 py-2 text-sm text-teal transition-all hover:bg-teal/10"
          >
            {current + 1 >= ROUNDS ? "See results" : "Next postcard"}
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>

      {/* Results overlay */}
      {finished && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 px-6 text-center">
          {score >= 7 && <ConfettiOverlay />}
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70">
            Final score
          </p>
          <h2 className="mt-2 font-display text-5xl italic text-white">
            {score} / {ROUNDS}
          </h2>
          <p className="mt-3 font-display text-xl italic text-teal">{rankFor(score)}</p>
          {newBest ? (
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-teal/80">
              New personal best
            </p>
          ) : (
            best !== null && (
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-white/35">
                Best: {best} / {ROUNDS}
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
