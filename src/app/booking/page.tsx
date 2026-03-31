import type { Metadata } from "next"
import { BookingForm } from "@/components/booking/booking-form"

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Connect with Mazen for a complimentary consultation on data visualization, analytics, and storytelling.",
  alternates: { canonical: "/booking" },
}

export default function BookingPage() {
  return (
    <>
      <section className="bg-charcoal pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-5xl font-bold text-white sm:text-6xl">
            Let&apos;s Talk
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Connect with me for a complimentary consultation. In a world driven
            by data, the ability to understand and communicate your story
            through data is invaluable.
          </p>
        </div>
      </section>

      <section className="bg-charcoal py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-6">
          <BookingForm />
        </div>
      </section>
    </>
  )
}
