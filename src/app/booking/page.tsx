import type { Metadata } from "next"
import { ConversationalForm } from "@/components/booking/conversational-form"
import { FIGMENT_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contact Mazen Abugharbieh | Say Hello",
  description: "Reach out to Mazen about projects, collaborations, photography, or just to say hello.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Get in Touch - Mazen Abugharbieh",
    description: "Reach out about projects, collaborations, photography, or just to say hello.",
    url: "https://maz.gallery/booking",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Contact Mazen Abugharbieh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get in Touch - Mazen Abugharbieh",
    description: "Reach out about projects, collaborations, photography, or just to say hello.",
    images: [{ url: "/images/og-default.jpg", alt: "Contact Mazen Abugharbieh" }],
  },
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
                Want to collaborate on something? Have questions about my work?
                Or just want to say hello? I&apos;d love to hear from you.
              </p>
              <p className="mt-6 text-base text-charcoal/50">
                Looking for data consulting, dashboards, or workshops?
                Head over to{" "}
                <a
                  href={FIGMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal underline-offset-4 hover:underline"
                >
                  Figment Analytics
                </a>
                .
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
