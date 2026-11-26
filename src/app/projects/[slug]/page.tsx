import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PROJECT_PAGES, type ProjectPage, type Shot } from "@/lib/project-pages"
import { ALL_PROJECTS, PROJECT_ROOMS, projectBySlug } from "@/lib/projects"
import { SITE_URL, AUTHOR_NAME } from "@/lib/constants"
import { SectionHead } from "@/components/shared/section-head"
import { FadeIn } from "@/components/shared/fade-in"
import { ProjectCard } from "@/components/projects/project-card"

// One page per project in the wing, prerendered. Figment Forever keeps its own
// hand-built page (its static folder wins over this route).
export const dynamicParams = false

export function generateStaticParams() {
  return PROJECT_PAGES.map((p) => ({ slug: p.slug }))
}

const pageUrl = (slug: string) => `${SITE_URL}/projects/${slug}`

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = PROJECT_PAGES.find((p) => p.slug === slug)
  const project = projectBySlug(slug)
  if (!page || !project) return {}
  const title = `${page.title}, ${project.subtitle.toLowerCase()} by ${AUTHOR_NAME}`
  const card = { url: `/projects/${slug}/card`, width: 1200, height: 630, alt: `${page.title}: ${project.subtitle}` }
  return {
    title,
    description: page.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { type: "article", title: page.title, description: page.summary, url: pageUrl(slug), images: [card] },
    twitter: { card: "summary_large_image", title: page.title, description: page.summary, images: [card] },
  }
}

// Anything a source could not confirm is written [in square brackets] and
// shows marked, so it can't slip out as if it were a fact
function Copy({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <mark key={i} className="rounded-sm bg-brass/25 px-1 text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

function schemaFor(page: ProjectPage, image: string) {
  const author = { "@type": "Person", "@id": `${SITE_URL}/about#person`, name: AUTHOR_NAME, url: `${SITE_URL}/about` }
  const base = {
    "@type": page.schemaType,
    name: page.title,
    description: page.summary,
    url: page.link.href,
    image,
    sameAs: page.sameAs,
    ...(page.dateCreated ? { dateCreated: page.dateCreated } : {}),
  }
  const entity =
    page.schemaType === "Organization"
      ? { ...base, founder: author }
      : page.schemaType === "VideoGame"
        ? { ...base, author, genre: page.genre, gamePlatform: "Web browser", applicationCategory: "Game", operatingSystem: "Any" }
        : page.schemaType === "WebApplication" || page.schemaType === "SoftwareApplication"
          ? { ...base, author, applicationCategory: "BusinessApplication", operatingSystem: "Any" }
          : { ...base, author }
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl(page.slug),
    url: pageUrl(page.slug),
    name: page.title,
    description: page.summary,
    author,
    primaryImageOfPage: image,
    about: entity,
    isPartOf: { "@type": "CollectionPage", "@id": `${SITE_URL}/projects`, name: "Projects by Mazen Abugharbieh" },
  }
}

function ShotFigure({ shot, sizes }: { shot: Shot; sizes: string }) {
  const phone = shot.frame === "phone"
  return (
    <figure className={phone ? "w-full" : ""}>
      <div className={phone ? "overflow-hidden rounded-[22px] border-[6px] border-ink bg-ink shadow-[0_30px_50px_-28px_rgba(22,23,27,0.55)]" : "frame-light"}>
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} className="h-auto w-full" sizes={sizes} />
      </div>
      {shot.caption && <figcaption className="mt-3 font-display text-[15px] italic text-ink-2">{shot.caption}</figcaption>}
    </figure>
  )
}

