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

/** Sections fade in as they scroll into view: off (owner, 26 Nov 2026) */
const REVEAL_ON_SCROLL = false as boolean

export function useScrollReveal(options: ScrollRevealOptions = {}): ScrollRevealResult {
  const { threshold = 0.15, rootMargin = "0px", once = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  const [ratio, setRatio] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Everything shows at once, for everyone (owner, 26 Nov 2026: fading sections in as they scrolled into view felt
    // like the page loading). The observer stays only for callers that read `progress`
    if (reduced || REVEAL_ON_SCROLL === false) return

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

  return { ref, isVisible: reduced || !REVEAL_ON_SCROLL || seen, progress: reduced || !REVEAL_ON_SCROLL ? 1 : ratio }
}
