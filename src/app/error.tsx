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
    <section data-tone="dark" className="flex min-h-[70vh] items-center justify-center bg-wall px-5 pb-16 pt-28 text-center text-ivory">
      <div>
        <p className="label text-brass">Closed for maintenance</p>
        <h1 className="mt-5 font-display text-4xl font-normal leading-tight sm:text-6xl">
          This room is <span className="italic">temporarily dark</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-mist">
          Something went wrong loading this page. Try again, or head back to the entrance.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-ivory">
            Try again
          </button>
          <Link href="/" className="btn btn-line text-ivory">
            Back to the entrance
          </Link>
        </div>
        {error.digest && <p className="mt-6 text-[12px] text-mist-2">Reference {error.digest}</p>}
      </div>
    </section>
  )
}
