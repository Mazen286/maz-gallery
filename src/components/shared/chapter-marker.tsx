"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface ChapterMarkerProps {
  number: string
  title: string
  dark?: boolean
}

export function ChapterMarker({ number, title, dark = false }: ChapterMarkerProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })

  const textColor = dark ? "text-white/40" : "text-charcoal/40"

  return (
    <div ref={ref} className="flex items-center gap-4 pb-2 pt-8">
      <span
        className="font-mono text-xs uppercase tracking-[0.3em] text-teal transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(-10px)",
        }}
      >
        {number}
      </span>
      <div
        className="h-px flex-1 bg-teal/20 transition-all duration-1000"
        style={{
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
        }}
      />
      <span
        className={`text-xs font-medium uppercase tracking-[0.2em] transition-all duration-700 ${textColor}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(10px)",
          transitionDelay: "300ms",
        }}
      >
        {title}
      </span>
    </div>
  )
}
