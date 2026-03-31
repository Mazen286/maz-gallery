"use client"

import Image from "next/image"
import { useRef, useCallback } from "react"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const arabicRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  const handleMouseUpdate = useCallback(
    (pos: { elementX: number; elementY: number; isInside: boolean }) => {
      if (reduced) return
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (!pos.isInside) {
        if (nameRef.current) {
          nameRef.current.style.transition = "transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)"
          nameRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
          nameRef.current.style.textShadow = "none"
        }
        if (arabicRef.current) {
          arabicRef.current.style.transition = "transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)"
          arabicRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translate(-50%, -50%)"
        }
        return
      }

      const rotateY = ((pos.elementX - centerX) / centerX) * 12
      const rotateX = ((centerY - pos.elementY) / centerY) * 8
      const shadowX = ((pos.elementX - centerX) / centerX) * 6
      const shadowY = ((pos.elementY - centerY) / centerY) * 6

      if (nameRef.current) {
        nameRef.current.style.transition = "none"
        nameRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        nameRef.current.style.textShadow = `${shadowX}px ${shadowY}px 12px rgba(36,48,72,0.25)`
      }

      if (arabicRef.current) {
        arabicRef.current.style.transition = "none"
        arabicRef.current.style.transform = `perspective(1000px) rotateX(${rotateX * 0.4}deg) rotateY(${rotateY * 0.4}deg) translate(-50%, -50%)`
      }
    },
    [reduced]
  )

  useMousePosition(sectionRef, handleMouseUpdate)

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            {/* Ghost Arabic layer behind */}
            <p
              ref={arabicRef}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[12rem] font-bold text-navy/[0.04] sm:text-[16rem]"
              style={{ willChange: "transform" }}
              dir="rtl"
              aria-hidden="true"
            >
              مازن
            </p>

            {/* Main name with 3D parallax */}
            <h1
              ref={nameRef}
              className="relative z-10 text-6xl font-bold leading-[0.95] text-navy sm:text-7xl lg:text-8xl"
              style={{ willChange: "transform" }}
            >
              Mazen
              <br />
              Abugharbieh
            </h1>
            <p className="relative z-10 mt-2 text-4xl font-bold text-teal sm:text-5xl lg:text-6xl" dir="rtl">
              مازن
            </p>
            <p className="relative z-10 mt-6 text-sm font-medium uppercase tracking-[0.25em] text-charcoal/60">
              Data Analyst / Photographer / Startup Co-Founder / San Diego
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Morphing data-viz background patterns */}
              <div className="absolute -inset-4 overflow-hidden rounded-2xl bg-charcoal">
                {/* Pattern 1: Dot grid */}
                <div
                  className="animate-pattern-1 absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(120,200,214,0.3) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    willChange: "opacity",
                  }}
                />
                {/* Pattern 2: Grid lines */}
                <div
                  className="animate-pattern-2 absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(120,200,214,0.15) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(120,200,214,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                    willChange: "opacity",
                  }}
                />
                {/* Pattern 3: Diagonal lines */}
                <div
                  className="animate-pattern-3 absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(120,200,214,0.1) 20px, rgba(120,200,214,0.1) 21px)",
                    willChange: "opacity",
                  }}
                />
              </div>
              <Image
                src="/images/headshot.jpg"
                alt="Mazen Abugharbieh"
                width={500}
                height={520}
                priority
                className="relative z-10 h-auto w-80 rounded-2xl object-cover sm:w-96"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
