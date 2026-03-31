"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery"
import { MuseumCat } from "./museum-cat"

interface GalleryWalkProps {
  images: GalleryImage[]
  onExit: () => void
}

const ARTIFACTS = ["🏺", "🗿", "🪬", "⚱️", "🫖", "🪘", "🎭", "📜", "🧭", "🔭", "⏳", "🪷"]

export function GalleryWalk({ images, onExit }: GalleryWalkProps) {
  const [scrollPos, setScrollPos] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [catX, setCatX] = useState(50)
  const [catBob, setCatBob] = useState(0)
  const [catFacing, setCatFacing] = useState<"left" | "right">("right")
  const containerRef = useRef<HTMLDivElement>(null)
  const keysRef = useRef<Set<string>>(new Set())
  const prevScrollRef = useRef(0)

  const SPACING = 500
  const totalDepth = images.length * SPACING

  // Wrap for infinite loop
  const wrap = (v: number) => ((v % totalDepth) + totalDepth) % totalDepth

  // WASD movement
  useEffect(() => {
    if (selected !== null) return
    let frame: number
    const tick = () => {
      const k = keysRef.current
      if (k.has("w") || k.has("arrowup") || k.has(" "))
        setScrollPos((p) => wrap(p + 5))
      if (k.has("s") || k.has("arrowdown"))
        setScrollPos((p) => wrap(p - 5))
      if (k.has("a") || k.has("arrowleft")) {
        setCatX((p) => Math.max(p - 2, -100)); setCatFacing("left")
      }
      if (k.has("d") || k.has("arrowright")) {
        setCatX((p) => Math.min(p + 2, 100)); setCatFacing("right")
      }
      if (k.size > 0) frame = requestAnimationFrame(tick)
    }
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"," "].includes(key)) {
        e.preventDefault()
        if (!keysRef.current.has(key)) { keysRef.current.add(key); cancelAnimationFrame(frame); frame = requestAnimationFrame(tick) }
      }
      if (key === "escape") { selected !== null ? setSelected(null) : onExit() }
    }
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); cancelAnimationFrame(frame) }
  }, [selected, onExit, totalDepth])

  // Scroll wheel
  useEffect(() => {
    const h = (e: WheelEvent) => { if (selected !== null) return; e.preventDefault(); setScrollPos((p) => wrap(p + e.deltaY * 2)) }
    const el = containerRef.current
    if (el) el.addEventListener("wheel", h, { passive: false })
    return () => { if (el) el.removeEventListener("wheel", h) }
  }, [selected, totalDepth])

  // Cat bob
  useEffect(() => {
    let t = 0, frame: number
    const run = () => { t += 0.07; setCatBob(Math.sin(t) * 2.5); frame = requestAnimationFrame(run) }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Cat direction
  useEffect(() => {
    if (scrollPos > prevScrollRef.current + 1) setCatFacing("right")
    else if (scrollPos < prevScrollRef.current - 1) setCatFacing("left")
    prevScrollRef.current = scrollPos
  }, [scrollPos])

  // Which objects to render: get Z offset relative to camera, handle wrapping
  // Object is at absolute depth `objZ` (negative). Camera is at `scrollPos`.
  // In the parent, everything moves by translateZ(scrollPos).
  // So object appears at screen-Z = objZ + scrollPos
  // For infinite loop, we also render a second copy shifted by totalDepth
  const shouldRender = (absZ: number): number[] => {
    const zs: number[] = []
    const z1 = absZ + scrollPos
    const z2 = absZ + scrollPos + totalDepth
    const z3 = absZ + scrollPos - totalDepth
    if (z1 > -3000 && z1 < 600) zs.push(absZ)
    if (z2 > -3000 && z2 < 600) zs.push(absZ + totalDepth)
    if (z3 > -3000 && z3 < 600) zs.push(absZ - totalDepth)
    return zs
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 overflow-hidden"
      style={{ perspective: "800px", background: "linear-gradient(to bottom, #04060c 0%, #080c14 40%, #100e0b 100%)" }}
    >
      {/* UI */}
      <div className="pointer-events-none absolute inset-0 z-50">
        <button onClick={onExit} className="pointer-events-auto absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white/60 backdrop-blur-sm hover:bg-white/20 hover:text-white" aria-label="Exit">
          <X className="size-5" />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <div className="mb-1.5 flex justify-center gap-1">
            <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/25">W</kbd>
          </div>
          <div className="flex justify-center gap-1">
            <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/25">A</kbd>
            <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/25">S</kbd>
            <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/25">D</kbd>
          </div>
          <p className="mt-1 text-[9px] text-white/15">or scroll to explore</p>
        </div>
      </div>

      {/* 3D Scene - parent moves with camera */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: `translateZ(${scrollPos}px)`, transition: "transform 0.1s ease-out" }}>

        {/* ── FLOOR ── */}
        {Array.from({ length: Math.ceil(totalDepth / 200) }).map((_, i) => {
          const absZ = -(i * 200)
          const renders = shouldRender(absZ)
          return renders.map((z) => (
            <div key={`f${i}_${z}`} className="absolute left-1/2 top-1/2" style={{
              transform: `translate3d(-420px, 170px, ${z}px) rotateX(90deg)`,
              width: "840px", height: "200px",
              background: i % 2 === 0 ? "rgba(55,45,38,0.45)" : "rgba(48,40,33,0.45)",
            }} />
          ))
        })}

        {/* ── WALLS ── */}
        {Array.from({ length: Math.ceil(totalDepth / 300) }).map((_, i) => {
          const absZ = -(i * 300)
          const renders = shouldRender(absZ)
          return renders.map((z) => (
            <div key={`w${i}_${z}`}>
              <div className="absolute left-1/2 top-1/2" style={{
                transform: `translate3d(-420px, -100px, ${z}px) rotateY(90deg)`,
                width: "300px", height: "340px",
                background: "linear-gradient(to bottom, rgba(28,24,32,0.6), rgba(38,32,28,0.4))",
              }} />
              <div className="absolute left-1/2 top-1/2" style={{
                transform: `translate3d(420px, -100px, ${z}px) rotateY(-90deg)`,
                width: "300px", height: "340px",
                background: "linear-gradient(to bottom, rgba(28,24,32,0.6), rgba(38,32,28,0.4))",
              }} />
            </div>
          ))
        })}

        {/* ── CEILING LIGHTS ── */}
        {Array.from({ length: Math.ceil(totalDepth / 900) }).map((_, i) => {
          const absZ = -(i * 900 + 450)
          const renders = shouldRender(absZ)
          return renders.map((z) => (
            <div key={`cl${i}_${z}`}>
              <div className="absolute left-1/2 top-1/2" style={{
                transform: `translate3d(-3px, -265px, ${z}px)`,
                width: "6px", height: "28px",
                background: "linear-gradient(to bottom, rgba(50,45,40,0.8), rgba(35,30,25,0.4))",
              }} />
              <div className="absolute left-1/2 top-1/2" style={{
                transform: `translate3d(-15px, -240px, ${z}px)`,
                width: "30px", height: "6px", borderRadius: "50%",
                background: "rgba(255,240,200,0.5)",
                boxShadow: "0 0 30px 15px rgba(255,240,200,0.06), 0 60px 100px 40px rgba(255,240,200,0.02)",
              }} />
            </div>
          ))
        })}

        {/* ── PHOTOS ── */}
        {images.map((img, i) => {
          const absZ = -(i * SPACING)
          const renders = shouldRender(absZ)
          const side = i % 2 === 0 ? -1 : 1
          const xOff = side * 350
          const maxW = 300, maxH = 220
          const aspect = img.width / img.height
          let w: number, h: number
          if (aspect > maxW / maxH) { w = maxW; h = maxW / aspect } else { h = maxH; w = maxH * aspect }

          return renders.map((z) => (
            <div key={`p${i}_${z}`} className="absolute left-1/2 top-1/2 cursor-pointer"
              style={{ transform: `translate3d(${xOff - w/2}px, ${-h/2 - 20}px, ${z}px) rotateY(${side * -18}deg)`, width: `${w}px`, height: `${h}px` }}
              onClick={() => setSelected(i)}
            >
              <div className="absolute" style={{ inset: "-14px", border: "3px solid rgba(180,155,100,0.35)", boxShadow: "inset 0 0 12px rgba(180,155,100,0.08), 0 0 25px rgba(0,0,0,0.6)", background: "rgba(180,155,100,0.02)" }} />
              <div className="absolute" style={{ inset: "-5px", border: "1px solid rgba(255,255,255,0.06)" }} />
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes={`${w}px`} />
              <div className="pointer-events-none absolute -inset-4" style={{ background: "radial-gradient(ellipse at 50% -30%, rgba(255,240,200,0.1), transparent 70%)" }} />
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${h + 22}px` }}>
                <div className="rounded-sm border border-yellow-900/20 bg-yellow-900/10 px-3 py-1">
                  <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.2em] text-yellow-200/40">{img.location || img.alt}</p>
                </div>
              </div>
            </div>
          ))
        })}

        {/* ── PEDESTALS ── */}
        {Array.from({ length: Math.floor(images.length / 3) }).map((_, pi) => {
          const absZ = -(pi * 3 * SPACING + SPACING * 1.5)
          const renders = shouldRender(absZ)
          const side = pi % 2 === 0 ? -1 : 1
          const xPos = side * 70
          const artifact = ARTIFACTS[pi % ARTIFACTS.length]

          return renders.map((z) => (
            <div key={`ped${pi}_${z}`}>
              <div className="absolute left-1/2 top-1/2" style={{
                transform: `translate3d(${xPos - 28}px, 78px, ${z}px)`,
                width: "56px", height: "6px",
                background: "rgba(160,140,110,0.3)", borderTop: "1px solid rgba(200,180,140,0.15)",
              }} />
              <div className="absolute left-1/2 top-1/2" style={{
                transform: `translate3d(${xPos - 22}px, 84px, ${z}px)`,
                width: "44px", height: "86px",
                background: "linear-gradient(to right, rgba(90,75,60,0.5), rgba(130,110,90,0.35), rgba(90,75,60,0.5))",
                boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
              }} />
              <div className="absolute left-1/2 top-1/2" style={{
                transform: `translate3d(${xPos - 13}px, 52px, ${z}px)`,
                fontSize: "28px", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
              }}>{artifact}</div>
            </div>
          ))
        })}

        {/* ── STARS ── */}
        {Array.from({ length: 120 }).map((_, i) => {
          const absZ = -((i / 120) * totalDepth)
          const renders = shouldRender(absZ)
          const x = ((i * 137.5) % 900) - 450
          const y = -260 - ((i * 73.1) % 120)
          const size = 0.5 + ((i * 31.7) % 2)
          return renders.map((z) => (
            <div key={`st${i}_${z}`} className="absolute left-1/2 top-1/2" style={{
              transform: `translate3d(${x}px, ${y}px, ${z}px)`,
              width: `${size}px`, height: `${size}px`, borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 5) * 0.8}s infinite`,
            }} />
          ))
        })}

        {/* ── CAT (moves with camera via negative scrollPos) ── */}
        <div className="absolute left-1/2 top-1/2" style={{
          transform: `translate3d(${catX}px, ${140 + catBob}px, ${-scrollPos - 300}px)`,
        }}>
          <MuseumCat facing={catFacing} />
        </div>

      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-10" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)",
      }} />

      {/* Lightbox */}
      {selected !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
          onClick={() => setSelected(null)} style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ animation: "imageFloatIn 0.4s ease-out forwards" }} className="max-w-4xl text-center">
            <Image src={images[selected].src} alt={images[selected].alt}
              width={images[selected].width} height={images[selected].height}
              className="max-h-[75vh] w-auto rounded-lg object-contain shadow-2xl" />
            {images[selected].location && (
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-yellow-200/50">{images[selected].location}</p>
            )}
            {images[selected].story ? (
              <p className="mx-auto mt-2 max-w-lg text-sm italic leading-relaxed text-white/40">{images[selected].story}</p>
            ) : (
              <p className="mt-2 text-sm text-white/30">{images[selected].alt}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
