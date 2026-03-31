"use client"

import { useCallback, useEffect, type RefObject } from "react"
import { useMousePosition } from "./use-mouse-position"
import { useReducedMotion } from "./use-reduced-motion"

interface TiltConfig {
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
}

export function useTilt(
  elementRef: RefObject<HTMLElement | null>,
  config: TiltConfig = {}
) {
  const { maxTilt = 8, perspective = 800, scale = 1, speed = 400 } = config
  const reduced = useReducedMotion()

  const handleUpdate = useCallback(
    (pos: { elementX: number; elementY: number; isInside: boolean }) => {
      const el = elementRef.current
      if (!el || reduced) return

      if (!pos.isInside) {
        el.style.transition = `transform ${speed}ms cubic-bezier(0.33, 1, 0.68, 1)`
        el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`
        return
      }

      const rect = el.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateY = ((pos.elementX - centerX) / centerX) * maxTilt
      const rotateX = ((centerY - pos.elementY) / centerY) * maxTilt

      el.style.transition = "none"
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`
    },
    [elementRef, maxTilt, perspective, scale, speed, reduced]
  )

  useMousePosition(elementRef, handleUpdate)

  useEffect(() => {
    const el = elementRef.current
    if (el) {
      el.style.willChange = "transform"
      el.style.transformStyle = "preserve-3d"
    }
    return () => {
      if (el) {
        el.style.willChange = ""
        el.style.transformStyle = ""
      }
    }
  }, [elementRef])
}
