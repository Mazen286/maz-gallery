"use client"

import { useSyncExternalStore } from "react"

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

// Personal bests live in this browser only; read once per mount
function readBest(key: string): string {
  try {
    if (key === "jigsaw") {
      const j = JSON.parse(localStorage.getItem("mazgallery.jigsaw.best.v1") ?? "{}")
      for (const d of ["medium", "easy", "hard"]) if (j[d] !== undefined) return `Best (${d}): ${fmtTime(j[d])}`
    }
    if (key === "pairs") {
      const p = JSON.parse(localStorage.getItem("mazgallery.pairs.best.v1") ?? "{}")
      for (const d of ["medium", "easy", "hard"]) if (p[d] !== undefined) return `Best (${d}): ${p[d]} moves`
    }
    if (key === "postcards") {
      const pc = localStorage.getItem("mazgallery.postcards.best.v1")
      if (pc !== null) return `Best: ${pc} / 8`
    }
    if (key === "pinmap") {
      const pm = localStorage.getItem("mazgallery.pinmap.best.v1")
      if (pm !== null) return `Best: ${pm} / 500`
    }
  } catch {}
  return ""
}

const subscribe = () => () => {}

export function Best({ gameKey }: { gameKey: string }) {
  const best = useSyncExternalStore(subscribe, () => readBest(gameKey), () => "")
  if (!best) return null
  return <p className="font-mono text-[9px] text-white/35">{best}</p>
}
