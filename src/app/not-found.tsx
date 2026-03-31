import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a0505]">
      {/* Red ambient light */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(180,40,40,0.15) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 80% 70%, rgba(180,40,40,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Film strips decoration */}
      <div className="absolute left-8 top-0 h-full w-8 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="mb-2 h-6 w-full rounded-sm bg-white/20" />
        ))}
      </div>
      <div className="absolute right-8 top-0 h-full w-8 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="mb-2 h-6 w-full rounded-sm bg-white/20" />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-red-400/60">
          Error 404
        </p>
        <h1 className="mt-6 text-6xl font-bold text-white/90 sm:text-8xl">
          Lost in the
          <br />
          <span className="italic text-red-400/80">Darkroom</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-white/40">
          This page doesn&apos;t exist yet. Maybe it never did. Either way,
          the chemicals ran out before anything could develop.
        </p>

        {/* Developing tray */}
        <div className="mx-auto mt-12 h-32 w-64 rounded-lg border border-white/10 bg-white/5">
          <div className="flex h-full items-center justify-center">
            <div className="h-20 w-48 rounded bg-white/[0.03]">
              <div
                className="flex h-full items-center justify-center text-sm text-white/20"
                style={{
                  animation: "pulse 3s ease-in-out infinite",
                }}
              >
                [ developing... ]
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-12 inline-block rounded-full border border-red-400/30 px-8 py-3 text-sm font-medium text-red-400/70 transition-all hover:border-red-400/60 hover:bg-red-400/10 hover:text-red-400"
        >
          Find the Exit
        </Link>
      </div>
    </div>
  )
}
