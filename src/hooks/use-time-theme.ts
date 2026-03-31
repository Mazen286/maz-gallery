"use client"

import { useEffect, useState } from "react"

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

export function useTimeTheme(): TimeTheme {
  const [theme, setTheme] = useState<TimeTheme>(THEMES.afternoon)

  useEffect(() => {
    setTheme(THEMES[getTimeOfDay()])

    // Update every 15 minutes
    const interval = setInterval(() => {
      setTheme(THEMES[getTimeOfDay()])
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return theme
}
