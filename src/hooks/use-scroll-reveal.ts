"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { useReducedMotion } from "./use-reduced-motion"

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

interface ScrollRevealResult {
  ref: RefObject<HTMLDivElement | null>
  isVisible: boolean
  progress: number
}

export function useScrollReveal(options: ScrollRevealOptions = {}): ScrollRevealResult {
  const { threshold = 0.15, rootMargin = "0px", once = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  const [ratio, setRatio] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Reduced motion shows everything immediately; no observer needed
    if (reduced) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          setRatio(entry.intersectionRatio)
          if (once) observer.disconnect()
        } else if (!once) {
          setSeen(false)
          setRatio(0)
        }
      },
      { threshold: [0, threshold, 0.5, 1], rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once, reduced])

  return { ref, isVisible: reduced || seen, progress: reduced ? 1 : ratio }
}
