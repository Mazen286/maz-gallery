"use client"

import { usePathname } from "next/navigation"
import { FilmGrain } from "@/components/shared/film-grain"
import { TimeTint } from "@/components/shared/time-tint"

// Deliberately minimal: one texture (grain), one light (time tint).
// The museum identity carries the rest.
export function GalleryChrome() {
  const pathname = usePathname()
  if (pathname?.startsWith("/cafe-maz")) return null

  return (
    <>
      <FilmGrain />
      <TimeTint />
    </>
  )
}
