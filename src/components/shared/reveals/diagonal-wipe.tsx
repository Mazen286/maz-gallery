"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import type { ReactNode } from "react"

interface DiagonalWipeProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function DiagonalWipe({ children, delay = 0, className = "" }: DiagonalWipeProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: isVisible
          ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
          : "polygon(0 0, 0 0, 0 100%, 0 100%)",
        transition: `clip-path 1s cubic-bezier(0.33, 1, 0.68, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
