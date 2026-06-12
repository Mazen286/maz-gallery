"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2, Check, ArrowRight } from "lucide-react"
import { getDailyPuzzle, dateKey, type DailyPuzzle } from "@/lib/daily"
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

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

function squares(guesses: string[], won: boolean): string {
  const cells: string[] = guesses.map((_, i) =>
    won && i === guesses.length - 1 ? "🟩" : "🟥"
  )
  while (cells.length < MAX_TRIES) cells.push("⬜")
  if (won) cells[guesses.length - 1] = "🟩"
  return cells.join("")
}

export function DailyPostcard() {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null)
  const [guesses, setGuesses] = useState<string[]>([])
  const [won, setWon] = useState(false)
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState("")

  const done = won || guesses.length >= MAX_TRIES

  // Everything is computed client-side so the puzzle follows the
  // visitor's local midnight
  useEffect(() => {
    const p = getDailyPuzzle()
    setPuzzle(p)
    const state = loadJSON<DayState>(STATE_KEY, { key: "", guesses: [], won: false })
    if (state.key === p.key) {
      setGuesses(state.guesses)
      setWon(state.won)
    }
    setStats(loadJSON<Stats>(STATS_KEY, EMPTY_STATS))
  }, [])

  // Countdown to the next postcard
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      const ms = midnight.getTime() - now.getTime()
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      setCountdown(`${h}h ${String(m).padStart(2, "0")}m`)
    }
    tick()
    const t = setInterval(tick, 30000)
    return () => clearInterval(t)
  }, [])

  if (!puzzle) {
    return <div className="min-h-[100svh] bg-[#0a0c11]" />
  }

  const choose = (option: string) => {
    if (done || guesses.includes(option)) return
    const correct = option === puzzle.image.location
    const nextGuesses = [...guesses, option]
    const nowWon = correct
    const nowDone = nowWon || nextGuesses.length >= MAX_TRIES
    setGuesses(nextGuesses)
    setWon(nowWon)
    try {
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({ key: puzzle.key, guesses: nextGuesses, won: nowWon })
      )
    } catch {}

    if (nowDone && stats.lastKey !== puzzle.key) {
      const yesterday = dateKey(new Date(Date.now() - 86400000))
      const streak = nowWon ? (stats.lastWinKey === yesterday ? stats.streak + 1 : 1) : 0
      const next: Stats = {
        streak,
        maxStreak: Math.max(stats.maxStreak, streak),
        played: stats.played + 1,
        wins: stats.wins + (nowWon ? 1 : 0),
        lastKey: puzzle.key,
        lastWinKey: nowWon ? puzzle.key : stats.lastWinKey,
      }
      setStats(next)
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(next))
      } catch {}
    }
  }

  const share = async () => {
    const text = `The Daily Postcard No. ${puzzle.number}\n${squares(guesses, won)}\nmaz.gallery/daily`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const triesLeft = MAX_TRIES - guesses.length

  return (
    <section className="relative min-h-[100svh] bg-[#0a0c11] px-6 pb-20 pt-28 sm:pt-32">
      {won && <ConfettiOverlay />}
      <div className="mx-auto max-w-xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal">
          The Annex &middot; Daily
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
          The Daily <span className="italic">Postcard</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
          No. {puzzle.number} &middot; one photo, three tries
        </p>

        {/* The postcard */}
        <figure className="mt-8 -rotate-1">
          <div className="border border-[#a08c5f]/35 bg-[#efece4] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.55)] sm:p-4">
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
          <p className="font-display text-lg italic text-white/80">
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
                    winIdx ? "bg-teal" : wrong ? "bg-red-400/70" : "bg-white/15"
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
                className={`rounded-md border px-4 py-3 text-sm transition-all ${
                  revealCorrect
                    ? "border-teal bg-teal/20 text-teal"
                    : guessedWrong
                      ? "border-red-400/50 bg-red-400/10 text-red-300/80"
                      : done
                        ? "border-white/10 text-white/30"
                        : "border-white/15 text-white/70 hover:border-teal/50 hover:text-white"
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Reveal */}
        {done && (
          <div className="mt-8 border border-white/10 bg-white/[0.03] p-5" style={{ animation: "placardIn 0.4s ease-out both" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal/70">
              {puzzle.image.location}
            </p>
            <p className="mt-2 font-display text-lg italic text-white/85">{puzzle.image.alt}</p>
            {puzzle.image.story && (
              <p className="mt-3 text-sm leading-relaxed text-white/50">{puzzle.image.story}</p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={share}
                className="flex items-center gap-2 rounded-full border border-teal px-5 py-2 text-sm text-teal transition-all hover:bg-teal/10"
              >
                {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
                {copied ? "Copied" : "Share result"}
              </button>
              <Link
                href={`/gallery?piece=${encodeURIComponent(puzzle.image.src)}`}
                className="flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
              >
                See it in the gallery
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Stats strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span>
            Streak {stats.streak} &middot; Max {stats.maxStreak} &middot; Played {stats.played}
            {stats.played > 0 && <> &middot; {Math.round((stats.wins / stats.played) * 100)}% won</>}
          </span>
          <span className="text-white/30">Next postcard in {countdown}</span>
        </div>
      </div>
    </section>
  )
}
