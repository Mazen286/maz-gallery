export function Marquee() {
  return (
    <section className="overflow-hidden bg-cream py-12">
      <div className="animate-marquee flex whitespace-nowrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="mx-8 text-6xl font-bold italic text-navy/10 sm:text-8xl"
          >
            Talk Data to Me
          </span>
        ))}
      </div>
    </section>
  )
}
