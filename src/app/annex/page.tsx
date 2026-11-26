import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Puzzle, Copy, Mail, MapPin, CalendarDays, ArrowRight } from "lucide-react"
import { GAMES } from "@/lib/annex"
import { getDailyPuzzle } from "@/lib/daily"
import { ORDERED_GALLERY } from "@/lib/gallery"
import { SITE_URL } from "@/lib/constants"
import { Best } from "@/components/gallery/games/bests"

export const metadata: Metadata = {
  title: "The Annex | Games from the collection",
  description:
    "When the museum closes, the collection comes out to play: a daily photo puzzle, a jigsaw, pairs, postcards, and pin the map, all built from the photographs.",
  alternates: { canonical: "/annex" },
  openGraph: {
    title: "The Annex at Maz Gallery",
    description: "A daily photo puzzle and four games built from the collection.",
    url: `${SITE_URL}/annex`,
  },
}

// Card art rotates with the day so the shelf never looks the same twice
export const dynamic = "force-dynamic"

const ICONS = { jigsaw: Puzzle, pairs: Copy, postcards: Mail, "pin-the-map": MapPin } as const

export default function AnnexPage() {
  const daily = getDailyPuzzle()
  const n = ORDERED_GALLERY.length
  const art = GAMES.map((_, i) => ORDERED_GALLERY[(daily.number * 7 + i * 19) % n])

  return (
    <section data-tone="dark" className="min-h-[100svh] bg-wall px-5 pb-28 pt-28 text-ivory sm:px-8 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-[1216px]">
        <div>
          <p className="label text-brass">No. 07 &middot; The Annex</p>
          <h1 className="mt-4 font-display text-[40px] font-normal leading-tight tracking-[-0.01em] sm:text-[56px]">
            After <span className="italic">hours</span>
          </h1>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-mist">
            When the museum closes, the collection comes out to play.
          </p>
        </div>

        <Link
          href="/daily"
          className="group mt-12 flex items-center justify-between gap-4 border border-wall-line bg-wall-2 px-5 py-5 transition-colors hover:border-brass/50 sm:px-6"
        >
          <div className="flex items-center gap-4">
            <CalendarDays className="size-5 shrink-0 text-teal" aria-hidden="true" />
            <div>
              <p className="label text-mist-2">No. 06 &middot; Every day</p>
              <p className="mt-1 font-display text-xl italic text-ivory">The Daily Postcard</p>
              <p className="mt-1 text-[13px] text-mist">
                Postcard {daily.number}: one photo, three tries, a new one every day
              </p>
            </div>
          </div>
          <ArrowRight className="size-5 shrink-0 text-mist transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game, i) => {
            const Icon = ICONS[game.slug]
            return (
              <Link key={game.slug} href={`/annex/${game.slug}`} className="group block text-left">
                <div className="frame p-1.5 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:p-2">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      // the first piece is on screen when the room opens on a phone
                      loading={i === 0 ? "eager" : undefined}
                      fetchPriority={i === 0 ? "high" : undefined}
                      src={art[i].src}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 280px"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Icon className="size-4 text-brass" aria-hidden="true" />
                  <h2 className="font-display text-2xl italic text-ivory">{game.title}</h2>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-mist">{game.blurb}</p>
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
                  <span className="link-arrow text-ivory">Play</span>
                  <Best gameKey={game.bestKey} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
