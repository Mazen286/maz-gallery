"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useSessionFlag } from "@/hooks/use-client-state"

// A short title card on the first visit to the entrance. Deep links into
// other rooms skip it: someone following a link to a photo or a post
// should land on that content, not on a curtain.
//
// The card is in the page's HTML, so its timing runs on CSS animations
// (introBlack, introLeak, introTitle, introDone in globals.css) that start
// on first paint: black until 250 ms, the light leak and title until 700 ms,
// then the reveal, gone at 1300 ms. It no longer waits for the JavaScript to
// arrive before it starts counting. A small script in the root layout hides
// it before it is ever drawn for anyone who has already seen it this session
// or prefers reduced motion.

const markSeen = () => {
  try {
    sessionStorage.setItem("intro-seen", "1")
  } catch {}
}

export function CinematicIntro() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const seen = useSessionFlag("intro-seen")
  const [done, setDone] = useState(false)
  const curtain = useRef<HTMLDivElement>(null)

  // Everything that decides whether the curtain shows is derived, not copied into state
  const active = pathname === "/" && !reduced && !seen && !done

  const finish = () => {
    setDone(true)
    markSeen()
  }

  // Unmount once the curtain's own animation has run out (it may already have,
  // if the JavaScript arrived late)
  useEffect(() => {
    if (!active) return
    const anim = curtain.current?.getAnimations?.().find((a) => (a as CSSAnimation).animationName === "introDone")
    if (!anim) return
    let live = true
    anim.finished.then(() => live && finish(), () => {})
    return () => {
      live = false
    }
  }, [active])

  // Escape, Enter, or Space skips, so keyboard visitors are never stuck behind it
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active])

  if (!active) return null

  return (
    <div
      id="intro-curtain"
      ref={curtain}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ animation: "introDone 1300ms step-end both" }}
      onClick={finish}
      role="presentation"
    >
      <div className="absolute inset-0 bg-black" style={{ animation: "introBlack 1300ms linear both" }} />

      <div
        className="absolute inset-0"
        style={{
          animation: "introLeak 1300ms linear both",
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(120,200,214,0.3) 0%, rgba(255,200,120,0.15) 30%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center" style={{ animation: "introTitle 1300ms linear both" }}>
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-teal/80">Now showing</p>
        <p className="mt-4 font-display text-5xl font-semibold text-white sm:text-7xl">
          Maz <span className="italic">Gallery</span>
        </p>
        <p className="mt-3 text-sm tracking-wide text-white/40">Photographs by Mazen Abugharbieh</p>
        <div className="mx-auto mt-4 h-px w-24 bg-teal/50" />
      </div>

      <button
        type="button"
        onClick={finish}
        autoFocus
        className="absolute bottom-8 rounded-full border border-white/20 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        Skip
      </button>
    </div>
  )
}
