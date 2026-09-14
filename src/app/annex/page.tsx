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
    <section
      className="min-h-[100svh] px-6 pb-24 pt-28 sm:pt-32"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #161a26 0%, #0b0d13 55%, #08090d 100%)" }}
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal">No. 07 &middot; The Annex</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
          After <span className="italic">hours</span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/45">When the museum closes, the collection comes out to play.</p>

        <Link
          href="/daily"
          className="group mt-10 flex items-center justify-between gap-4 rounded-lg border border-teal/30 bg-teal/[0.05] px-5 py-4 transition-all hover:border-teal/60 hover:bg-teal/10"
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-teal" />
            <div>
              <p className="font-display text-lg italic text-white">The Daily Postcard</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                No. {daily.number} &middot; one photo, three tries, every day
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-teal/60 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game, i) => {
            const Icon = ICONS[game.slug]
            return (
              <Link
                key={game.slug}
                href={`/annex/${game.slug}`}
                className="group relative overflow-hidden rounded-lg border border-white/10 text-left transition-all hover:border-teal/50 hover:shadow-[0_0_30px_rgba(120,200,214,0.12)]"
              >
                <div className="relative h-36 overflow-hidden sm:h-44">
                  <Image
                    src={art[i].src}
                    alt=""
                    fill
                    className="object-cover opacity-50 transition-all duration-500 group-hover:scale-105 group-hover:opacity-75"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] to-transparent" />
                </div>
                <div className="px-5 pb-5">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-teal" />
                    <h2 className="font-display text-xl italic text-white">{game.title}</h2>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/45">{game.blurb}</p>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-teal/60 transition-colors group-hover:text-teal">Play</p>
                    <Best gameKey={game.bestKey} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
