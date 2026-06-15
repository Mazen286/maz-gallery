"use client"

import { useState, useEffect } from "react"
import type { GalleryImage } from "@/lib/gallery"
import { SwipeCarousel } from "./swipe-carousel"

interface ExhibitionViewProps {
  images: GalleryImage[]
  startIndex?: number
}

// Map locations to story snippets for photos without their own
const STORIES: Record<string, string> = {
  "Alanya, Turkey": "The Turkish Riviera. Ancient fortress walls meet turquoise water. I spent a week here and could have stayed a month.",
  "Istanbul, Turkey": "A city that exists in two continents and a thousand timelines at once. Every alley has a story older than most countries.",
  "Amman, Jordan": "Desert light hits different here. The silence is so complete you can hear your own heartbeat.",
  "New York, NY": "The city that never sleeps barely lets you blink. I shot these on foot, walking until my legs gave out.",
  "San Diego, CA": "Home. The place I keep coming back to, and the place that keeps surprising me.",
  "Catalina Island, CA": "An island that feels like it belongs in another decade. Slow, sunlit, and completely itself.",
  "Disneyland, CA": "A galaxy far, far away. Or at least a few hours south on the freeway.",
  "Turkey": "Somewhere between the bazaars and the coastline, I stopped planning shots and started just seeing.",
}

const BG_COLORS: Record<string, string> = {
  "Alanya, Turkey": "rgb(15,20,25)",
  "Istanbul, Turkey": "rgb(18,15,22)",
  "Amman, Jordan": "rgb(22,18,12)",
  "New York, NY": "rgb(12,14,20)",
  "San Diego, CA": "rgb(12,18,22)",
  "Catalina Island, CA": "rgb(14,20,24)",
  "Disneyland, CA": "rgb(12,12,18)",
  "Walt Disney World, FL": "rgb(14,12,16)",
  "Antalya, Turkey": "rgb(14,20,18)",
  "Cesme, Turkey": "rgb(13,18,22)",
  "Turkey": "rgb(16,18,20)",
}

function getStory(img?: GalleryImage): string {
  if (!img) return ""
  if (img.story) return img.story
  if (img.location) return STORIES[img.location] || ""
  return ""
}

export function ExhibitionView({ images, startIndex = 0 }: ExhibitionViewProps) {
  const [index, setIndex] = useState(startIndex)
  const [hint, setHint] = useState(false)

  const img = images[index]
  const story = getStory(img)
  const bg = BG_COLORS[img?.location ?? ""] ?? "rgb(10,10,10)"

  // One-time swipe hint on touch devices
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.matchMedia("(pointer: coarse)").matches) return
    if (sessionStorage.getItem("exhibit-swipe-hint")) return
    setHint(true)
    const t = setTimeout(() => {
      setHint(false)
      sessionStorage.setItem("exhibit-swipe-hint", "1")
    }, 2800)
    return () => clearTimeout(t)
  }, [])

  if (!img) return null

  return (
    <div
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden py-10 transition-colors duration-1000"
      style={{ backgroundColor: bg }}
    >
      <div className="w-full max-w-5xl px-4 sm:px-6">
        <SwipeCarousel images={images} index={index} onIndexChange={setIndex} />
      </div>

      {/* Caption & story, crossfading per photo */}
      <div
        key={index}
        className="mt-7 max-w-2xl px-6 text-center"
        style={{ animation: "placardIn 0.5s ease-out both" }}
      >
        {img.location && (
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-teal">
            {img.location}
          </p>
        )}
        <p className="mt-2 font-display text-lg italic text-white/80">{img.alt}</p>
        {story && (
          <p className="mt-3 text-sm leading-relaxed text-white/45">{story}</p>
        )}
      </div>

      {/* Counter + progress */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="font-mono text-xs text-white/30">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <div className="h-px w-48 bg-white/10">
          <div
            className="h-full bg-teal/50 transition-all duration-300"
            style={{ width: `${((index + 1) / images.length) * 100}%` }}
          />
        </div>
      </div>

      {/* One-time mobile hint */}
      {hint && (
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 backdrop-blur-sm"
          style={{ animation: "placardIn 0.4s ease-out both" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
            Swipe to explore
          </p>
        </div>
      )}
    </div>
  )
}
