"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"

interface FilmStripViewProps {
  images: GalleryImage[]
}

export function FilmStripView({ images }: FilmStripViewProps) {
  const [scrollX, setScrollX] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const frameWidth = 400
  const frameGap = 24
  const totalWidth = images.length * (frameWidth + frameGap)

  // Convert vertical scroll to horizontal
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selected !== null) return
      e.preventDefault()
      setScrollX((prev) => {
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
        return Math.max(0, Math.min(prev + delta * 1.5, totalWidth - window.innerWidth + 200))
      })
    }
    const el = containerRef.current
    if (el) el.addEventListener("wheel", handleWheel, { passive: false })
    return () => { if (el) el.removeEventListener("wheel", handleWheel) }
  }, [totalWidth, selected])

  // Keyboard
  useEffect(() => {
    if (selected === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
      if (e.key === "ArrowRight") setSelected((p) => p !== null && p < images.length - 1 ? p + 1 : p)
      if (e.key === "ArrowLeft") setSelected((p) => p !== null && p > 0 ? p - 1 : p)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selected, images.length])

  // Which frame is closest to center
  const centerFrame = Math.round(scrollX / (frameWidth + frameGap))

  return (
    <div
      ref={containerRef}
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#0a0a0a]"
    >
      {/* Sprocket holes - top */}
      <div className="absolute left-0 right-0 top-8 z-10 flex gap-8 overflow-hidden">
        {Array.from({ length: Math.ceil(totalWidth / 60) }).map((_, i) => (
          <div
            key={`t${i}`}
            className="h-4 w-6 flex-shrink-0 rounded-sm bg-white/[0.03]"
            style={{ transform: `translateX(${-scrollX * 0.95}px)` }}
          />
        ))}
      </div>

      {/* Sprocket holes - bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex gap-8 overflow-hidden">
        {Array.from({ length: Math.ceil(totalWidth / 60) }).map((_, i) => (
          <div
            key={`b${i}`}
            className="h-4 w-6 flex-shrink-0 rounded-sm bg-white/[0.03]"
            style={{ transform: `translateX(${-scrollX * 0.95}px)` }}
          />
        ))}
      </div>

      {/* Film strip */}
      <div
        className="flex items-center gap-6 px-[50vw] transition-transform duration-150 ease-out"
        style={{
          transform: `translateX(${-scrollX}px)`,
          height: "calc(100vh - 4rem)",
        }}
      >
        {images.map((img, i) => {
          const distFromCenter = Math.abs(i - centerFrame)
          const scale = Math.max(0.7, 1 - distFromCenter * 0.08)
          const blur = Math.min(distFromCenter * 1.5, 4)
          const opacity = Math.max(0.4, 1 - distFromCenter * 0.15)

          return (
            <button
              key={img.src}
              onClick={() => setSelected(i)}
              className="relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300"
              style={{
                width: frameWidth,
                transform: `scale(${scale})`,
                filter: `blur(${blur}px) saturate(${distFromCenter === 0 ? 1 : 0.6})`,
                opacity,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="h-auto w-full"
                loading="lazy"
              />
              {distFromCenter === 0 && img.location && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                    {img.location}
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Center indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <p className="font-mono text-xs text-white/20">
          {String(centerFrame + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
      </div>

      {/* Hint */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/15">
        scroll to scrub through the film strip
      </p>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setSelected(null)}
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/70 hover:text-white"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "imageFloatIn 0.4s ease-out forwards" }}
          >
            <Image
              src={images[selected].src}
              alt={images[selected].alt}
              width={images[selected].width}
              height={images[selected].height}
              className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
              priority
            />
            {images[selected].location && (
              <p className="mt-4 text-center text-sm text-white/60">
                {images[selected].location}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
