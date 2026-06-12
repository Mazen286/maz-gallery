"use client"

import { usePathname } from "next/navigation"
import { FilmGrain } from "@/components/shared/film-grain"
import { CustomCursor } from "@/components/shared/custom-cursor"
import { TimeTint } from "@/components/shared/time-tint"
import { CinematicIntro } from "@/components/shared/cinematic-intro"

// Deliberately minimal: one texture (grain), one light (time tint), one
// instrument (cursor). The museum identity carries the rest.
export function GalleryChrome() {
  const pathname = usePathname()
  if (pathname?.startsWith("/cafe-maz")) return null

  return (
    <>
      <CinematicIntro />
      <FilmGrain />
      <TimeTint />
      <CustomCursor />
    </>
  )
}
