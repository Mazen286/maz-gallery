"use client"

import { useRef, useCallback, type ReactNode } from "react"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface TiltCardProps {
  children: ReactNode
  className?: string
  bobDelay?: number
}

export function TiltCard({ children, className = "", bobDelay = 0 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const handleUpdate = useCallback(
    (pos: { elementX: number; elementY: number; isInside: boolean }) => {
      const el = ref.current
      if (!el || reduced) return

      if (!pos.isInside) {
        el.style.transition = "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)"
        el.style.transform = ""
        if (spotlightRef.current) {
          spotlightRef.current.style.opacity = "0"
        }
        return
      }

      const rect = el.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateY = ((pos.elementX - centerX) / centerX) * 8
      const rotateX = ((centerY - pos.elementY) / centerY) * 8

      el.style.transition = "none"
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`

      if (spotlightRef.current) {
        const pctX = (pos.elementX / rect.width) * 100
        const pctY = (pos.elementY / rect.height) * 100
        spotlightRef.current.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(120,200,214,0.15), transparent 60%)`
        spotlightRef.current.style.opacity = "1"
      }
    },
    [reduced]
  )

  useMousePosition(ref, handleUpdate)

  return (
    <div
      ref={ref}
      className={`animate-float-bob relative ${className}`}
      style={{
        willChange: "transform",
        transformStyle: "preserve-3d",
        animationDelay: `${bobDelay}ms`,
      }}
    >
      {/* Spotlight overlay */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
