"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"

interface ExhibitionViewProps {
  images: GalleryImage[]
}

// Map locations to story snippets
const STORIES: Record<string, string> = {
  "Alanya, Turkey": "The Turkish Riviera. Ancient fortress walls meet turquoise water. I spent a week here and could have stayed a month.",
  "Istanbul, Turkey": "A city that exists in two continents and a thousand timelines at once. Every alley has a story older than most countries.",
  "Jordan": "Desert light hits different here. The silence is so complete you can hear your own heartbeat.",
  "New York": "The city that never sleeps barely lets you blink. I shot these on foot, walking until my legs gave out.",
  "San Diego": "Home. The place I keep coming back to, and the place that keeps surprising me.",
  "Turkey": "Somewhere between the bazaars and the coastline, I stopped planning shots and started just seeing.",
}

function getStory(img?: { story?: string; location?: string }): string {
  if (!img) return ""
  if (img.story) return img.story
  if (img.location) return STORIES[img.location] || ""
  return ""
}

export function ExhibitionView({ images }: ExhibitionViewProps) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [bgColor, setBgColor] = useState("rgb(10,10,10)")
  const containerRef = useRef<HTMLDivElement>(null)

  const img = images[current]
  const story = getStory(img)

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return
      setTransitioning(true)
      setTimeout(() => {
        setCurrent(index)
        setTransitioning(false)
      }, 400)
    },
    [transitioning]
  )

  const next = useCallback(() => {
    goTo(current < images.length - 1 ? current + 1 : 0)
  }, [current, images.length, goTo])

  const prev = useCallback(() => {
    goTo(current > 0 ? current - 1 : images.length - 1)
  }, [current, images.length, goTo])

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next() }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev() }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [next, prev])

  // Scroll to advance
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
    return () => { if (el) el.removeEventListener("wheel", handleWheel) }
  }, [next, prev])

  // Dynamic background color based on image location
  useEffect(() => {
    const colors: Record<string, string> = {
      "Alanya, Turkey": "rgb(15,20,25)",
      "Istanbul, Turkey": "rgb(18,15,22)",
      "Jordan": "rgb(22,18,12)",
      "New York": "rgb(12,14,20)",
      "San Diego": "rgb(12,18,22)",
      "Turkey": "rgb(16,18,20)",
    }
    setBgColor(colors[img?.location || ""] || "rgb(10,10,10)")
  }, [img])

  if (!img) return null

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-12 transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      {/* Photo */}
      <div
        className="relative max-h-[65vh] w-full max-w-5xl transition-all duration-500"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.97) translateY(10px)" : "scale(1) translateY(0)",
        }}
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          className="mx-auto max-h-[65vh] w-auto rounded-lg object-contain shadow-2xl"
          priority
        />
      </div>

      {/* Caption & Story */}
      <div
        className="mt-8 max-w-2xl text-center transition-all duration-500"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(15px)" : "translateY(0)",
        }}
      >
        {img.location && (
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-teal">
            {img.location}
          </p>
        )}
        {story && (
          <p className="mt-3 text-sm leading-relaxed text-white/50 italic">
            {story}
          </p>
        )}
      </div>

      {/* Counter */}
      <div className="mt-6 flex items-center gap-4">
        <span className="font-mono text-xs text-white/20">
          {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-px w-48 bg-white/10">
        <div
          className="h-full bg-teal/40 transition-all duration-500"
          style={{ width: `${((current + 1) / images.length) * 100}%` }}
        />
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="fixed left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/5 p-3 text-white/40 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:left-8"
        aria-label="Previous photo"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={next}
        className="fixed right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/5 p-3 text-white/40 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:right-8"
        aria-label="Next photo"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Hint */}
      <p className="absolute bottom-4 text-[10px] text-white/15">
        scroll, arrow keys, or click arrows to navigate
      </p>
    </div>
  )
}