export default async function ProjectPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = PROJECT_PAGES.find((p) => p.slug === slug)
  const project = projectBySlug(slug)
  if (!page || !project) notFound()

  const room = PROJECT_ROOMS.find((r) => r.id === project.room)
  const related = page.related.map((s) => ALL_PROJECTS.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => !!p)
  const bleed = page.heroStyle === "bleed"
  const external = page.link.href.startsWith("http")
  const phones = page.shots.filter((s) => s.frame === "phone")
  const wides = page.shots.filter((s) => s.frame !== "phone")

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
      { "@type": "ListItem", position: 3, name: page.title, item: pageUrl(slug) },
    ],
  }

  const mainButton = (
    <a
      href={page.link.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="btn btn-ivory"
    >
      {page.link.label}
      {external && <span aria-hidden="true">&#8599;</span>}
    </a>
  )

  const titleBlock = (
    <FadeIn immediate>
      <nav aria-label="Breadcrumb">
        <ol className="label flex flex-wrap items-center gap-x-2 text-ivory">
          <li>
            <Link href="/projects" className="text-brass hover:text-brass-2">
              No. 04 &middot; Projects Wing
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{room?.name}</li>
        </ol>
      </nav>
      <h1
        className="mt-5 font-display font-normal leading-[0.98] tracking-[-0.02em] text-ivory"
        style={{ fontSize: "clamp(2.6rem, 6.4vw, 5.6rem)" }}
      >
        {page.title}
      </h1>
      <p className="mt-6 max-w-[38rem] font-display text-lg leading-relaxed text-ivory/90 sm:text-xl">{page.summary}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {mainButton}
        <Link href="/projects" className="btn btn-line text-ivory">
          All projects
        </Link>
      </div>
    </FadeIn>
  )

  return (
    <div data-tone="dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFor(page, `${SITE_URL}${page.hero.src}`)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero: key art full-bleed for the games, framed for logos and dashboards */}
      {bleed ? (
        <section className="relative flex min-h-[min(86svh,820px)] items-end overflow-hidden bg-wall">
          <Image
            src={page.hero.src}
            alt={page.hero.alt}
            fill
            preload
            className="object-cover object-[60%_40%]"
            sizes="100vw"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-wall via-wall/70 to-wall/10" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-wall/80 via-wall/30 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-[1312px] px-5 pb-14 pt-32 sm:px-8 lg:px-12 lg:pb-20">{titleBlock}</div>
        </section>
      ) : (
        <section className="bg-wall">
          <div className="mx-auto grid max-w-[1312px] items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-36">
            <div>{titleBlock}</div>
            <div className="frame">
              <Image
                src={page.hero.src}
                alt={page.hero.alt}
                width={page.hero.width}
                height={page.hero.height}
                preload
                className="h-auto w-full"
                sizes="(min-width: 1024px) 620px, 92vw"
              />
            </div>
          </div>
        </section>
      )}

      {/* Four facts */}
      <section aria-label="At a glance" className="border-y border-wall-line bg-wall-2 text-ivory">
        <dl className="mx-auto grid max-w-[1312px] grid-cols-2 lg:grid-cols-4">
          {page.facts.map((f, i) => (
            <div
              key={f.label}
              className={`px-5 py-7 sm:px-8 lg:px-12 lg:py-9 ${i % 2 === 1 ? "border-l border-wall-line" : ""} ${i >= 2 ? "border-t border-wall-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
            >
              <dt className="label text-mist-2">{f.label}</dt>
              <dd className="mt-2 font-display text-xl leading-snug sm:text-[22px]">
                <Copy text={f.value} />
              </dd>
              {f.note && (
                <dd className="mt-1 text-[13px] leading-relaxed text-mist">
                  <Copy text={f.note} />
                </dd>
              )}
            </div>
          ))}
        </dl>
      </section>

      <div className="bg-paper text-ink">
        {/* What it is */}
        <section className="mx-auto max-w-[1312px] px-5 pb-8 pt-20 sm:px-8 sm:pt-28 lg:px-12">
          <div className={`grid gap-14 ${phones.length ? "lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20" : ""}`}>
            <div className={phones.length ? "" : "max-w-3xl"}>
              <SectionHead title="What it is" />
              <h2 className="sr-only">What it is</h2>
              <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-ink-2">
                {page.what.map((p, i) => (
                  <p key={i} className={i === 0 ? "font-display text-[21px] leading-[1.6] text-ink sm:text-[23px]" : ""}>
                    <Copy text={p} />
                  </p>
                ))}
              </div>
            </div>
            {phones.length > 0 && (
              <div className="grid grid-cols-2 items-start gap-5 sm:gap-8">
                {phones.slice(0, 2).map((s, i) => (
                  <div key={s.src} className={i === 1 ? "mt-10" : ""}>
                    <ShotFigure shot={s} sizes="(min-width: 1024px) 270px, 44vw" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How it was built */}
        <section className="mx-auto max-w-[1312px] px-5 pb-8 pt-16 sm:px-8 sm:pt-24 lg:px-12">
          <div className={`grid gap-14 ${phones.length > 2 ? "lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20" : ""}`}>
            {phones.length > 2 && (
              <div className="order-last grid grid-cols-2 items-start gap-5 sm:gap-8 lg:order-first">
                {phones.slice(2, 4).map((s, i) => (
                  <div key={s.src} className={i === 1 ? "mt-10" : ""}>
                    <ShotFigure shot={s} sizes="(min-width: 1024px) 270px, 44vw" />
                  </div>
                ))}
              </div>
            )}
            <div className={phones.length > 2 ? "" : "max-w-3xl"}>
              <SectionHead title="How it was built" />
              <h2 className="sr-only">How it was built</h2>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {page.built.map((b) => (
                  <li key={b.heading} className="py-6">
                    <h3 className="text-[17px] font-semibold text-ink">
                      <Copy text={b.heading} />
                    </h3>
                    <p className="mt-2 text-[16px] leading-[1.7] text-ink-2">
                      <Copy text={b.body} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Wide screenshots, whole */}
        {wides.length > 0 && (
          <section aria-label="Screens" className="mx-auto max-w-[1312px] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
            <div className={`grid gap-10 ${wides.length > 1 ? "md:grid-cols-2" : ""}`}>
              {wides.map((s) => (
                <ShotFigure key={s.src} shot={s} sizes={wides.length > 1 ? "(min-width: 768px) 46vw, 92vw" : "(min-width: 1312px) 1216px, 92vw"} />
              ))}
            </div>
          </section>
        )}

        {/* The way out, and more from the wing */}
        <section className="mx-auto max-w-[1312px] px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:px-12">
          <div className="flex flex-col items-start gap-6 border-y border-line py-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl font-display text-[24px] leading-snug sm:text-[28px]">
              {external ? (
                <>
                  {page.title} lives at{" "}
                  <span className="italic text-brass-ink">{page.link.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                </>
              ) : (
                <>
                  {page.title} has its own rooms <span className="italic text-brass-ink">on this site</span>
                </>
              )}
            </p>
            <a
              href={page.link.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="btn btn-ink shrink-0"
            >
              {page.link.label}
              {external && <span aria-hidden="true">&#8599;</span>}
            </a>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <SectionHead title="More from the wing" />
              <h2 className="sr-only">More from the wing</h2>
              <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
              <Link href="/projects" className="link-arrow mt-14 text-ink">
                Every project in the wing
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
