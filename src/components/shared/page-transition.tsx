"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, useRef, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { roomFor } from "@/lib/constants"

interface PageTransitionProps {
  children: ReactNode
}

const DIM_MS = 240
const TOTAL_MS = 820

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [stage, setStage] = useState<"idle" | "dimmed">("idle")
  const [room, setRoom] = useState<{ number: string; name: string } | null>(null)
  const reduced = useReducedMotion()
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (reduced || prevPathRef.current === pathname) {
      setDisplayChildren(children)
      prevPathRef.current = pathname
      return
    }

    prevPathRef.current = pathname
    setRoom(roomFor(pathname ?? "") ?? null)
    setStage("dimmed")

    const t1 = setTimeout(() => setDisplayChildren(children), DIM_MS)
    const t2 = setTimeout(() => setStage("idle"), TOTAL_MS)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname, children, reduced])

  if (reduced || pathname?.startsWith("/cafe-maz")) return <>{children}</>

  const dimmed = stage === "dimmed"

  return (
    <div className="relative">
      {/* Lights dim between rooms; a placard names where you are headed */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center transition-opacity"
        aria-hidden="true"
        style={{
          opacity: dimmed ? 1 : 0,
          transitionDuration: dimmed ? "200ms" : "380ms",
          background: "radial-gradient(ellipse at 50% 45%, #11141d 0%, #07080c 75%)",
        }}
      >
        {dimmed && room && (
          <div className="text-center">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.45em] text-teal/70"
              style={{ animation: "placardIn 0.4s ease-out 0.05s both" }}
            >
              {room.number}
            </p>
            <p
              className="mt-3 font-display text-3xl italic text-white/90 sm:text-4xl"
              style={{ animation: "placardIn 0.45s ease-out 0.12s both" }}
            >
              {room.name}
            </p>
            <div
              className="mx-auto mt-5 h-px w-16 bg-teal/40"
              style={{ animation: "lineGrow 0.5s ease-out 0.2s both", transformOrigin: "center" }}
            />
          </div>
        )}
      </div>

      {displayChildren}
    </div>
  )
}
