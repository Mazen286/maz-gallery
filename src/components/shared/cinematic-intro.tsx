"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useSessionFlag } from "@/hooks/use-client-state"

// A short title card on the first visit to the entrance. Deep links into
// other rooms skip it: someone following a link to a photo or a post
// should land on that content, not on a curtain.
const LIGHTLEAK_AT = 250
const REVEAL_AT = 700
const DONE_AT = 1300

const markSeen = () => {
  try {
    sessionStorage.setItem("intro-seen", "1")
  } catch {}
}

export function CinematicIntro() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const seen = useSessionFlag("intro-seen")
  const [phase, setPhase] = useState<"black" | "lightleak" | "reveal" | "done">("black")
  const [skipped, setSkipped] = useState(false)

  // Everything that decides whether the curtain shows is derived, not copied into state
  const active = pathname === "/" && !reduced && !seen && !skipped && phase !== "done"

  useEffect(() => {
    if (!active) return
    const t1 = setTimeout(() => setPhase("lightleak"), LIGHTLEAK_AT)
    const t2 = setTimeout(() => setPhase("reveal"), REVEAL_AT)
    const t3 = setTimeout(() => {
      setPhase("done")
      markSeen()
    }, DONE_AT)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [active])

  const skip = () => {
    setSkipped(true)
    markSeen()
  }

  // Escape, Enter, or Space skips, so keyboard visitors are never stuck behind it
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      onClick={skip}
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: phase === "black" ? 1 : phase === "lightleak" ? 0.85 : 0 }}
      />

      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: phase === "lightleak" ? 1 : 0,
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(120,200,214,0.3) 0%, rgba(255,200,120,0.15) 30%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 text-center transition-all duration-500"
        style={{
          opacity: phase === "lightleak" || phase === "reveal" ? 1 : 0,
          transform: phase === "reveal" ? "scale(1.06)" : "scale(1)",
        }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-teal/80">Now showing</p>
        <p className="mt-4 font-display text-5xl font-semibold text-white sm:text-7xl">
          Maz <span className="italic">Gallery</span>
        </p>
        <p className="mt-3 text-sm tracking-wide text-white/40">Photographs by Mazen Abugharbieh</p>
        <div className="mx-auto mt-4 h-px w-24 bg-teal/50" />
      </div>

      <button
        type="button"
        onClick={skip}
        autoFocus
        className="absolute bottom-8 rounded-full border border-white/20 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        Skip
      </button>
    </div>
  )
}
