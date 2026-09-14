import Link from "next/link"
import { CalendarDays, Gamepad2, ArrowRight } from "lucide-react"
import { GAMES } from "@/lib/annex"
import { FadeIn } from "@/components/shared/fade-in"

// The one thing most portfolios cannot offer: a reason to come back tomorrow.
export function AnnexTeaser() {
  return (
    <section id="annex" className="bg-[#0a0c11] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <p className="max-w-md text-lg leading-relaxed text-white/50">
            When the museum closes, the collection comes out to play.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-[3fr_2fr]">
          <FadeIn delay={100}>
            <Link
              href="/daily"
              className="group flex h-full flex-col justify-between rounded-lg border border-teal/30 bg-teal/[0.05] p-6 transition-all hover:border-teal/60 hover:bg-teal/10 sm:p-8"
            >
              <div>
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-teal/80">
                  <CalendarDays className="size-3.5" />
                  Every day
                </p>
                <h2 className="mt-4 font-display text-3xl italic text-white sm:text-4xl">The Daily Postcard</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
                  One photograph from the collection, three guesses at where it was taken.
                  Keep a streak, share the result, come back tomorrow.
                </p>
              </div>
              <p className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-teal transition-all group-hover:gap-3">
                Play today&apos;s
                <ArrowRight className="size-3.5" />
              </p>
            </Link>
          </FadeIn>

          <FadeIn delay={200}>
            <Link
              href="/annex"
              className="group flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-teal/50 hover:bg-white/[0.05] sm:p-8"
            >
              <div>
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                  <Gamepad2 className="size-3.5" />
                  The Annex
                </p>
                <h2 className="mt-4 font-display text-2xl italic text-white">Four games from the photographs</h2>
                <ul className="mt-4 space-y-1.5 text-sm text-white/55">
                  {GAMES.map((g) => (
                    <li key={g.slug} className="flex items-baseline gap-2">
                      <span className="text-teal/60">&middot;</span>
                      <span>
                        <span className="text-white/80">{g.title}.</span> {g.blurb}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 transition-all group-hover:gap-3 group-hover:text-teal">
                Open the Annex
                <ArrowRight className="size-3.5" />
              </p>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
