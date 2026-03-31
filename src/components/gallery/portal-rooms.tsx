"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Head from "next/head"
import type { GalleryImage } from "@/lib/gallery"

interface PortalRoomsProps {
  images: GalleryImage[]
}

type TransitionPhase = "idle" | "exit" | "enter"

export function PortalRooms({ images }: PortalRoomsProps) {
  const [current, setCurrent] = useState(0)
  const [phase, setPhase] = useState<TransitionPhase>("idle")
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const pendingIndexRef = useRef<number>(0)

  const img = images[current]

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const navigateTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (phase !== "idle") return
      pendingIndexRef.current = index
      setDirection(dir)
      setPhase("exit")

      setTimeout(() => {
        setCurrent(index)
        setPhase("enter")

        setTimeout(() => {
          setPhase("idle")
        }, 400)
      }, 350)
    },
    [phase]
  )

  const next = useCallback(() => {
    const nextIndex = current < images.length - 1 ? current + 1 : 0
    navigateTo(nextIndex, "next")
  }, [current, images.length, navigateTo])

  const prev = useCallback(() => {
    const prevIndex = current > 0 ? current - 1 : images.length - 1
    navigateTo(prevIndex, "prev")
  }, [current, images.length, navigateTo])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        next()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [next, prev])

  // Scroll wheel navigation with debounce
  useEffect(() => {
    let lastScroll = 0
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastScroll < 800) return
      lastScroll = now
      if (e.deltaY > 30) next()
      else if (e.deltaY < -30) prev()
    }
    const el = containerRef.current
    if (el) el.addEventListener("wheel", handleWheel, { passive: true })
    return () => {
      if (el) el.removeEventListener("wheel", handleWheel)
    }
  }, [next, prev])

  // Mouse move for parallax (desktop only)
  useEffect(() => {
    if (isTouchDevice) return
    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    const el = containerRef.current
    if (el) el.addEventListener("mousemove", handleMouseMove)
    return () => {
      if (el) el.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isTouchDevice])

  // Mouse hover for side arrows
  const handleMouseMoveForSide = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (x < 0.2) setHoverSide("left")
    else if (x > 0.8) setHoverSide("right")
    else setHoverSide(null)
  }, [])

  // Click on sides
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      if (x < 0.2) prev()
      else if (x > 0.8) next()
    },
    [prev, next]
  )

  // Touch swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStartRef.current.x
      const dy = touch.clientY - touchStartRef.current.y
      touchStartRef.current = null

      // Only trigger on horizontal swipes (ignore vertical)
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next()
        else prev()
      }
    },
    [next, prev]
  )

  // Parallax offsets (subtle, opposite of mouse direction)
  const parallaxX = isTouchDevice ? 0 : (0.5 - mousePos.x) * 12
  const parallaxY = isTouchDevice ? 0 : (0.5 - mousePos.y) * 8

  // Transition styles for the photo container
  const getPhotoStyle = (): React.CSSProperties => {
    if (phase === "exit") {
      return {
        transform: `perspective(800px) rotateX(2deg) scale(1.6) translate(${parallaxX}px, ${parallaxY}px)`,
        opacity: 0,
        transition: "transform 350ms ease-in, opacity 300ms ease-in",
      }
    }
    if (phase === "enter") {
      return {
        transform: `perspective(800px) rotateX(2deg) scale(1.15) translate(${parallaxX}px, ${parallaxY}px)`,
        opacity: 1,
        transition: "transform 400ms ease-out, opacity 350ms ease-out",
      }
    }
    // idle
    return {
      transform: `perspective(800px) rotateX(2deg) scale(1.15) translate(${parallaxX}px, ${parallaxY}px)`,
      opacity: 1,
      transition: isTouchDevice
        ? "transform 400ms ease-out, opacity 350ms ease-out"
        : "opacity 350ms ease-out",
    }
  }

  // Text transition
  const getTextStyle = (): React.CSSProperties => {
    if (phase === "exit") {
      return {
        opacity: 0,
        transform: "translateY(20px)",
        transition: "opacity 250ms ease-in, transform 250ms ease-in",
      }
    }
    if (phase === "enter") {
      return {
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity 400ms ease-out 150ms, transform 400ms ease-out 150ms",
      }
    }
    return {
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 400ms ease-out, transform 400ms ease-out",
    }
  }

  if (!img) return null

  // Preload neighbors
  const prevIndex = current > 0 ? current - 1 : images.length - 1
  const nextIndex = current < images.length - 1 ? current + 1 : 0
  const prevImg = images[prevIndex]
  const nextImg = images[nextIndex]

  const progress = ((current + 1) / images.length) * 100

  return (
    <>
      {/* Inject keyframes via style tag */}
      <style>{`
        @keyframes portalEnterFromBehind {
          from { transform: perspective(800px) rotateX(2deg) scale(0.92); opacity: 0; }
          to { transform: perspective(800px) rotateX(2deg) scale(1.15); opacity: 1; }
        }
        @keyframes portalVignetteBreath {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0.75; }
        }
      `}</style>

      {/* Preload adjacent images */}
      {prevImg && (
        <link
          rel="preload"
          as="image"
          href={prevImg.src}
          key={`preload-prev-${prevImg.src}`}
        />
      )}
      {nextImg && (
        <link
          rel="preload"
          as="image"
          href={nextImg.src}
          key={`preload-next-${nextImg.src}`}
        />
      )}

      <div
        ref={containerRef}
        className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black select-none"
        onMouseMove={handleMouseMoveForSide}
        onMouseLeave={() => setHoverSide(null)}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: hoverSide ? "pointer" : "default" }}
      >
        {/* Background photo - fills viewport with perspective */}
        <div
          className="absolute inset-0 will-change-transform"
          style={getPhotoStyle()}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Vignette overlay - dark edges for "inside a room" feel */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.85) 100%)",
            animation: "portalVignetteBreath 8s ease-in-out infinite",
          }}
        />

        {/* Additional top/bottom gradient for text readability */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Side arrow indicators on hover */}
        {hoverSide === "left" && (
          <div
            className="pointer-events-none absolute left-0 top-0 flex h-full w-[20%] items-center justify-center"
            style={{ opacity: 0.6 }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>
        )}
        {hoverSide === "right" && (
          <div
            className="pointer-events-none absolute right-0 top-0 flex h-full w-[20%] items-center justify-center"
            style={{ opacity: 0.6 }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </div>
        )}

        {/* Story overlay - lower portion */}
        <div
          className="absolute bottom-16 left-0 right-0 flex justify-center px-6"
          style={getTextStyle()}
        >
          <div
            className="max-w-xl rounded-xl px-6 py-5"
            style={{
              background: "rgba(0, 0, 0, 0.40)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {img.location && (
              <p
                className="text-xs font-medium uppercase"
                style={{
                  color: "#78c8d6",
                  letterSpacing: "0.25em",
                  marginBottom: img.story ? "0.5rem" : 0,
                }}
              >
                {img.location}
              </p>
            )}
            {img.story && (
              <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.5)" }}>
                {img.story}
              </p>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span
            className="font-mono text-xs"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </div>

        {/* Progress bar - thin teal line at very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full"
            style={{
              width: `${progress}%`,
              background: "#78c8d6",
              transition: "width 500ms ease-out",
            }}
          />
        </div>
      </div>
    </>
  )
}
