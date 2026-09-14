"use client"

import { useSyncExternalStore } from "react"

// Browser-only values read through useSyncExternalStore, so components can
// derive from them during render instead of copying them into state from
// an effect. The server snapshot is what the HTML is rendered with; the
// client snapshot takes over right after hydration.

const noSubscribe = () => () => {}

// false during server render and hydration, true afterwards
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  )
}

// A sessionStorage flag, false on the server
export function useSessionFlag(key: string): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => {
      try {
        return sessionStorage.getItem(key) === "1"
      } catch {
        return false
      }
    },
    () => false,
  )
}

// A parsed localStorage value. The parse is cached by raw string so the
// snapshot stays referentially stable between renders.
const jsonCache = new Map<string, { raw: string | null; value: unknown }>()

export function useLocalJSON<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    noSubscribe,
    () => {
      let raw: string | null = null
      try {
        raw = localStorage.getItem(key)
      } catch {
        raw = null
      }
      const hit = jsonCache.get(key)
      if (hit && hit.raw === raw) return hit.value as T
      let value: T = fallback
      if (raw) {
        try {
          value = { ...fallback, ...JSON.parse(raw) }
        } catch {
          value = fallback
        }
      }
      jsonCache.set(key, { raw, value })
      return value
    },
    () => fallback,
  )
}

// A media query, false on the server
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
