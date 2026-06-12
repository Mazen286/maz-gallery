import type { Metadata } from "next"
import { ConversationalForm } from "@/components/booking/conversational-form"
import { FIGMENT_URL, EMAIL, SOCIAL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contact Mazen Abugharbieh | Say Hello",
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
    <section className="bg-[#f7f5ef] pb-20 pt-28 sm:pb-28 sm:pt-36">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal">
          No. 06 &middot; Front Desk
        </p>
        <h1
          className="mt-4 font-display font-semibold leading-[1.02] text-navy"
          style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}
        >
          Say <span className="italic">hello</span>.
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-display text-xl leading-relaxed text-charcoal sm:text-2xl">
              Want to collaborate on something? Have questions about my work?
              Or just wandered in from the gallery? I&apos;d love to hear from you.
            </p>
            <p className="mt-6 text-base text-charcoal/60">
              Looking for data consulting, dashboards, or workshops? Head over
              to{" "}
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

            {/* Front desk placard */}
            <div className="mt-10 max-w-sm border border-navy/15 bg-white/60 p-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-teal">
                At the desk
              </p>
              <dl className="mt-4 space-y-3 text-sm text-charcoal/80">
                <div className="flex justify-between gap-4">
                  <dt className="text-charcoal/45">Email</dt>
                  <dd>
                    <a href={`mailto:${EMAIL}`} className="text-navy underline-offset-4 hover:underline">
                      {EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-charcoal/45">Based in</dt>
                  <dd>San Diego, CA</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-charcoal/45">Response time</dt>
                  <dd>Usually within a day</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-charcoal/45">Walk-ins</dt>
                  <dd>Always welcome</dd>
                </div>
              </dl>
              <div className="mt-5 flex gap-5 border-t border-navy/10 pt-4">
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50 transition-colors hover:text-teal"
                >
                  Instagram
                </a>
                <a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50 transition-colors hover:text-teal"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal/40">
              The guest book
            </p>
            <ConversationalForm />
          </div>
        </div>
      </div>
    </section>
  )
}
