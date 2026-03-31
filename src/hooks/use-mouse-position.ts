"use client"

import { useEffect, useRef, useCallback, type RefObject } from "react"
import { useReducedMotion } from "./use-reduced-motion"

interface MousePosition {
  x: number
  y: number
  elementX: number
  elementY: number
  isInside: boolean
}

export function useMousePosition(
  elementRef: RefObject<HTMLElement | null>,
  onUpdate?: (pos: MousePosition) => void
) {
  const reduced = useReducedMotion()
  const posRef = useRef<MousePosition>({ x: 0, y: 0, elementX: 0, elementY: 0, isInside: false })
  const tickingRef = useRef(false)
  const rectRef = useRef<DOMRect | null>(null)

  const cacheRect = useCallback(() => {
    if (elementRef.current) {
      rectRef.current = elementRef.current.getBoundingClientRect()
    }
  }, [elementRef])

  useEffect(() => {
    if (reduced || !elementRef.current) return

    cacheRect()
    const resizeObserver = new ResizeObserver(cacheRect)
    resizeObserver.observe(elementRef.current)

    const handleScroll = () => cacheRect()
    window.addEventListener("scroll", handleScroll, { passive: true })

    const handleMove = (e: MouseEvent) => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const rect = rectRef.current
        if (rect) {
          const elementX = e.clientX - rect.left
          const elementY = e.clientY - rect.top
          const isInside =
            elementX >= 0 && elementX <= rect.width &&
            elementY >= 0 && elementY <= rect.height
          posRef.current = { x: e.clientX, y: e.clientY, elementX, elementY, isInside }
          onUpdate?.(posRef.current)
        }
        tickingRef.current = false
      })
    }

    const handleLeave = () => {
      posRef.current = { ...posRef.current, isInside: false }
      onUpdate?.(posRef.current)
    }

    window.addEventListener("mousemove", handleMove, { passive: true })
    elementRef.current.addEventListener("mouseleave", handleLeave)

    const el = elementRef.current
    return () => {
      window.removeEventListener("mousemove", handleMove)
      el?.removeEventListener("mouseleave", handleLeave)
      window.removeEventListener("scroll", handleScroll)
      resizeObserver.disconnect()
    }
  }, [reduced, elementRef, onUpdate, cacheRect])

  return posRef
}
