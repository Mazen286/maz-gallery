import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

// Figment Forever: the case study. Written with Mazen; every couple and guest shown is fictional.
const TITLE = "Figment Forever"
const DESCRIPTION = "Wedding invitations and websites that make the moment yours."
const URL = "https://maz.gallery/projects/figment-forever"
const ACCENT = "#c48a7d"

export const metadata: Metadata = {
  title: `${TITLE} | Projects`,
  description: DESCRIPTION,
  alternates: { canonical: "/projects/figment-forever" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: [{ url: "/images/projects/figment-forever/hero.webp", width: 2400, height: 1350, alt: "Three Figment Forever wedding sites" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/projects/figment-forever/hero.webp"] },
}

function Figure({ src, alt, caption, width = 1600, height = 1150 }: { src: string; alt: string; caption: string; width?: number; height?: number }) {
  return (
    <figure className="not-prose my-12">
      <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full rounded-xl" sizes="(max-width: 768px) 100vw, 768px" />
      <figcaption className="mt-3 text-center font-display text-sm italic text-charcoal/50">{caption}</figcaption>
    </figure>
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

          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src="/images/projects/figment-forever/hero.webp"
              alt="Three wedding sites made with Figment Forever, one in each theme"
              fill
              className="object-cover"
              preload
              sizes="(max-width: 768px) 100vw, 768px"
            />
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
              Figment Forever is built to work hand in hand with a wedding planner. It gives the planner and us the
              tools behind each wedding, and gives couples a few things of their own, like their guest list. So
              it&apos;s for both: planners who&apos;d like to work with us, and couples who love it and want to point
              their planner our way.
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
            <Figure
              src="/images/projects/figment-forever/entrance.webp"
              alt="A wedding site's opening, its personal welcome, and its reply form, on a phone"
              caption="The opening, the welcome, the reply."
            />

            <h2>Behind each wedding</h2>
            <p>Every wedding has a dashboard where it all runs.</p>
            <ul>
              <li>
                <strong>Where every invitation stands.</strong> Which emails were opened and clicked, which WhatsApp and
                text messages went out, and every reply as it arrives, by guest and by celebration.
              </li>
              <li>
                <strong>Each guest in their own language.</strong> Every household gets the site, the emails and the
                messages in its language. English and Arabic today, built to add more.
              </li>
              <li>
                <strong>Reminders that know who replied.</strong> They go only to guests who haven&apos;t answered, and
                only about what they haven&apos;t answered.
              </li>
            </ul>
            <p>There&apos;s more: a seating planner, a QR code for each household&apos;s personal link, and guest list import.</p>
            <Figure
              src="/images/projects/figment-forever/languages.webp"
              alt="The same wedding site in English and in Arabic"
              caption="The same invitation, in English and in Arabic."
            />

            <h2>Three looks</h2>
            <p>
              Damascene, Garden Romantic and Coastal. Each one has its own colors, art, type and opening. The couples
              here are made up, so you can see the range.
            </p>
            <Figure
              src="/images/projects/figment-forever/openings.webp"
              alt="The opening of three wedding sites: a ribboned gatefold, a card on linen, and a card on sand"
              caption="Three openings: a gatefold tied with a ribbon, a card on linen, a card on sand."
            />

            <h2>Make it yours</h2>
            <p>
              Start from one of our themes, or go fully bespoke, with your own art, cards and opening. Either way, every
              wedding starts with a conversation.
            </p>
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
