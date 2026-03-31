"use client"

import { useEffect, useState, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

// Color stops mapped to scroll progress (0-1)
const COLOR_STOPS = [
  { at: 0, color: "rgba(255,255,255,0.95)" },       // Hero: white
  { at: 0.12, color: "rgba(255,255,255,0.95)" },    // About: white
  { at: 0.25, color: "rgba(248,250,252,0.95)" },    // Philosophy: slate-50
  { at: 0.38, color: "rgba(42,40,41,0.97)" },       // Story: charcoal
  { at: 0.52, color: "rgba(42,40,41,0.97)" },       // Story end
  { at: 0.65, color: "rgba(221,221,210,0.95)" },    // Featured: cream
  { at: 0.80, color: "rgba(221,221,210,0.95)" },    // Marquee: cream
  { at: 0.90, color: "rgba(42,40,41,0.97)" },       // Footer: charcoal
  { at: 1, color: "rgba(42,40,41,0.97)" },          // Footer end
]

function interpolateColor(progress: number): string {
  // Find the two surrounding stops
  let lower = COLOR_STOPS[0]
  let upper = COLOR_STOPS[COLOR_STOPS.length - 1]

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (progress >= COLOR_STOPS[i].at && progress <= COLOR_STOPS[i + 1].at) {
      lower = COLOR_STOPS[i]
      upper = COLOR_STOPS[i + 1]
      break
    }
  }

  const range = upper.at - lower.at
  const t = range > 0 ? (progress - lower.at) / range : 0

  // Parse rgba values
  const parse = (c: string) => {
    const m = c.match(/[\d.]+/g)
    return m ? m.map(Number) : [0, 0, 0, 0]
  }

  const [r1, g1, b1, a1] = parse(lower.color)
  const [r2, g2, b2, a2] = parse(upper.color)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  const a = (a1 + (a2 - a1) * t).toFixed(2)

  return `rgba(${r},${g},${b},${a})`
}

export function ScrollColorBackground() {
  const [color, setColor] = useState(COLOR_STOPS[0].color)
  const reduced = useReducedMotion()
  const tickingRef = useRef(false)

  useEffect(() => {
    if (reduced) return

    const handleScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
        setColor(interpolateColor(progress))
        tickingRef.current = false
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [reduced])

  if (reduced) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-20 transition-colors duration-150"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  )
}
