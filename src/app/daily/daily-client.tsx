"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2, Check, ArrowRight, History } from "lucide-react"
import { msUntilNextPostcard, type DailyPuzzle } from "@/lib/daily"
import { photoSlug } from "@/lib/gallery"
import { useLocalJSON } from "@/hooks/use-client-state"
import { ConfettiOverlay } from "@/components/gallery/games/confetti"

const MAX_TRIES = 3
const STATE_KEY = "mazgallery.daily.state.v1"
const STATS_KEY = "mazgallery.daily.stats.v1"

interface DayState {
  key: string
  guesses: string[]
  won: boolean
}

interface Stats {
  streak: number
  maxStreak: number
  played: number
  wins: number
  lastKey: string
  lastWinKey: string
}

const EMPTY_STATS: Stats = { streak: 0, maxStreak: 0, played: 0, wins: 0, lastKey: "", lastWinKey: "" }

function squares(guesses: string[], won: boolean): string {
  const cells: string[] = guesses.map((_, i) =>
    won && i === guesses.length - 1 ? "🟩" : "🟥"
  )
  while (cells.length < MAX_TRIES) cells.push("⬜")
  if (won) cells[guesses.length - 1] = "🟩"
  return cells.join("")
}

// The puzzle is chosen on the server (UTC) so the first paint, crawlers,
// and link previews all see today's card; only progress lives in the browser.
export function DailyPostcard({ puzzle, yesterday }: { puzzle: DailyPuzzle; yesterday: DailyPuzzle | null }) {
  // What this browser remembers (empty during server render), overridden by
  // anything done in this session
  const storedDay = useLocalJSON<DayState>(STATE_KEY, { key: "", guesses: [], won: false })
  const storedStats = useLocalJSON<Stats>(STATS_KEY, EMPTY_STATS)
  const [session, setSession] = useState<{ guesses: string[]; won: boolean } | null>(null)
  const [sessionStats, setSessionStats] = useState<Stats | null>(null)
  const restored = storedDay.key === puzzle.key ? storedDay : null
  const guesses = session?.guesses ?? restored?.guesses ?? []
  const won = session?.won ?? restored?.won ?? false
  const stats = sessionStats ?? storedStats
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState("")

  const done = won || guesses.length >= MAX_TRIES

  // Countdown to the next postcard (UTC midnight); reload when it arrives
  useEffect(() => {
    const tick = () => {
      const ms = msUntilNextPostcard()
      if (ms <= 0) {
        window.location.reload()
        return
      }
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      setCountdown(`${h}h ${String(m).padStart(2, "0")}m`)
    }
    tick()
    const t = setInterval(tick, 30000)
    return () => clearInterval(t)
  }, [])

  const choose = (option: string) => {
    if (done || guesses.includes(option)) return
    const correct = option === puzzle.image.location
    const nextGuesses = [...guesses, option]
    const nowWon = correct
    const nowDone = nowWon || nextGuesses.length >= MAX_TRIES
    setSession({ guesses: nextGuesses, won: nowWon })
    try {
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({ key: puzzle.key, guesses: nextGuesses, won: nowWon })
      )
    } catch {}

    if (nowDone && stats.lastKey !== puzzle.key) {
      const streak = nowWon ? (yesterday && stats.lastWinKey === yesterday.key ? stats.streak + 1 : 1) : 0
      const next: Stats = {
        streak,
        maxStreak: Math.max(stats.maxStreak, streak),
        played: stats.played + 1,
        wins: stats.wins + (nowWon ? 1 : 0),
        lastKey: puzzle.key,
        lastWinKey: nowWon ? puzzle.key : stats.lastWinKey,
      }
      setSessionStats(next)
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(next))
      } catch {}
    }
  }

  const share = async () => {
    const text = `The Daily Postcard No. ${puzzle.number}\n${squares(guesses, won)}\nhttps://maz.gallery/daily`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const triesLeft = MAX_TRIES - guesses.length

  return (
    <section data-tone="dark" className="relative min-h-[100svh] bg-wall px-5 pb-24 pt-28 text-ivory sm:px-6 sm:pt-36">
      {won && <ConfettiOverlay />}
      <div className="mx-auto max-w-xl">
        <div className="animate-rise-in">
          <p className="label text-brass">No. 06 &middot; Daily Postcard</p>
          <h1 className="mt-4 font-display text-[40px] font-normal leading-tight tracking-[-0.01em] sm:text-[52px]">
            The Daily <span className="italic">Postcard</span>
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-[15px] text-mist">
            <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
            Postcard {puzzle.number}: one photo, three tries
          </p>
        </div>

        {/* The postcard */}
        <figure className="mt-8 -rotate-1">
          <div className="frame">
            <Image
              src={puzzle.image.src}
              alt="Today's postcard. Guess where it was taken."
              width={puzzle.image.width}
              height={puzzle.image.height}
              className="h-auto w-full object-cover"
              sizes="(max-width: 640px) 90vw, 576px"
              preload
            />
          </div>
        </figure>

        {/* Tries */}
        <div className="mt-6 flex items-center justify-between">
          <p className="font-display text-xl italic text-ivory">
            {done
              ? won
                ? "You found it."
                : "Not this time."
              : "Where was this taken?"}
          </p>
          <div className="flex gap-1.5" aria-label={`${triesLeft} tries remaining`}>
            {Array.from({ length: MAX_TRIES }).map((_, i) => {
              const wrong = !won && i < guesses.length
              const winIdx = won && i === guesses.length - 1
              return (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${
                    winIdx ? "bg-teal" : wrong ? "bg-[#e0786c]" : "bg-wall-3 ring-1 ring-wall-line"
                  }`}
                />
              )
            })}
          </div>
        </div>

        {/* Options */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {puzzle.options.map((option) => {
            const guessedWrong = guesses.includes(option) && option !== puzzle.image.location
            const revealCorrect = done && option === puzzle.image.location
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                disabled={done || guessedWrong}
                className={`min-h-12 border px-4 py-3 text-[15px] transition-colors ${
                  revealCorrect
                    ? "border-teal bg-teal/15 text-teal"
                    : guessedWrong
                      ? "border-[#e0786c]/60 bg-[#e0786c]/10 text-[#f2b1a8] line-through decoration-[#e0786c]/70"
                      : done
                        ? "border-wall-line text-mist-2"
                        : "border-wall-line bg-wall-2 text-ivory hover:border-brass/60"
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Reveal */}
        {done && (
          <div className="mt-8 border border-wall-line bg-wall-2 p-5 sm:p-6" style={{ animation: "placardIn 0.4s ease-out both" }}>
            <p className="label text-brass">{puzzle.image.location}</p>
            <p className="mt-2 font-display text-xl italic text-ivory">{puzzle.image.alt}</p>
            {puzzle.image.story && (
              <p className="mt-3 text-[15px] leading-relaxed text-mist">{puzzle.image.story}</p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={share}
                className="btn btn-ivory"
              >
                {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
                {copied ? "Copied" : "Share result"}
              </button>
              <Link
                href={`/gallery/${photoSlug(puzzle.image)}`}
                className="link-arrow text-ivory"
              >
                See it in the gallery
              </Link>
            </div>
          </div>
        )}

        {/* Stats strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-wall-line pt-5 text-[13px] tabular-nums text-mist">
          <span>
            <span className={stats.streak > 0 ? "text-teal" : "text-ivory"}>Streak {stats.streak}</span> &middot; Best {stats.maxStreak} &middot; Played {stats.played}
            {stats.played > 0 && <> &middot; {Math.round((stats.wins / stats.played) * 100)}% won</>}
          </span>
          <span className="text-mist-2">Next postcard in {countdown}</span>
        </div>

        {/* Yesterday's answer, for the ones who missed it */}
        {yesterday && (
          <Link
            href={`/gallery/${photoSlug(yesterday.image)}`}
            className="group mt-6 flex items-center gap-4 border border-wall-line bg-wall-2 p-3 transition-colors hover:border-brass/50"
          >
            <div className="relative h-14 w-20 shrink-0 overflow-hidden">
              <Image src={yesterday.image.src} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="label flex items-center gap-1.5 text-mist-2">
                <History className="size-3.5" aria-hidden="true" />
                Yesterday&apos;s postcard
              </p>
              <p className="mt-1 font-display italic leading-snug text-ivory">
                {yesterday.image.alt} <span className="not-italic text-mist">&middot; {yesterday.image.location}</span>
              </p>
            </div>
            <ArrowRight className="ml-auto size-4 shrink-0 text-mist-2 group-hover:text-brass" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  )
}
