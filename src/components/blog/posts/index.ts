import type { ComponentType } from "react"
import { TopTenVideoGames } from "./top-10-video-games"

export const POST_CONTENT: Record<string, ComponentType> = {
  "top-10-video-games": TopTenVideoGames,
}
