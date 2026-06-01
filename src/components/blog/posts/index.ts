import type { ComponentType } from "react"
import { CafeMaz } from "./cafe-maz"
import { TopTenVideoGames } from "./top-10-video-games"

export const POST_CONTENT: Record<string, ComponentType> = {
  "cafe-maz": CafeMaz,
  "top-10-video-games": TopTenVideoGames,
}
