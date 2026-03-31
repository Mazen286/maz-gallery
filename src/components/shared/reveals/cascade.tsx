"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Children, type ReactNode } from "react"

interface CascadeProps {
  children: ReactNode
  staggerMs?: number
  className?: string
}

export function Cascade({ children, staggerMs = 100, className = "" }: CascadeProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) => (
        <div
          key={i}
          style={{
            transition: `opacity 0.5s ease-out ${i * staggerMs}ms, transform 0.5s ease-out ${i * staggerMs}ms`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateX(0) rotate(0deg)"
              : "translateX(-20px) rotate(-2deg)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
