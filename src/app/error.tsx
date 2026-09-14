"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#0a0c11] px-6 pt-16 text-center">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-teal/70">Closed for maintenance</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-6xl">
          This room is <span className="italic">temporarily dark</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
          Something went wrong loading this page. Try again, or head back to the entrance.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-[#0a0c11] transition-colors hover:bg-teal/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition-colors hover:border-white/50 hover:text-white"
          >
            Back to the entrance
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 font-mono text-[10px] text-white/25">ref {error.digest}</p>
        )}
      </div>
    </section>
  )
}
