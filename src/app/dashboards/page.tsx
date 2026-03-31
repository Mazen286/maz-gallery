import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"

export const metadata: Metadata = {
  title: "Dashboards",
  description: "Interactive data dashboards where data meets design. Flight tracking, sales analytics, and more.",
  alternates: { canonical: "/dashboards" },
}

const DASHBOARDS = [
  {
    title: "Tracking the Skies: FlightPulse",
    description: "A geospatial demo tracking flights in real-time with interactive mapping and data visualization.",
    image: "/images/dashboards/flightpulse.png",
  },
  {
    title: "Forge Ahead: Sales & Inventory Dashboard",
    description: "Interactive Power BI dashboard tracking revenue, orders, and inventory across retail operations.",
    image: "/images/dashboards/forge.png",
  },
]

export default function DashboardsPage() {
  return (
    <>
      <section className="bg-cream pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            Dashboard Showcase
          </p>
          <h1 className="mt-3 text-4xl font-bold text-navy sm:text-5xl">
            Where Data Meets Design
          </h1>
          <p className="mt-4 text-lg text-charcoal/70">
            Welcome to my collection of interactive dashboards, where data
            meets design and insights come to life.
          </p>
        </div>
      </section>

      <section className="bg-charcoal py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12">
            {DASHBOARDS.map((dash, i) => (
              <FadeIn key={dash.title} delay={i * 150}>
                <div className="overflow-hidden rounded-2xl bg-charcoal/50 border border-white/10">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={dash.image}
                      alt={dash.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-white">{dash.title}</h2>
                    <p className="mt-2 text-white/70">{dash.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
