"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useTimeTheme, type TimeOfDay } from "@/hooks/use-time-theme"

const GREETINGS: Record<TimeOfDay, string> = {
  morning: "Good morning. The gallery just opened.",
  afternoon: "The gallery is open. Come in.",
  evening: "Golden hour at the gallery.",
  night: "The gallery is open late tonight.",
}

// Staggered entrance: each block rises into place once, then everything is still
function entrance(mounted: boolean, delay: number): React.CSSProperties {
  return {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1100ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  }
}

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion()
  const { period } = useTimeTheme()

  useEffect(() => setMounted(true), [])

  const settled = mounted || reduced

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-[#0a0c11]">
      {/* Portrait settles with a single slow ease on load, then holds still */}
      <div
        className="absolute inset-0"
        style={{
          transform: settled ? "scale(1)" : "scale(1.05)",
          transition: "transform 2400ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Image
          src="/images/hero-portrait.jpg"
          alt="Mazen Abugharbieh"
          fill
          preload
          className="object-cover object-[center_15%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c11] via-[#0a0c11]/45 to-[#0a0c11]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c11]/55 via-transparent to-transparent" />
      </div>

      {/* Arabic watermark, still and faint */}
      <p
        className="pointer-events-none absolute bottom-[8%] left-[3%] select-none font-bold leading-none text-white/[0.05]"
        style={{ fontSize: "clamp(10rem, 28vw, 28rem)" }}
        dir="rtl"
        lang="ar"
        aria-hidden="true"
      >
        مازن
      </p>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 sm:pb-20">
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal"
            style={entrance(mounted, 150)}
          >
            {GREETINGS[period]}
          </p>

          <h1
            className="mt-5 font-display font-semibold leading-[0.95] text-white"
            style={{
              fontSize: "clamp(2.9rem, 10vw, 8.5rem)",
              ...entrance(mounted, 300),
            }}
          >
            Mazen
            <br />
            <span className="italic text-white/85">Abugharbieh</span>
          </h1>

          <p
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45"
            style={entrance(mounted, 550)}
          >
            Data &middot; Photography &middot; Startups &middot; San Diego
          </p>

          <div
            className="mt-10 flex items-center gap-3"
            style={entrance(mounted, 900)}
          >
            <div className="h-8 w-px bg-gradient-to-b from-teal to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Begin the tour
            </p>
          </div>
        </div>
      </div>

      {/* Museum label placard */}
      <div
        className="absolute bottom-14 right-6 z-10 hidden max-w-[230px] border border-white/15 bg-black/30 p-4 backdrop-blur-sm md:block lg:right-10"
        style={entrance(mounted, 1200)}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
          Self Portrait
        </p>
        <p className="mt-2 font-display text-xs italic text-white/55">
          Mixed media: data and light
        </p>
        <p className="mt-1 text-[10px] text-white/40">
          Analyst, photographer, founder
        </p>
      </div>
    </section>
  )
}
