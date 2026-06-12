"use client"

import Image from "next/image"
import { useRef, useCallback, useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useTimeTheme, type TimeOfDay } from "@/hooks/use-time-theme"

const GREETINGS: Record<TimeOfDay, string> = {
  morning: "Good morning. The gallery just opened.",
  afternoon: "The gallery is open. Come in.",
  evening: "Golden hour at the gallery.",
  night: "The gallery is open late tonight.",
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { period } = useTimeTheme()
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const mousePos = useRef({ x: 0.5, y: 0.42 })
  const spotPos = useRef({ x: 0.5, y: 0.42 })
  const driftT = useRef(0)
  const hasMouse = useRef(false)
  const raf = useRef<number>(0)

  const photoRef = useRef<HTMLDivElement>(null)
  const arabicRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia("(pointer: coarse)").matches) setIsTouch(true)
  }, [])

  const animate = useCallback(() => {
    if (reduced) return
    const el = sectionRef.current
    if (!el) return

    // Spotlight: follow the cursor, or drift on its own until one shows up
    if (hasMouse.current) {
      spotPos.current.x += (mousePos.current.x - spotPos.current.x) * 0.08
      spotPos.current.y += (mousePos.current.y - spotPos.current.y) * 0.08
    } else {
      driftT.current += 0.004
      spotPos.current.x = 0.5 + Math.sin(driftT.current) * 0.26
      spotPos.current.y = 0.4 + Math.cos(driftT.current * 0.7) * 0.16
    }
    el.style.setProperty("--spot-x", `${spotPos.current.x * 100}%`)
    el.style.setProperty("--spot-y", `${spotPos.current.y * 100}%`)

    // Depth parallax against the cursor
    const mx = spotPos.current.x - 0.5
    const my = spotPos.current.y - 0.5
    if (photoRef.current) {
      photoRef.current.style.transform = `translate(${-mx * 18}px, ${-my * 12}px) scale(1.06)`
    }
    if (arabicRef.current) {
      arabicRef.current.style.transform = `translate(${-mx * 35}px, ${-my * 25}px)`
    }

    raf.current = requestAnimationFrame(animate)
  }, [reduced])

  useEffect(() => {
    if (reduced) {
      // Static centered light, no animation
      sectionRef.current?.style.setProperty("--spot-x", "50%")
      sectionRef.current?.style.setProperty("--spot-y", "40%")
      return
    }

    const handleMouse = (e: MouseEvent) => {
      const el = sectionRef.current
      if (!el) return
      hasMouse.current = true
      const rect = el.getBoundingClientRect()
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    window.addEventListener("mousemove", handleMouse, { passive: true })
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouse)
      cancelAnimationFrame(raf.current)
    }
  }, [animate, reduced])

  const spotRadius = isTouch ? "19rem" : "24rem"

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-[#0a0c11]"
      style={{ "--spot-x": "50%", "--spot-y": "42%" } as React.CSSProperties}
    >
      {/* Portrait layer with parallax */}
      <div
        ref={photoRef}
        className="absolute inset-0"
        style={{ willChange: "transform", transform: "scale(1.06)" }}
      >
        <Image
          src="/images/hero-portrait.jpg"
          alt="Mazen Abugharbieh"
          fill
          preload
          className="object-cover object-[center_15%]"
          sizes="100vw"
        />
      </div>

      {/* After-hours veil: dark everywhere except inside the spotlight */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: "rgba(6, 8, 13, 0.78)",
          WebkitMaskImage: `radial-gradient(circle ${spotRadius} at var(--spot-x) var(--spot-y), rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 48%, rgba(0,0,0,1) 80%)`,
          maskImage: `radial-gradient(circle ${spotRadius} at var(--spot-x) var(--spot-y), rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 48%, rgba(0,0,0,1) 80%)`,
        }}
      />

      {/* Warm lamp glow inside the beam */}
      <div
        className="absolute inset-0 mix-blend-screen"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle ${spotRadius} at var(--spot-x) var(--spot-y), rgba(255, 214, 150, 0.12) 0%, transparent 65%)`,
        }}
      />

      {/* Readability gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c11] via-[#0a0c11]/35 to-transparent" aria-hidden="true" />

      {/* Arabic ghost layer, deepest parallax */}
      <p
        ref={arabicRef}
        className="pointer-events-none absolute bottom-[8%] left-[3%] select-none font-bold leading-none text-white/[0.07]"
        style={{ willChange: "transform", fontSize: "clamp(10rem, 28vw, 28rem)" }}
        dir="rtl"
        lang="ar"
        aria-hidden="true"
      >
        مازن
      </p>

      {/* Foreground content */}
      <div className="relative z-10 flex min-h-[100svh] items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 sm:pb-20">
          {/* Time-aware greeting */}
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal transition-opacity duration-700"
            style={{ opacity: mounted ? 1 : 0 }}
          >
            {GREETINGS[period]}
          </p>

          {/* Name */}
          <h1
            className="mt-5 font-display font-semibold leading-[0.95] text-white transition-all duration-700"
            style={{
              fontSize: "clamp(2.9rem, 10vw, 8.5rem)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
            }}
          >
            Mazen
            <br />
            <span className="italic text-white/85">Abugharbieh</span>
          </h1>

          <p
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45 transition-opacity duration-700"
            style={{ opacity: mounted ? 1 : 0, transitionDelay: "400ms" }}
          >
            Data &middot; Photography &middot; Startups &middot; San Diego
          </p>

          {/* Scroll cue */}
          <div
            className="mt-10 flex items-center gap-3 transition-opacity duration-700"
            style={{ opacity: mounted ? 0.5 : 0, transitionDelay: "800ms" }}
          >
            <div className="h-8 w-px bg-gradient-to-b from-teal to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              Begin the tour
            </p>
          </div>
        </div>
      </div>

      {/* Museum label placard */}
      <div
        className="absolute bottom-14 right-6 z-10 hidden max-w-[230px] border border-white/15 bg-black/30 p-4 backdrop-blur-sm transition-opacity duration-1000 md:block lg:right-10"
        style={{ opacity: mounted ? 1 : 0, transitionDelay: "1100ms" }}
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
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-teal/70">
          Permanent collection
        </p>
      </div>
    </section>
  )
}
