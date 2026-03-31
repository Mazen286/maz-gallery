"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const WORDS = [
  "data", "stories", "photography", "San Diego", "dashboards",
  "insights", "startup", "creativity", "analytics", "engineer",
  "pixels", "patterns", "explore", "discover", "surfboards",
]

interface FloatingWord {
  id: number
  x: number
  y: number
  word: string
  opacity: number
}

export function CursorWords() {
  const [words, setWords] = useState<FloatingWord[]>([])
  const reduced = useReducedMotion()
  const counterRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const isHeroRef = useRef(false)

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    const handleMove = (e: MouseEvent) => {
      // Only spawn in hero section
      const hero = document.getElementById("hero")
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      isHeroRef.current =
        e.clientY >= rect.top && e.clientY <= rect.bottom &&
        e.clientX >= rect.left && e.clientX <= rect.right

      if (!isHeroRef.current) return

      const now = Date.now()
      if (now - lastSpawnRef.current < 200) return // throttle
      lastSpawnRef.current = now

      const id = counterRef.current++
      const word = WORDS[Math.floor(Math.random() * WORDS.length)]

      setWords((prev) => {
        const next = [...prev, { id, x: e.clientX, y: e.clientY, word, opacity: 0.4 }]
        // Keep max 15 words
        return next.slice(-15)
      })

      // Remove after fade
      setTimeout(() => {
        setWords((prev) => prev.filter((w) => w.id !== id))
      }, 2000)
    }

    window.addEventListener("mousemove", handleMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMove)
  }, [reduced])

  if (reduced || words.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9996]" aria-hidden="true">
      {words.map((w) => (
        <span
          key={w.id}
          className="absolute font-mono text-xs text-teal/40"
          style={{
            left: w.x,
            top: w.y,
            animation: "wordFade 2s ease-out forwards",
          }}
        >
          {w.word}
        </span>
      ))}
    </div>
  )
}
