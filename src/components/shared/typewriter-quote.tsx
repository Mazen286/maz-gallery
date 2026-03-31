"use client"

import { useState, useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface TypewriterQuoteProps {
  text: string
  className?: string
}

export function TypewriterQuote({ text, className = "" }: TypewriterQuoteProps) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // Intersection observer to trigger typing
  useEffect(() => {
    if (reduced) {
      setDisplayText(text)
      setDone(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started, text, reduced])

  // Typing animation
  useEffect(() => {
    if (!started || reduced) return

    setShowCursor(true)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        // Blink cursor twice then hide
        setTimeout(() => setShowCursor(false), 1200)
        setTimeout(() => setDone(true), 2000)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [started, text, reduced])

  return (
    <div ref={ref} className={`py-8 sm:py-12 ${className}`}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="min-h-[3em] text-xl italic leading-relaxed text-charcoal/60 sm:text-2xl">
          &ldquo;{displayText}&rdquo;
          {showCursor && (
            <span className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-teal" />
          )}
        </p>
      </div>
    </div>
  )
}
