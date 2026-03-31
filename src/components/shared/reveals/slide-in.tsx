"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import type { ReactNode } from "react"

interface SlideInProps {
  children: ReactNode
  direction?: "left" | "right"
  delay?: number
  className?: string
}

export function SlideIn({ children, direction = "left", delay = 0, className = "" }: SlideInProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  const clipFrom = direction === "left"
    ? "inset(0 100% 0 0)"
    : "inset(0 0 0 100%)"

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: isVisible ? "inset(0 0 0 0)" : clipFrom,
        transform: isVisible ? "rotateY(0deg)" : `rotateY(${direction === "left" ? "-3" : "3"}deg)`,
        perspective: "1200px",
        transition: `clip-path 0.8s cubic-bezier(0.33, 1, 0.68, 1) ${delay}ms, transform 0.8s cubic-bezier(0.33, 1, 0.68, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
