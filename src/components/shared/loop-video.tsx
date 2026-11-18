"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

// A short silent loop (a screen recording, say) that plays only while it's on screen. For anyone who prefers
// reduced motion it stays on its poster frame.
//
// The clip is fetched whole the first time it comes into view and played from memory. Workers static assets
// answer a Range request with the full file (200, not 206), and Safari won't play a video from a server that
// doesn't serve ranges; a blob URL sidesteps that. The clips are small, so it costs nothing extra.
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
    if (!v || still) {
      v?.pause()
      return
    }
    let url: string | null = null
    let loading = false
    let visible = false
    const abort = new AbortController()

    const load = async () => {
      loading = true
      try {
        const res = await fetch(src, { signal: abort.signal })
        if (!res.ok) throw new Error(String(res.status))
        url = URL.createObjectURL(await res.blob())
        v.src = url
      } catch {
        if (abort.signal.aborted) return
        v.src = src // fall back to streaming it directly
      }
      if (visible) v.play().catch(() => {})
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (!visible) return v.pause()
        if (v.src) v.play().catch(() => {})
        else if (!loading) load()
      },
      { threshold: 0.25 },
    )
    io.observe(v)
    return () => {
      io.disconnect()
      abort.abort()
      v.pause()
      if (url) {
        v.removeAttribute("src")
        v.load()
        URL.revokeObjectURL(url)
      }
    }
  }, [src, still])

  return (
    <video
      ref={ref}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={className}
    />
  )
}
