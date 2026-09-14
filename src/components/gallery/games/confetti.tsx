"use client"

import { useId } from "react"

// Deterministic per instance: a small seeded generator keyed on useId, so
// render stays pure and the burst still looks scattered
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const hash = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const COLORS = ["#78c8d6", "#ffffff", "#f0c040", "#e06070", "#80e0a0"]

export function ConfettiOverlay() {
  const rng = mulberry32(hash(useId()))
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: rng() * 100,
    delay: rng() * 2,
    duration: 2 + rng() * 2,
    size: 4 + rng() * 6,
    color: COLORS[Math.floor(rng() * COLORS.length)],
    rotation: rng() * 360,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes game-confetti-fall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.size > 7 ? "50%" : "1px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `game-confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}
