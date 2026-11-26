import type { Metadata } from "next"
import { Suspense } from "react"
import { ConversationalForm } from "@/components/booking/conversational-form"
import { FIGMENT_URL, EMAIL, SOCIAL, roomFor } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Say Hello | Contact Mazen",
  description: "Reach out to Mazen about projects, collaborations, or photography, or just to say hello. Available for data consulting, dashboards, and creative work from San Diego.",
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
    <section className="bg-paper pb-24 pt-28 text-ink sm:pb-32 sm:pt-36">
      <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
        <p className="label text-brass-ink">{roomFor("/booking")?.number} &middot; Front Desk</p>
        <h1
          className="mt-5 font-display font-normal leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
        >
          Say <span className="italic">hello</span>.
        </h1>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="max-w-xl font-display text-[22px] leading-[1.5] sm:text-[26px]">
              Want to collaborate on something? Have questions about my work? Or just wandered in from the gallery?
              I&apos;d love to hear from you.
            </p>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-2">
              Looking for data consulting, dashboards, or workshops? Head over to{" "}
              <a
                href={FIGMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink underline decoration-brass-ink/50 underline-offset-4 hover:decoration-ink"
              >
                Figment Analytics
              </a>
              .
            </p>

            {/* Front desk placard */}
            <div className="mt-12 max-w-sm border-t border-line pt-6">
              <p className="label text-brass-ink">At the desk</p>
              <dl className="mt-4 space-y-3 text-[15px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-3">Email</dt>
                  <dd className="min-w-0 break-all text-right">
                    <a href={`mailto:${EMAIL}`} className="text-ink underline-offset-4 hover:underline">
                      {EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-3">Based in</dt>
                  <dd>San Diego, CA</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-3">Response time</dt>
                  <dd>Usually within a day</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-3">Walk-ins</dt>
                  <dd>Always welcome</dd>
                </div>
              </dl>
              <div className="mt-5 flex gap-6 border-t border-line pt-3">
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="label py-2 text-ink-2 transition-colors hover:text-ink">
                  Instagram
                </a>
                <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="label py-2 text-ink-2 transition-colors hover:text-ink">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="label mb-3 text-ink-2">The guest book</p>
            <Suspense fallback={<div className="h-[500px] border border-line bg-white" />}>
              <ConversationalForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
