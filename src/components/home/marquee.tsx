"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function Marquee() {
  const { ref, isVisible, progress } = useScrollReveal({ once: false, threshold: 0.1 })

  // Speed up marquee as it enters the viewport center
  const speed = isVisible ? Math.max(8, 20 - progress * 12) : 20

  return (
    <section ref={ref} id="marquee" className="overflow-hidden bg-cream py-12 sm:py-16">
      <div
        className="animate-marquee flex whitespace-nowrap"
        style={{ animationDuration: `${speed}s` }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="mx-8 text-6xl font-bold italic text-navy/10 sm:text-8xl"
          >
            Talk Data to Me
          </span>
        ))}
      </div>
    </section>
  )
}
