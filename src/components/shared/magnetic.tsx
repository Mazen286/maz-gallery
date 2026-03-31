"use client"

import { useRef, useCallback, useEffect, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (reduced || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      ref.current.style.transition = "transform 0.1s ease-out"
      ref.current.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    },
    [reduced, strength]
  )

  const handleLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transition = "transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)"
    ref.current.style.transform = "translate(0, 0)"
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    el.addEventListener("mousemove", handleMove)
    el.addEventListener("mouseleave", handleLeave)
    return () => {
      el.removeEventListener("mousemove", handleMove)
      el.removeEventListener("mouseleave", handleLeave)
    }
  }, [handleMove, handleLeave, reduced])

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}
