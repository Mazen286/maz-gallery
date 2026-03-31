"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, useRef, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [glitching, setGlitching] = useState(false)
  const reduced = useReducedMotion()
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (reduced || prevPathRef.current === pathname) {
      setDisplayChildren(children)
      prevPathRef.current = pathname
      return
    }

    prevPathRef.current = pathname
    setGlitching(true)

    const t1 = setTimeout(() => {
      setDisplayChildren(children)
    }, 250)

    const t2 = setTimeout(() => {
      setGlitching(false)
    }, 500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname, children, reduced])

  if (reduced) return <>{children}</>

  return (
    <div className="relative">
      {/* Glitch overlay - Sombra-inspired */}
      {glitching && (
        <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
          {/* CRT scanlines */}
          <div
            className="absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(180,100,255,0.04) 1px, rgba(180,100,255,0.04) 2px)",
              animation: "glitchScan 0.08s steps(12) infinite",
            }}
          />
          {/* Digital noise blocks */}
          <div className="absolute inset-0" style={{ animation: "glitchBlocks 0.15s steps(2) infinite" }} />
          {/* Purple/teal split bars */}
          <div className="absolute inset-0" style={{ animation: "glitchBars 0.2s steps(4) forwards" }} />
          {/* Signal flash */}
          <div className="absolute inset-0" style={{ animation: "glitchFlash 0.5s ease-out forwards" }} />
          {/* Hex grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z' fill='%23b060ff' fill-opacity='1'/%3E%3C/svg%3E")`,
              animation: "glitchScan 0.1s steps(6) infinite reverse",
            }}
          />
        </div>
      )}

      {/* Content with RGB split during glitch */}
      <div
        style={glitching ? {
          animation: "glitchShift 0.3s steps(4) forwards",
        } : undefined}
      >
        {displayChildren}
      </div>
    </div>
  )
}
