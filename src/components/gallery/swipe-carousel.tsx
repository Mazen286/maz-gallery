"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"

const SETTLE_MS = 340
const DIST_FRACTION = 0.16 // drag past 16% of the width to commit
const VELOCITY = 0.4 // px/ms flick threshold
const EDGE_RESISTANCE = 0.32 // rubber-band drag at the first/last photo

interface SwipeCarouselProps {
  images: GalleryImage[]
  index: number
  onIndexChange: (i: number) => void
  heightClass?: string
  showArrows?: boolean
}

/**
 * A finger-tracking photo carousel. The image follows the drag in real
 * time, commits to the next/previous photo on a flick or a long-enough
 * swipe, and rubber-bands at the ends. Keyboard arrows and (on hover-
 * capable screens) edge chevrons drive the same motion.
 */
export function SwipeCarousel({
  images,
  index,
  onIndexChange,
  heightClass = "h-[56vh] sm:h-[64vh]",
  showArrows = true,
}: SwipeCarouselProps) {
  const count = images.length
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragX, setDragX] = useState(0)
  const [settling, setSettling] = useState(false)
  const [dragging, setDragging] = useState(false)

  const idxRef = useRef(index)
  idxRef.current = index
  const gesture = useRef<{
    startX: number
    startY: number
    lastX: number
    lastT: number
    vel: number
    axis: null | "x" | "y"
  } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const widthOf = () =>
    containerRef.current?.offsetWidth ||
    (typeof window !== "undefined" ? window.innerWidth : 1)

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  // Animate to next (1), previous (-1), or snap back (0)
  const settle = useCallback(
    (dir: -1 | 0 | 1) => {
      const w = widthOf()
      const i = idxRef.current
      clearTimer()
      setDragging(false)
      setSettling(true)
      if (dir === 1 && i < count - 1) {
        setDragX(-w)
        timer.current = setTimeout(() => {
          onIndexChange(i + 1)
          setDragX(0)
          setSettling(false)
        }, SETTLE_MS)
      } else if (dir === -1 && i > 0) {
        setDragX(w)
        timer.current = setTimeout(() => {
          onIndexChange(i - 1)
          setDragX(0)
          setSettling(false)
        }, SETTLE_MS)
      } else {
        setDragX(0)
        timer.current = setTimeout(() => setSettling(false), SETTLE_MS)
      }
    },
    [count, onIndexChange]
  )

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        settle(1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        settle(-1)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [settle])

  useEffect(() => () => clearTimer(), [])

  const onDown = (e: React.PointerEvent) => {
    if (settling) return
    gesture.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastT: performance.now(),
      vel: 0,
      axis: null,
    }
  }

  const onMove = (e: React.PointerEvent) => {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.startX
    const dy = e.clientY - g.startY

    // Lock to horizontal only once the gesture clearly leans that way,
    // so vertical page scrolling stays smooth
    if (g.axis === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        g.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
        if (g.axis === "x") {
          setDragging(true)
          containerRef.current?.setPointerCapture?.(e.pointerId)
        }
      }
    }
    if (g.axis !== "x") return

    const now = performance.now()
    const dt = now - g.lastT
    if (dt > 0) g.vel = (e.clientX - g.lastX) / dt
    g.lastX = e.clientX
    g.lastT = now

    const i = idxRef.current
    let eff = dx
    if ((i === 0 && dx > 0) || (i === count - 1 && dx < 0)) eff = dx * EDGE_RESISTANCE
    setDragX(eff)
  }

  const onUp = () => {
    const g = gesture.current
    gesture.current = null
    if (!g || g.axis !== "x") {
      setDragging(false)
      return
    }
    const w = widthOf()
    const dx = g.lastX - g.startX
    if (dx < -w * DIST_FRACTION || g.vel < -VELOCITY) settle(1)
    else if (dx > w * DIST_FRACTION || g.vel > VELOCITY) settle(-1)
    else settle(0)
  }

  // Only render a small window of slides around the current index
  const slides: number[] = []
  for (let i = index - 2; i <= index + 2; i++) {
    if (i >= 0 && i < count) slides.push(i)
  }

  const arrow = (dir: -1 | 1) => (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => settle(dir)}
      aria-label={dir === 1 ? "Next photo" : "Previous photo"}
      className={`absolute top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-white/60 opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/50 hover:text-white group-hover:opacity-100 sm:block ${
        dir === 1 ? "right-3" : "left-3"
      }`}
    >
      {dir === 1 ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
    </button>
  )

  return (
    <div
      ref={containerRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Photographs"
      className={`group relative w-full overflow-hidden ${heightClass} ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ touchAction: "pan-y", userSelect: "none" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)`,
          transition: settling
            ? `transform ${SETTLE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : "none",
          willChange: "transform",
        }}
      >
        {slides.map((i) => {
          const img = images[i]
          const isCurrent = i === index
          return (
            <div
              key={img.src}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `translateX(${i * 100}%)` }}
              aria-hidden={!isCurrent}
            >
              <Image
                src={img.src}
                alt={isCurrent ? img.alt : ""}
                fill
                draggable={false}
                className="pointer-events-none select-none object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
                {...(isCurrent ? { preload: true } : { loading: "eager" as const })}
              />
            </div>
          )
        })}
      </div>

      {showArrows && index > 0 && arrow(-1)}
      {showArrows && index < count - 1 && arrow(1)}
    </div>
  )
}
