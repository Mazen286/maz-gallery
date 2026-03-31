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
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setIsVisible(true)
      setProgress(1)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setProgress(entry.intersectionRatio)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
          setProgress(0)
        }
      },
      { threshold: [0, threshold, 0.5, 1], rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once, reduced])

  return { ref, isVisible, progress }
}
