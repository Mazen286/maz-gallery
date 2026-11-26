import Image from "next/image"
import Link from "next/link"
import { GAMES } from "@/lib/annex"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHead } from "@/components/shared/section-head"

// The one thing most portfolios cannot offer: a reason to come back tomorrow.
export function AnnexTeaser() {
  return (
    <section id="annex" className="bg-wall py-24 text-ivory sm:py-32">
      <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
        <SectionHead number="No. 07" title="The Annex" tone="dark" />
        <p className="mt-10 max-w-xl font-display text-[22px] leading-snug text-mist sm:text-[26px]">
          When the museum closes, the collection comes out to play.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <FadeIn>
            <Link
              href="/daily"
              className="group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden border border-wall-line bg-wall-2 p-7 transition-colors hover:border-brass/50 sm:p-10"
            >
              <div className="relative z-10 max-w-[19rem]">
                <p className="label inline-flex items-center gap-2 text-teal">
                  <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
                  No. 06 &middot; Every day
                </p>
                <h3 className="mt-5 font-display text-[34px] italic leading-tight sm:text-[40px]">The Daily Postcard</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-mist">
                  One photograph from the collection, three guesses at where it was taken. Keep a streak, share the
                  result, come back tomorrow.
                </p>
              </div>
              <span className="link-arrow relative z-10 mt-8 self-start text-ivory">Play today&apos;s</span>
              {/* A postcard on the table: decoration, not today's photograph */}
              <div
                aria-hidden="true"
                className="frame pointer-events-none absolute -right-10 top-10 hidden w-[300px] rotate-[6deg] transition-transform duration-500 group-hover:rotate-[4deg] md:block"
              >
                <Image
                  src="/images/gallery/Alanya-(16-of-20).jpg"
                  alt=""
                  width={1500}
                  height={1000}
                  className="h-auto w-full"
                  sizes="300px"
                />
              </div>
            </Link>
          </FadeIn>

          <FadeIn delay={120}>
            <Link
              href="/annex"
              className="group flex h-full flex-col justify-between border border-wall-line bg-wall-2 p-7 transition-colors hover:border-brass/50 sm:p-10"
            >
              <div>
                <p className="label text-mist">After hours</p>
                <h3 className="mt-5 font-display text-[30px] italic leading-tight sm:text-[34px]">
                  Four games from the photographs
                </h3>
                <ul className="mt-5 space-y-2 text-[15px] text-mist">
                  {GAMES.map((g) => (
                    <li key={g.slug}>
                      <span className="text-ivory">{g.title}.</span> {g.blurb}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="link-arrow mt-8 self-start text-ivory">Open the Annex</span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
