"use client"

import { usePathname } from "next/navigation"
import { AuroraBackground } from "@/components/shared/aurora-background"
import { FilmGrain } from "@/components/shared/film-grain"
import { CustomCursor } from "@/components/shared/custom-cursor"
import { ParticleField } from "@/components/shared/particle-field"
import { TimeTint } from "@/components/shared/time-tint"
import { ScrollConstellation } from "@/components/shared/scroll-constellation"
import { CinematicIntro } from "@/components/shared/cinematic-intro"
import { CursorWords } from "@/components/shared/cursor-words"

export function GalleryChrome() {
  const pathname = usePathname()
  if (pathname?.startsWith("/cafe-maz")) return null

  return (
    <>
      <CinematicIntro />
      <AuroraBackground />
      <ParticleField />
      <CursorWords />
      <FilmGrain />
      <TimeTint />
      <CustomCursor />
      <ScrollConstellation />
    </>
  )
}
