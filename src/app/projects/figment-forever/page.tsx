import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import LoopVideo from "@/components/shared/loop-video"

// Figment Forever: the case study. Written with Mazen; every couple, guest and planner shown is fictional.
const TITLE = "Figment Forever"
const DESCRIPTION = "Wedding invitations and websites that make the moment yours."
const URL = "https://maz.gallery/projects/figment-forever"
const ACCENT = "#c48a7d"
const IMG = "/images/projects/figment-forever"
// the live demo: each link is a guest's personal invitation, so it opens addressed to them
const DEMO = "https://forever.figmentanalytics.com"
const LIVE = [
  { name: "Damascene", couple: "Layla & Karim", href: `${DEMO}/en?i=demoen0001` },
  { name: "Garden Romantic", couple: "Olivia & James", href: `${DEMO}/en?i=demogd0001` },
  { name: "Coastal", couple: "Maya & Lucas", href: `${DEMO}/en?i=democo0001` },
  { name: "Crimson Rose", couple: "Sofia & Luca", href: `${DEMO}/en?i=democr0001` },
]
const STEPS = [
  "A conversation about the two of you and the day.",
  "Your look, from one of our themes or made from scratch.",
  "Invitations go out, each household its own.",
  "Replies, reminders and seating, all in one place.",
  "The day itself.",
]

