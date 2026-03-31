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
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle")
  const reduced = useReducedMotion()
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (reduced || prevPathRef.current === pathname) {
      setDisplayChildren(children)
      prevPathRef.current = pathname
      return
    }

    prevPathRef.current = pathname

    // Animate out
    setPhase("out")
    const t1 = setTimeout(() => {
      setDisplayChildren(children)
      setPhase("in")
    }, 400)
    const t2 = setTimeout(() => {
      setPhase("idle")
    }, 800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname, children, reduced])

  if (reduced) {
    return <>{children}</>
  }

  return (
    <div
      style={{
        transformOrigin: "left center",
        animation:
          phase === "out"
            ? "pageTurnOut 0.4s ease-in forwards"
            : phase === "in"
              ? "pageTurnIn 0.4s ease-out forwards"
              : "none",
      }}
    >
      {displayChildren}
    </div>
  )
}
