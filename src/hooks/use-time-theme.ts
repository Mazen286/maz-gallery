"use client"

import { useSyncExternalStore } from "react"

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

interface TimeTheme {
  period: TimeOfDay
  tint: string       // CSS color for subtle overlay tint
  accentShift: string // hue-rotate value for accent color
  warmth: number     // 0-1 for warm/cool
}

const THEMES: Record<TimeOfDay, TimeTheme> = {
  morning: {
    period: "morning",
    tint: "rgba(255, 200, 120, 0.03)",
    accentShift: "hue-rotate(-10deg) saturate(1.1)",
    warmth: 0.7,
  },
  afternoon: {
    period: "afternoon",
    tint: "rgba(255, 255, 255, 0)",
    accentShift: "hue-rotate(0deg) saturate(1)",
    warmth: 0.5,
  },
  evening: {
    period: "evening",
    tint: "rgba(100, 120, 200, 0.03)",
    accentShift: "hue-rotate(10deg) saturate(0.95)",
    warmth: 0.3,
  },
  night: {
    period: "night",
    tint: "rgba(30, 40, 80, 0.05)",
    accentShift: "hue-rotate(15deg) saturate(0.9)",
    warmth: 0.1,
  },
}

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 21) return "evening"
  return "night"
}

// One shared clock: every subscriber re-checks the period every 15 minutes
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | null = null
function subscribe(onChange: () => void) {
  listeners.add(onChange)
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 15 * 60 * 1000)
  return () => {
    listeners.delete(onChange)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

// The server does not know the visitor's local hour, so it renders the
// neutral afternoon theme and the client corrects it after hydration.
export function useTimeTheme(): TimeTheme {
  const period = useSyncExternalStore(subscribe, getTimeOfDay, () => "afternoon" as TimeOfDay)
  return THEMES[period]
}
