import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { GAMES, getGame } from "@/lib/annex"
import { SITE_URL } from "@/lib/constants"
import { GameStage } from "@/components/gallery/games/game-stage"

type Params = Promise<{ game: string }>
type Search = Promise<{ photo?: string }>

export function generateStaticParams() {
  return GAMES.map((g) => ({ game: g.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { game } = await params
  const g = getGame(game)
  if (!g) return { title: "Game not found" }
  return {
    title: `${g.title} | The Annex`,
    description: g.description,
    alternates: { canonical: `/annex/${g.slug}` },
    openGraph: { title: `${g.title} at Maz Gallery`, description: g.description, url: `${SITE_URL}/annex/${g.slug}` },
  }
}

export default async function GamePage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { game } = await params
  const g = getGame(game)
  if (!g) notFound()
  const { photo } = await searchParams
  return (
    // The hub stays underneath for the moment the stage unmounts on Back
    <div className="min-h-[100svh] bg-[#0b0d13]">
      <GameStage game={g.slug} photo={photo} />
    </div>
  )
}
