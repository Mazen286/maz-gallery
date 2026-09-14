import type { Metadata } from "next"
import { getDailyPuzzle, getYesterdayPuzzle } from "@/lib/daily"
import { SITE_URL } from "@/lib/constants"
import { DailyPostcard } from "./daily-client"

// A new postcard every UTC midnight: render per request, never cache
export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const puzzle = getDailyPuzzle()
  const title = `The Daily Postcard No. ${puzzle.number}`
  const description = "One photograph from the collection every day. Guess where it was taken in three tries, keep your streak alive, and share your result."
  return {
    title: "The Daily Postcard",
    description,
    alternates: { canonical: "/daily" },
    openGraph: {
      title,
      description: "One photo a day. Guess where it was taken in three tries.",
      url: `${SITE_URL}/daily`,
      // The per-day image comes from opengraph-image.tsx next to this file
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "One photo a day. Guess where it was taken in three tries.",
    },
  }
}

export default function DailyPage() {
  const now = new Date()
  const puzzle = getDailyPuzzle(now)
  const yesterday = getYesterdayPuzzle(now)

  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "The Daily Postcard",
    description: "A daily photo guessing game. One photograph, three tries to name where it was taken.",
    url: `${SITE_URL}/daily`,
    numberOfPlayers: { "@type": "QuantitativeValue", value: 1 },
    author: { "@type": "Person", name: "Mazen Abugharbieh", url: `${SITE_URL}/about` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }} />
      <DailyPostcard puzzle={puzzle} yesterday={yesterday} />
    </>
  )
}
