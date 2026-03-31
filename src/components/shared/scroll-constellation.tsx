"use client"

import { useEffect, useState, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "philosophy", label: "Philosophy" },
  { id: "story", label: "Story" },
  { id: "featured", label: "Press" },
  { id: "marquee", label: "Marquee" },
]

export function ScrollConstellation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const reduced = useReducedMotion()
  const tickingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? scrollTop / docHeight : 0
        setScrollProgress(progress)

        const sectionIndex = Math.min(
          Math.floor(progress * SECTIONS.length),
          SECTIONS.length - 1
        )
        setActiveIndex(sectionIndex)
        tickingRef.current = false
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (reduced) return null

  const dotSpacing = 48
  const totalHeight = (SECTIONS.length - 1) * dotSpacing
  const startY = 50 // percent from top, roughly centered

  return (
    <div
      className="pointer-events-none fixed right-6 top-0 z-40 hidden h-full lg:block"
      aria-hidden="true"
    >
      <div
        className="absolute right-0"
        style={{ top: `calc(${startY}% - ${totalHeight / 2}px)` }}
      >
        {/* Connection lines */}
        <svg
          width="20"
          height={totalHeight + 20}
          className="absolute -left-2.5 -top-2.5"
        >
          {SECTIONS.map((_, i) => {
            if (i === SECTIONS.length - 1) return null
            const y1 = i * dotSpacing + 10
            const y2 = (i + 1) * dotSpacing + 10
            const isActive = i <= activeIndex
            return (
              <line
                key={i}
                x1="10"
                y1={y1}
                x2="10"
                y2={y2}
                stroke={isActive ? "rgba(120,200,214,0.4)" : "rgba(120,200,214,0.1)"}
                strokeWidth="1"
                style={{
                  transition: "stroke 0.5s ease",
                }}
              />
            )
          })}
        </svg>

        {/* Dots */}
        {SECTIONS.map((section, i) => {
          const isActive = i === activeIndex
          const isPast = i < activeIndex
          return (
            <div
              key={section.id}
              className="pointer-events-auto relative flex items-center"
              style={{ marginBottom: i < SECTIONS.length - 1 ? dotSpacing - 8 : 0 }}
            >
              {/* Label (appears on hover) */}
              <span
                className="absolute right-6 whitespace-nowrap text-xs font-medium text-teal/0 transition-all duration-300 hover:text-teal"
                style={{ opacity: isActive ? 0.6 : 0 }}
              >
                {section.label}
              </span>
              {/* Dot */}
              <div
                className="relative h-2 w-2 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: isActive
                    ? "#78c8d6"
                    : isPast
                      ? "rgba(120,200,214,0.4)"
                      : "rgba(120,200,214,0.15)",
                  boxShadow: isActive ? "0 0 8px rgba(120,200,214,0.6)" : "none",
                  transform: isActive ? "scale(1.5)" : "scale(1)",
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
