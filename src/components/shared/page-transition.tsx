"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { roomFor } from "@/lib/constants"

interface PageTransitionProps {
  children: ReactNode
}

// Brief: long enough to read the placard, short enough not to feel like a gate
const TOTAL_MS = 420

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  // The dim starts the moment the path changes. Adjusting state while
  // rendering (not in an effect) is how React wants derived-from-props state.
  const [seenPath, setSeenPath] = useState(pathname)
  const [dimmedFor, setDimmedFor] = useState<string | null>(null)
  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setDimmedFor(roomFor(pathname ?? "") ? pathname : null)
  }

  // Lift the dim after the placard has had its moment
  useEffect(() => {
    if (!dimmedFor) return
    const t = setTimeout(() => setDimmedFor(null), TOTAL_MS)
    return () => clearTimeout(t)
  }, [dimmedFor])

  if (reduced || pathname?.startsWith("/cafe-maz")) return <>{children}</>

  const dimmed = dimmedFor !== null && dimmedFor === pathname
  const room = dimmed ? roomFor(pathname ?? "") : undefined

  return (
    <div className="relative">
      {/* Lights dim between rooms; a placard names where you are headed */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center transition-opacity"
        aria-hidden="true"
        style={{
          opacity: dimmed ? 1 : 0,
          transitionDuration: dimmed ? "120ms" : "300ms",
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

      {children}
    </div>
  )
}
