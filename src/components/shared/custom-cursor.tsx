"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function CustomCursor() {
  const reduced = useReducedMotion()
  const [isTouch, setIsTouch] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: -100, y: -100 })
  const trailPos = useRef({ x: -100, y: -100 })
  const [isHoveringImage, setIsHoveringImage] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true)
    }
  }, [])

  useEffect(() => {
    if (reduced || isTouch) return

    document.body.classList.add("cursor-none-custom")

    const handleMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`
      }

      const target = e.target as HTMLElement
      const onImage = !!target.closest("img, [data-cursor='magnify']")
      setIsHoveringImage(onImage)
    }

    let rafId: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      trailPos.current.x = lerp(trailPos.current.x, mousePos.current.x, 0.12)
      trailPos.current.y = lerp(trailPos.current.y, mousePos.current.y, 0.12)

      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x - 20}px, ${trailPos.current.y - 20}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove("cursor-none-custom")
      window.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [reduced, isTouch])

  if (reduced || isTouch) return null

  return (
    <>
      {/* Main dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-teal mix-blend-difference"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      />
      {/* Trailing circle */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-teal/50 mix-blend-difference transition-[width,height,backdrop-filter] duration-300"
        style={{
          willChange: "transform",
          width: isHoveringImage ? 80 : 40,
          height: isHoveringImage ? 80 : 40,
          marginLeft: isHoveringImage ? -20 : 0,
          marginTop: isHoveringImage ? -20 : 0,
          backdropFilter: isHoveringImage ? "saturate(1.5) contrast(1.1)" : "none",
        }}
        aria-hidden="true"
      />
    </>
  )
}
