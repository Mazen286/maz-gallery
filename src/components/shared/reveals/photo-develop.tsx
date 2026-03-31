"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import type { ReactNode } from "react"

interface PhotoDevelopProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function PhotoDevelop({ children, delay = 0, className = "" }: PhotoDevelopProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={className}
      style={{
        filter: isVisible ? "blur(0px)" : "blur(12px)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.95)",
        transition: `filter 1.2s ease-out ${delay}ms, opacity 1.2s ease-out ${delay}ms, transform 1.2s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
