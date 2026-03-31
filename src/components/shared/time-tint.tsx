"use client"

import { useTimeTheme } from "@/hooks/use-time-theme"

export function TimeTint() {
  const theme = useTimeTheme()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9997] transition-colors duration-[5000ms]"
      style={{ backgroundColor: theme.tint }}
      aria-hidden="true"
    />
  )
}
