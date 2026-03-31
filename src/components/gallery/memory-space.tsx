"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"

interface MemorySpaceProps {
  images: GalleryImage[]
}

/* Deterministic pseudo-random from index */
function seeded(index: number, offset: number): number {
  const x = Math.sin(index * 9301 + offset * 4973) * 49297
  return x - Math.floor(x)
}

/* Per-image layout */
interface Placement {
  xPercent: number   // offset from center (-28 to 28)
  rotate: number     // slight rotation in degrees
  scale: number      // base scale (0.85 to 1.1)
}

function computePlacements(count: number): Placement[] {
  const p: Placement[] = []
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? 1 : -1
    p.push({
      xPercent: side * (5 + seeded(i, 1) * 23),
      rotate: (seeded(i, 3) - 0.5) * 6,
      scale: 0.88 + seeded(i, 5) * 0.2,
    })
  }
  return p
}

/* Star field */
function generateStars(count: number) {
  const stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      left: `${seeded(i, 100) * 100}%`,
      top: `${seeded(i, 200) * 100}%`,
      size: 1 + seeded(i, 300) * 1.5,
      delay: seeded(i, 400) * 5,
    })
  }
  return stars
}

export function MemorySpace({ images }: MemorySpaceProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())

  const placements = useMemo(() => computePlacements(images.length), [images.length])
  const stars = useMemo(() => generateStars(60), [])

  /* IntersectionObserver to detect which images are in/near viewport */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSet((prev) => {
          const next = new Set(prev)
          entries.forEach((entry) => {
            const idx = Number(entry.target.getAttribute("data-idx"))
            if (entry.isIntersecting) next.add(idx)
            else next.delete(idx)
          })
          return next
        })
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [images.length])

  /* Scroll-based focus: track which image is closest to viewport center */
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const center = window.innerHeight / 2
        let closest = 0
        let closestDist = Infinity
        itemRefs.current.forEach((el, i) => {
          if (!el) return
          const rect = el.getBoundingClientRect()
          const elCenter = rect.top + rect.height / 2
          const dist = Math.abs(center - elCenter)
          if (dist < closestDist) {
            closestDist = dist
            closest = i
          }
        })
        setFocusedIndex(closest)
        ticking = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Lightbox */
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null)
      if (e.key === "ArrowRight") setLightboxIndex((p) => p !== null ? (p + 1) % images.length : null)
      if (e.key === "ArrowLeft") setLightboxIndex((p) => p !== null ? (p - 1 + images.length) % images.length : null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lightboxIndex, images.length])

  const scrollProgress = useMemo(() => {
    if (images.length <= 1) return 0
    return focusedIndex / (images.length - 1)
  }, [focusedIndex, images.length])

  const lightboxImg = lightboxIndex !== null ? images[lightboxIndex] : null

  return (
    <>
      <style>{`
        @keyframes ms-twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.8; }
        }
        @keyframes ms-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ms-float {
          from { opacity: 0; transform: scale(0.92) translateY(24px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(180deg, #08080c 0%, #0c0e14 50%, #08080c 100%)",
          minHeight: "100vh",
          position: "relative",
          paddingBottom: "15vh",
        }}
      >
        {/* Fixed star field */}
        <div
          style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
          aria-hidden="true"
        >
          {stars.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                backgroundColor: i % 6 === 0 ? "rgba(120,200,214,0.5)" : "rgba(255,255,255,0.4)",
                animation: `ms-twinkle ${3 + s.delay}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Scroll progress bar */}
        <div
          style={{
            position: "fixed",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 2,
            height: 120,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 1,
            zIndex: 20,
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: "100%",
              height: `${scrollProgress * 100}%`,
              background: "rgba(120,200,214,0.4)",
              borderRadius: 1,
              transition: "height 0.3s ease",
            }}
          />
        </div>

        {/* Counter */}
        <div
          style={{
            position: "fixed",
            right: 10,
            top: "calc(50% + 72px)",
            zIndex: 20,
            fontFamily: "monospace",
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
          }}
          aria-hidden="true"
        >
          {String(focusedIndex + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            opacity: focusedIndex < 2 ? 0.6 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>
            scroll to drift through memories
          </p>
          <div style={{
            width: 1,
            height: 20,
            background: "linear-gradient(rgba(120,200,214,0.4), transparent)",
            margin: "8px auto 0",
          }} />
        </div>

        {/* Photos - each gets ~80vh of space to scroll through */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {images.map((img, i) => {
            const p = placements[i]
            const isFocused = focusedIndex === i
            const isVisible = visibleSet.has(i)
            const distFromFocus = Math.abs(i - focusedIndex)

            // Progressive defocus
            const grayscale = isFocused ? 0 : Math.min(0.9, distFromFocus * 0.25 + 0.2)
            const blur = isFocused ? 0 : Math.min(4, distFromFocus * 1.2)
            const opacity = isFocused ? 1 : Math.max(0.3, 1 - distFromFocus * 0.2)
            const activeScale = isFocused ? p.scale * 1.04 : p.scale * (1 - Math.min(0.1, distFromFocus * 0.02))

            return (
              <div
                key={img.src}
                ref={(el) => { itemRefs.current[i] = el }}
                data-idx={i}
                style={{
                  height: "80vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    maxWidth: "min(520px, 78vw)",
                    transform: `translateX(${p.xPercent}%) rotate(${p.rotate}deg) scale(${activeScale})`,
                    filter: `grayscale(${grayscale}) blur(${blur}px)`,
                    opacity: isVisible ? opacity : 0,
                    transition: "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), filter 0.8s ease, opacity 0.8s ease, box-shadow 0.8s ease",
                    cursor: isFocused ? "pointer" : "default",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: isFocused
                      ? "0 0 60px rgba(120,200,214,0.15), 0 25px 80px rgba(0,0,0,0.6)"
                      : "0 10px 40px rgba(0,0,0,0.4)",
                  }}
                  onClick={() => { if (isFocused) setLightboxIndex(i) }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    className="block h-auto w-full"
                    sizes="(max-width: 640px) 78vw, 520px"
                    loading={i < 3 ? "eager" : "lazy"}
                  />

                  {/* Story overlay on focus */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "40px 20px 20px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                      opacity: isFocused ? 1 : 0,
                      transform: isFocused ? "translateY(0)" : "translateY(10px)",
                      transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
                      pointerEvents: "none",
                    }}
                  >
                    {img.location && (
                      <p style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "#78c8d6",
                        marginBottom: 6,
                      }}>
                        {img.location}
                      </p>
                    )}
                    {img.story && (
                      <p style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.55)",
                        fontStyle: "italic",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {img.story}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* End message */}
          <div style={{
            height: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flexDirection: "column",
            gap: 8,
          }}>
            <p style={{ fontSize: 14, color: "rgba(120,200,214,0.4)", letterSpacing: "0.2em", fontWeight: 300 }}>
              You&apos;ve reached the end
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
              but the memories remain
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && lightboxIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "ms-fadeIn 0.3s ease",
          }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length) }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length) }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "ms-float 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
          >
            <Image
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              width={lightboxImg.width}
              height={lightboxImg.height}
              className="max-h-[70vh] max-w-[90vw] w-auto rounded-lg object-contain shadow-2xl"
              priority
            />
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-6 max-w-lg px-6 text-center"
            style={{ animation: "ms-float 0.5s ease 0.15s both" }}
          >
            {lightboxImg.location && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-teal/70">
                {lightboxImg.location}
              </p>
            )}
            <h3 className="mt-2 text-lg font-bold text-white">{lightboxImg.alt}</h3>
            {lightboxImg.story && (
              <p className="mt-3 text-sm leading-relaxed text-white/50 italic">
                {lightboxImg.story}
              </p>
            )}
            <p className="mt-4 font-mono text-[9px] text-white/15">
              {String(lightboxIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
