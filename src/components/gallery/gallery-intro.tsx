"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { GALLERY } from "@/lib/gallery"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface GalleryIntroProps {
  onComplete: () => void
}

export function GalleryIntro({ onComplete }: GalleryIntroProps) {
  const [phase, setPhase] = useState<"dark" | "develop" | "shrink" | "done">("dark")
  const reduced = useReducedMotion()

  // Pick a featured photo (first one with a location)
  const featured = GALLERY.find((img) => img.location) || GALLERY[0]

  useEffect(() => {
    if (reduced) {
      onComplete()
      return
    }

    const seen = sessionStorage.getItem("gallery-intro-seen")
    if (seen) {
      onComplete()
      return
    }

    const t1 = setTimeout(() => setPhase("develop"), 400)
    const t2 = setTimeout(() => setPhase("shrink"), 2200)
    const t3 = setTimeout(() => {
      setPhase("done")
      sessionStorage.setItem("gallery-intro-seen", "1")
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [reduced, onComplete])

  if (phase === "done") return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
      onClick={() => {
        setPhase("done")
        sessionStorage.setItem("gallery-intro-seen", "1")
        onComplete()
      }}
    >
      <div
        className="relative overflow-hidden transition-all duration-1000 ease-out"
        style={{
          width: phase === "shrink" ? "200px" : phase === "develop" ? "80vw" : "0",
          height: phase === "shrink" ? "150px" : phase === "develop" ? "70vh" : "0",
          opacity: phase === "dark" ? 0 : phase === "shrink" ? 0 : 1,
          borderRadius: phase === "shrink" ? "12px" : "4px",
          filter: phase === "develop"
            ? "brightness(1) contrast(1)"
            : "brightness(0.3) contrast(0.5)",
          maxWidth: "1200px",
          maxHeight: "800px",
        }}
      >
        <Image
          src={featured.src}
          alt={featured.alt}
          fill
          className="object-cover"
          priority
        />
        {phase === "develop" && featured.location && (
          <div
            className="absolute bottom-8 left-8"
            style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              {featured.location}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
