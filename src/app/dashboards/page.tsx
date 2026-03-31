import type { Metadata } from "next"
import Image from "next/image"
import { SERVICES } from "@/lib/constants"
import { FadeIn } from "@/components/shared/fade-in"
import { TiltCard } from "@/components/shared/tilt-card"

export const metadata: Metadata = {
  title: "Dashboards",
  description: "Interactive data dashboards where data meets design. Flight tracking, sales analytics, and more.",
  alternates: { canonical: "/dashboards" },
}

const DASHBOARDS = [
  {
    title: "Tracking the Skies: FlightPulse",
    description: "Real-time flight tracking with geospatial mapping. Built to show how location data becomes situational awareness.",
    image: "/images/dashboards/Screenshot-Dashboard.png",
  },
  {
    title: "Forge Ahead: Sales & Inventory Dashboard",
    description: "Revenue, orders, and inventory in one view. Built in Power BI for a retail team that needed answers, not more reports.",
    image: "/images/dashboards/Figment-Forge-Dashboard-Image.png",
  },
]

export default function DashboardsPage() {
  return (
    <>
      <section className="bg-white pb-0 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-[5rem] font-bold uppercase leading-[0.9] tracking-tight text-navy sm:text-[8rem]">
            Dashboard Showcase
          </h1>
        </div>
      </section>

      <section className="bg-white pb-12 pt-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/dashboards/storytelling-data-hero.png"
              alt="Dashboard visualization"
              width={1400}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-white pb-12">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            The Work
          </p>
          <p className="mt-4 text-lg text-charcoal/70">
            Dashboards that people actually use. Each one started as a messy
            dataset and became something a team could build decisions around.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <hr className="mb-8 border-border" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
              Services
            </p>
            <ul className="mt-6 space-y-4">
              {SERVICES.map((service) => (
                <li key={service} className="border-b border-border pb-4 text-lg font-medium text-navy">
                  {service}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <section className="bg-white pb-8">
        <div className="mx-auto max-w-4xl px-6">
          <hr className="mb-8 border-border" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            My Showcase
          </p>
        </div>
      </section>

      <section className="bg-charcoal py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12">
            {DASHBOARDS.map((dash, i) => (
              <FadeIn key={dash.title} delay={i * 150}>
                <TiltCard bobDelay={i * 500}>
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
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
