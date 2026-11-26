import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page doesn't exist. Head back to MazGallery to explore data projects, photography, and more from Mazen Abugharbieh.",
  robots: { index: false, follow: false },
}

// A dark room: the darkroom where nothing developed. data-tone="dark" turns
// the header and the page behind it dark too, from the first paint.
export default function NotFound() {
  return (
    <div data-tone="dark" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-wall px-5 pb-20 pt-28 text-ivory">
      {/* Safelight: the one red lamp a darkroom allows */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(170,50,40,0.16) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 max-w-xl text-center">
        <p className="label text-brass">Error 404 &middot; The Darkroom</p>
        <h1 className="mt-6 font-display font-normal leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}>
          Lost in the <span className="italic text-[#e8a49a]">Darkroom</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md font-display text-lg leading-relaxed text-mist sm:text-xl">
          This page doesn&apos;t exist yet. Maybe it never did. Either way, the chemicals ran out before anything could
          develop.
        </p>

        {/* Developing tray: an empty print, still white */}
        <div aria-hidden="true" className="frame mx-auto mt-12 w-56 rotate-[-2deg] sm:w-64">
          <div className="flex aspect-[3/2] items-center justify-center bg-[#e9e4d8]">
            <span className="font-display text-sm italic text-ink-2 motion-safe:animate-pulse">developing&hellip;</span>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-ivory">
            Find the exit
          </Link>
          <Link href="/gallery" className="btn btn-line text-ivory">
            Enter the Gallery
          </Link>
        </div>
      </div>
    </div>
  )
}
