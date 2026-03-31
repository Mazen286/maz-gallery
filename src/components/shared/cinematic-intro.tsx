"use client"

import { useState, useEffect } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function CinematicIntro() {
  const [phase, setPhase] = useState<"black" | "lightleak" | "reveal" | "done">("black")
  const [skip, setSkip] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Only play once per session
    if (sessionStorage.getItem("intro-seen") || reduced) {
      setPhase("done")
      return
    }

    const t1 = setTimeout(() => setPhase("lightleak"), 600)
    const t2 = setTimeout(() => setPhase("reveal"), 1800)
    const t3 = setTimeout(() => {
      setPhase("done")
      sessionStorage.setItem("intro-seen", "1")
    }, 3200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [reduced])

  useEffect(() => {
    if (skip) {
      setPhase("done")
      sessionStorage.setItem("intro-seen", "1")
    }
  }, [skip])

  if (phase === "done") return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      onClick={() => setSkip(true)}
      role="presentation"
    >
      {/* Black overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{
          opacity: phase === "black" ? 1 : phase === "lightleak" ? 0.85 : 0,
        }}
      />

      {/* Light leak effect */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: phase === "lightleak" ? 1 : phase === "reveal" ? 0 : 0,
          background: "radial-gradient(ellipse at 60% 40%, rgba(120,200,214,0.3) 0%, rgba(255,200,120,0.15) 30%, transparent 70%)",
        }}
      />

      {/* Title card */}
      <div
        className="relative z-10 text-center transition-all duration-1000"
        style={{
          opacity: phase === "lightleak" || phase === "reveal" ? 1 : 0,
          transform: phase === "reveal" ? "scale(1.1)" : "scale(1)",
        }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-teal/80">
          A portfolio by
        </p>
        <h1 className="mt-4 text-5xl font-bold text-white sm:text-7xl">
          Mazen Abugharbieh
        </h1>
        <div className="mx-auto mt-4 h-px w-24 bg-teal/50" />
      </div>

      {/* Skip hint */}
      <p className="absolute bottom-8 text-xs text-white/30">
        click anywhere to skip
      </p>
    </div>
  )
}