export const metadata: Metadata = {
  title: `${TITLE} | Projects`,
  description: DESCRIPTION,
  alternates: { canonical: "/projects/figment-forever" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: [{ url: `${IMG}/hero-v3.webp`, width: 2400, height: 1350, alt: "Four Figment Forever wedding sites, one in each look" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${IMG}/hero-v3.webp`] },
}

function Figure({ src, alt, caption, width = 1600, height = 1150 }: { src: string; alt: string; caption: string; width?: number; height?: number }) {
  return (
    <figure className="not-prose my-12">
      <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full rounded-xl" sizes="(max-width: 768px) 100vw, 768px" />
      <figcaption className="mt-3 text-center font-display text-sm italic text-charcoal/50">{caption}</figcaption>
    </figure>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <figcaption className="mt-3 text-center font-display text-sm italic text-charcoal/50">{children}</figcaption>
}

/** The four live invitations, as cards. */
function Live({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`not-prose grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2"}`}>
      {LIVE.map((d) => (
        <a
          key={d.name}
          href={d.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-navy/10 bg-white px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-4"
        >
          <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            {compact ? "Open" : "See it live"}
          </span>
          <span className="mt-1 block font-display text-base text-navy sm:text-lg">{d.name}</span>
          <span className="block font-display text-sm italic text-charcoal/55">{d.couple}</span>
        </a>
      ))}
    </div>
  )
}

export default function FigmentForeverPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://maz.gallery" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://maz.gallery/projects" },
      { "@type": "ListItem", position: 3, name: TITLE, item: URL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <article className="bg-[#fbfaf6] pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
              <li><Link href="/" className="hover:text-teal">Home</Link></li>
              <li>/</li>
              <li><Link href="/projects" className="hover:text-teal">Projects Wing</Link></li>
              <li>/</li>
              <li className="truncate text-charcoal/60">{TITLE}</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-charcoal/45">
            <span className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: ACCENT }}>
              Project
            </span>
            <span>2026</span>
            <span>&middot;</span>
            <span>Wedding studio</span>
          </div>

          <h1 className="mt-5 font-display font-semibold leading-[1.08] text-navy" style={{ fontSize: "clamp(2.1rem, 5vw, 3.4rem)" }}>
            {TITLE}
          </h1>
          <p className="mt-4 font-display text-lg italic leading-relaxed text-charcoal/60 sm:text-xl">{DESCRIPTION}</p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/40">By Mazen Abugharbieh</p>

          {/* the four openings, in motion: what a guest sees first */}
          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-xl bg-[#f4f1eb]">
            <LoopVideo
              src={`${IMG}/openings-v3.mp4`}
              poster={`${IMG}/openings-v3-poster.webp`}
              label="Four wedding invitations opening on phones, one in each look: a gatefold tied with a ribbon, two cards, and a letter sealed with wax"
              width={1600}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="mt-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/45">
              Open an invitation, the way a guest would
            </p>
            <Live compact />
          </div>

          <div className="reading-room prose prose-lg mt-12 max-w-none font-display text-charcoal/85 prose-headings:font-display prose-headings:text-navy prose-h2:mt-14 prose-h2:text-2xl prose-h2:sm:text-3xl prose-p:leading-[1.85] prose-a:text-teal prose-hr:my-10 prose-li:leading-[1.8]">
            <h2>Why I built it</h2>
            <p>
              A friend was planning her wedding and kept running into walls. She wanted to shape the website her own
              way. She wanted to know which emails had been opened and clicked, and which WhatsApp messages had gone out.
              Instead she kept having to compromise, on one of the most important moments of her life.
            </p>
            <p>
              So I told her I wanted to help, and we built it together, exactly the way she needed it. Some guests got
              their invitation in Arabic, others in English. There was so much to customize that building it ourselves
              was the best way to do it.
            </p>

            <h2>Who it&apos;s for</h2>
            <p>
              Figment Forever works hand in hand with wedding planners. Planners use it to run every wedding they take
              on. Couples get the parts that are theirs, like their guest list, and can bring their planner to us.
            </p>

            <h2>What I&apos;m proudest of</h2>
            <p>
              It lets a couple make this moment their own, and start celebrating it long before the wedding, the way
              they want to. Why accept the limits?
            </p>
            <p>There are options, but the point is to be bespoke, tailored to each couple.</p>
            <p>
              And the opening. It&apos;s an entrance, the way the couple will make one on their big day. I&apos;m proud
              of that, and of everything that follows it.
            </p>
            <figure className="not-prose my-12">
              <div className="flex justify-center rounded-xl bg-[#f4f1eb] px-6 py-10 sm:py-12">
                <LoopVideo
                  src={`${IMG}/entrance.mp4`}
                  poster={`${IMG}/entrance-poster.webp`}
                  label="A wedding invitation opening on a phone: the ribbon unties, the card opens, and the guest's welcome appears"
                  width={600}
                  height={1298}
                  className="h-auto w-[min(300px,72%)] rounded-[22px] shadow-[0_18px_40px_-16px_rgba(70,55,45,0.45)]"
                />
              </div>
              <Caption>The entrance: the ribbon unties, the invitation opens, and the guest walks in.</Caption>
            </figure>

            <h2>Behind each wedding</h2>
            <p>Every wedding has a dashboard where it all runs.</p>
            <Figure
              src={`${IMG}/console-overview.webp`}
              alt="A wedding's dashboard: invitations sent, opened and replied, and the replies for each celebration"
              caption="Who's been invited, who's opened it, and who's replied, for each celebration."
              height={1100}
            />
            <ul>
              <li>
                <strong>Where every invitation stands.</strong> Which emails were opened and clicked, which WhatsApp and
                text messages went out, and every reply as it arrives, by guest and by celebration.
              </li>
              <li>
                <strong>A personal invitation for every household.</strong> Each one opens addressed to them, with only
                the celebrations they&apos;re invited to.
              </li>
              <li>
                <strong>Each guest in their own language.</strong> Every household gets the site, the emails and the
                messages in its language. English and Arabic today, built to add more.
              </li>
              <li>
                <strong>Sent the way people actually talk.</strong> By email, or by WhatsApp and text from your own phone,
                with the message already written, all recorded in one place.
              </li>
              <li>
                <strong>Reminders that know who replied.</strong> They go only to guests who haven&apos;t answered, and
                only about what they haven&apos;t answered.
              </li>
            </ul>
            <figure className="not-prose my-12">
              <div className="grid gap-3 sm:grid-cols-2">
                <Image src={`${IMG}/console-household.webp`} alt="One household in the dashboard: its invitation, contact details, celebrations and guests" width={1400} height={1750} className="h-auto w-full rounded-xl" sizes="(max-width: 640px) 100vw, 384px" />
                <Image src={`${IMG}/console-seating.webp`} alt="The seating planner: a room with tables, every guest seated, colored by side" width={1400} height={1750} className="h-auto w-full rounded-xl" sizes="(max-width: 640px) 100vw, 384px" />
              </div>
              <Caption>A household&apos;s invitation, guests and replies, and the seating planner.</Caption>
            </figure>
            <p>There&apos;s more: a QR code for each household&apos;s personal link, and guest list import.</p>
            <Figure
              src={`${IMG}/languages.webp`}
              alt="The same wedding site in English and in Arabic"
              caption="The same invitation, in English and in Arabic."
            />

            <h2>Four looks</h2>
            <p>
              Damascene, Garden Romantic, Coastal and Crimson Rose. Each one has its own colors, art, type, opening and
              music. The couples here are made up, so you can see the range. Each link below opens a guest&apos;s
              personal invitation, so you can walk in the way a guest would, reply and all.
            </p>
            <Live />
            <Figure
              src={`${IMG}/hero-v3.webp`}
              alt="Four wedding sites on phones, one in each look: Damascene, Garden Romantic, Coastal and Crimson Rose"
              caption="Damascene, Garden Romantic, Coastal and Crimson Rose."
              width={2400}
              height={1350}
            />

            <h2>Make it yours</h2>
            <p>
              Start from one of our themes, or go fully bespoke, with your own art, cards and opening. Either way, every
              wedding starts with a conversation.
            </p>
            <ol>
              {STEPS.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/booking"
              className="rounded-full bg-navy px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-navy/85"
            >
              Get in touch at the Front Desk
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
