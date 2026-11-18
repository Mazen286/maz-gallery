"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

// A short silent loop (a screen recording, say) that plays only while it's on screen. For anyone who prefers
// reduced motion it stays on its poster frame.
export default function LoopVideo({
  src,
  poster,
  label,
  width,
  height,
  className,
}: {
  src: string
  poster: string
  label: string
  width: number
  height: number
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const still = useReducedMotion()

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (still) {
      v.pause()
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [still])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
    />
  )
}
