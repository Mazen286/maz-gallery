"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// Reveal-on-scroll wrapper. Delegates to useScrollReveal so it shares the
// reduced-motion handling (content is simply shown) and the observer options.
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 })

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
