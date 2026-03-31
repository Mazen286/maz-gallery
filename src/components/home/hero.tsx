import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-6xl font-bold leading-[0.95] text-navy sm:text-7xl lg:text-8xl">
              Mazen
              <br />
              Abugharbieh
            </h1>
            <p className="mt-2 text-4xl font-bold text-teal sm:text-5xl lg:text-6xl" dir="rtl">
              مازن
            </p>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-charcoal/60">
              Data & Analytics Professional / Photographer / Collector
            </p>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-charcoal" />
              <Image
                src="/images/headshot.jpg"
                alt="Mazen Abugharbieh"
                width={500}
                height={520}
                priority
                className="relative z-10 h-auto w-80 rounded-2xl object-cover sm:w-96"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
