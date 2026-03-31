import type { Metadata } from "next"
import { ConversationalForm } from "@/components/booking/conversational-form"

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Connect with Mazen for a complimentary consultation on data visualization, analytics, and storytelling.",
  alternates: { canonical: "/booking" },
}

export default function BookingPage() {
  return (
    <>
      <section className="bg-white pb-0 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-[8rem] font-bold leading-[0.9] tracking-tight text-navy sm:text-[12rem]">
            LET&apos;S TALK
          </h1>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <hr className="mb-16 border-t-2 border-navy" />
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-2xl leading-relaxed text-charcoal sm:text-3xl">
                Got a dataset nobody understands? A team that needs to think
                differently about their numbers? Or just a question about
                what&apos;s possible with your data? Let&apos;s talk. First
                conversation is always free.
              </p>
            </div>
            <div>
              <ConversationalForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
