"use client"

import Image from "next/image"
import { useRef, useCallback, useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const mousePos = useRef({ x: 0.5, y: 0.5 })
  const raf = useRef<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Smooth parallax via rAF
  const photoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const arabicRef = useRef<HTMLParagraphElement>(null)

  const animate = useCallback(() => {
    if (reduced) return
    const mx = mousePos.current.x - 0.5 // -0.5 to 0.5
    const my = mousePos.current.y - 0.5

    // Photo shifts opposite to mouse (depth illusion)
    if (photoRef.current) {
      photoRef.current.style.transform = `translate(${-mx * 20}px, ${-my * 15}px) scale(1.05)`
    }
    // Text shifts with mouse (foreground layer)
    if (textRef.current) {
      textRef.current.style.transform = `translate(${mx * 10}px, ${my * 8}px)`
    }
    // Arabic ghost layer - deeper parallax
    if (arabicRef.current) {
      arabicRef.current.style.transform = `translate(${-mx * 35}px, ${-my * 25}px)`
    }

    raf.current = requestAnimationFrame(animate)
  }, [reduced])

  useEffect(() => {
    if (reduced) return

    const handleMouse = (e: MouseEvent) => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    window.addEventListener("mousemove", handleMouse)
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouse)
      cancelAnimationFrame(raf.current)
    }
  }, [animate, reduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-charcoal"
    >
      {/* Background photo layer - parallax */}
      <div
        ref={photoRef}
        className="absolute inset-0 transition-transform duration-100"
        style={{ willChange: "transform", transform: "scale(1.05)" }}
      >
        <Image
          src="/images/hero-portrait.jpg"
          alt="Mazen Abugharbieh"
          fill
          priority
          className="object-cover object-[center_25%]"
          sizes="100vw"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-transparent to-transparent" />
      </div>

      {/* Arabic ghost layer - centered behind name, deepest parallax */}
      <p
        ref={arabicRef}
        className="pointer-events-none absolute bottom-[8%] left-[3%] select-none font-bold leading-none text-white/[0.08]"
        style={{
          willChange: "transform",
          fontSize: "clamp(10rem, 28vw, 28rem)",
        }}
        dir="rtl"
        lang="ar"
        aria-hidden="true"
      >
        مازن
      </p>

      {/* Foreground content - text layer */}
      <div
        ref={textRef}
        className="relative z-10 flex min-h-screen items-end"
        style={{ willChange: "transform" }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-24">
          {/* Subtitle */}
          <p
            className="text-xs font-medium uppercase tracking-[0.4em] text-teal transition-opacity duration-700"
            style={{ opacity: mounted ? 1 : 0 }}
          >
            Data &middot; Photography &middot; Startups &middot; San Diego
          </p>

          {/* Name */}
          <h1
            className="mt-4 font-bold leading-[0.9] text-white transition-all duration-700"
            style={{
              fontSize: "clamp(2.8rem, 10vw, 9rem)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
            }}
          >
            Mazen
            <br />
            <span className="text-white/90">Abugharbieh</span>
          </h1>

          {/* Scroll indicator */}
          <div
            className="mt-12 flex items-center gap-3 transition-opacity duration-700"
            style={{ opacity: mounted ? 0.4 : 0, transitionDelay: "800ms" }}
          >
            <div className="h-8 w-px bg-gradient-to-b from-teal to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
