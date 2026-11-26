"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTimeTheme, type TimeOfDay } from "@/hooks/use-time-theme"

const GREETINGS: Record<TimeOfDay, string> = {
  morning: "Good morning. The gallery just opened.",
  afternoon: "The gallery is open. Come in.",
  evening: "Golden hour at the gallery.",
  night: "Open late tonight.",
}

// The entrance plays once per page load. Coming back to the entrance from
// another room within the site, everything is already in place.
let entrancePlayed = false

// Staggered entrance: each block rises into place once, then everything is still.
// CSS animations (heroRise, heroSettle in globals.css) start on first paint, so
// the name and portrait never wait for the page's JavaScript; with reduced
// motion every animation finishes at once.
function entrance(play: boolean, delay: number): React.CSSProperties {
  return play ? { animation: `heroRise 1100ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` } : {}
}

export function Hero({ works, places }: { works: number; places: number }) {
  const [play] = useState(() => !entrancePlayed)
  useEffect(() => {
    entrancePlayed = true
  }, [])
  const { period } = useTimeTheme()

  return (
    <section id="hero" className="relative overflow-hidden bg-wall text-ivory">
      {/* Arabic watermark, still and faint (kept exactly as it was) */}
      <p
        className="pointer-events-none absolute bottom-[8%] left-[3%] select-none font-semibold leading-none text-white/[0.05]"
        style={{ fontSize: "clamp(10rem, 28vw, 28rem)" }}
        dir="rtl"
        lang="ar"
        aria-hidden="true"
      >
        مازن
      </p>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1312px] items-center gap-10 px-5 pb-16 pt-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:pb-20 lg:pt-28">
        {/* The portrait hangs in a mat at its own size, so it stays sharp on wide and dense screens */}
        <figure className="order-first mx-auto w-full max-w-[min(100%,calc(52svh*0.8))] sm:max-w-[420px] lg:order-last lg:mx-0 lg:ml-auto lg:max-w-[460px]">
          <div
            className="frame"
            style={play ? { animation: "heroRise 1300ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both" } : undefined}
          >
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[2/3]">
              <Image
                src="/images/hero-portrait.jpg"
                alt="Mazen Abugharbieh, seated on concrete steps in a quilted navy jacket"
                fill
                preload
                className="object-cover object-[center_22%]"
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 400px, 90vw"
                style={play ? { animation: "heroSettle 2400ms cubic-bezier(0.22, 1, 0.36, 1) both" } : undefined}
              />
            </div>
          </div>
          <figcaption
            className="mt-4 hidden items-baseline justify-between gap-4 border-t border-wall-line pt-3 sm:flex"
            style={entrance(play, 1100)}
          >
            <span>
              <span className="block font-display text-[15px] italic text-ivory">Self Portrait</span>
              <span className="mt-0.5 block text-[13px] text-mist-2">Mixed media: data and light</span>
            </span>
            <span className="text-right text-[13px] text-mist-2">Analyst, photographer, founder</span>
          </figcaption>
        </figure>

        <div>
          <p className="label text-brass" style={entrance(play, 150)}>
            No. 01 &middot; The Entrance
          </p>

          <h1
            className="mt-5 font-display font-normal leading-[0.92] tracking-[-0.02em]"
            style={{ fontSize: "clamp(3rem, 7.4vw, 6.75rem)", ...entrance(play, 300) }}
          >
            Mazen
            <br />
            <span className="italic text-ivory/90">Abugharbieh</span>
          </h1>

          <p
            className="mt-7 max-w-[34rem] font-display text-lg leading-relaxed text-mist sm:text-xl"
            style={entrance(play, 550)}
          >
            A data analyst in San Diego who takes photographs. This is where the photographs live, with the
            stories behind them.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={entrance(play, 800)}>
            <Link href="/gallery" className="btn btn-ivory">
              Enter the Gallery
            </Link>
            <Link href="/projects" className="link-arrow text-ivory">
              See what I build
            </Link>
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-mist" style={entrance(play, 1000)}>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
              <span className="text-ivory">{GREETINGS[period]}</span>
            </span>
            <span>
              {works} works from {places} places
            </span>
            <Link href="/daily" className="underline decoration-mist-2/60 underline-offset-4 transition-colors hover:text-ivory">
              Today&apos;s postcard is up
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
