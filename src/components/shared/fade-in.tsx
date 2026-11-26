"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// Reveal-on-scroll wrapper. Delegates to useScrollReveal so it shares the
// reduced-motion handling (content is simply shown) and the observer options.
//
// `immediate` is for content that is on screen when the page opens (a room's
// title). It rises the same way, but with a CSS animation that starts on first
// paint, so the title never waits for the page's JavaScript to arrive.
export function FadeIn({
  children,
  delay = 0,
  className = "",
  immediate = false,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  immediate?: boolean
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 })

  if (immediate) {
    return (
      <div
        className={`animate-rise-in ${className}`}
        style={delay ? { animationDelay: `${delay}ms` } : undefined}
      >
        {children}
      </div>
    )
  }

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
