import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Eye, Printer, Puzzle } from "lucide-react"
import {
  ORDERED_GALLERY,
  getPhotoBySlug,
  photoSlug,
  photoIndex,
  photoNeighbors,
  wingLabel,
  wingSlug,
} from "@/lib/gallery"
import { AUTHOR_NAME, SITE_URL } from "@/lib/constants"
import { PhotoMap } from "@/components/gallery/photo-map"
import { ShareButton } from "@/components/gallery/share-button"

type Params = Promise<{ slug: string }>

// Every photograph is prerendered at build time
export function generateStaticParams() {
  return ORDERED_GALLERY.map((img) => ({ slug: photoSlug(img) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const img = getPhotoBySlug(slug)
  if (!img) return { title: "Photograph not found" }
  const place = img.location ? ` in ${img.location}` : ""
  const description = img.story
    ? img.story.length > 155
      ? `${img.story.slice(0, 152).trimEnd()}...`
      : img.story
    : `${img.alt}${place}. A photograph by ${AUTHOR_NAME}.`
  return {
    title: `${img.alt}${img.location ? ` | ${wingLabel(img.location)}` : ""}`,
    description,
    alternates: { canonical: `/gallery/${slug}` },
    openGraph: {
      title: `${img.alt}${place}`,
      description,
      url: `${SITE_URL}/gallery/${slug}`,
      type: "article",
      images: [{ url: img.src, width: img.width, height: img.height, alt: img.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${img.alt}${place}`,
      description,
      images: [{ url: img.src, alt: img.alt }],
    },
  }
}

function NeighborCard({ img, dir }: { img: import("@/lib/gallery").GalleryImage; dir: "prev" | "next" }) {
  return (
    <Link
      href={`/gallery/${photoSlug(img)}`}
      className={`group flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-all hover:border-teal/50 hover:bg-white/[0.05] ${
        dir === "next" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded">
        <Image src={img.src} alt="" fill sizes="96px" className="object-cover opacity-80 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {dir === "prev" ? "Previous" : "Next"}
        </p>
        <p className="truncate font-display italic text-white/85">{img.alt}</p>
      </div>
      {dir === "prev" ? (
        <ArrowLeft className="ml-auto size-4 shrink-0 text-white/30 group-hover:text-teal" />
      ) : (
        <ArrowRight className="mr-auto size-4 shrink-0 text-white/30 group-hover:text-teal" />
      )}
    </Link>
  )
}

export default async function PhotoPage({ params }: { params: Params }) {
  const { slug } = await params
  const img = getPhotoBySlug(slug)
  if (!img) notFound()

  const index = photoIndex(img)
  const { prev, next } = photoNeighbors(img)
  const url = `${SITE_URL}/gallery/${slug}`
  const wing = img.location ? wingLabel(img.location) : null
  const portrait = img.height > img.width

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${url}#image`,
    name: img.alt,
    description: img.story || img.alt,
    contentUrl: `${SITE_URL}${img.src}`,
    url,
    width: img.width,
    height: img.height,
    creator: { "@type": "Person", name: AUTHOR_NAME, url: `${SITE_URL}/about` },
    creditText: AUTHOR_NAME,
    copyrightNotice: `© ${AUTHOR_NAME}`,
    ...(img.location && { contentLocation: { "@type": "Place", name: img.location } }),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Gallery", item: `${SITE_URL}/gallery` },
      ...(img.location
        ? [{ "@type": "ListItem", position: 3, name: wing, item: `${SITE_URL}/gallery?view=exhibition&wing=${wingSlug(img.location)}` }]
        : []),
      { "@type": "ListItem", position: img.location ? 4 : 3, name: img.alt, item: url },
    ],
  }

  const actionClass =
    "flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-all hover:border-white/40 hover:text-white"

  return (
    <article className="bg-[#0a0c11] pb-24 pt-24 text-white sm:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          <li><Link href="/gallery" className="transition-colors hover:text-teal">The Gallery</Link></li>
          {img.location && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/gallery?view=exhibition&wing=${wingSlug(img.location)}`} className="transition-colors hover:text-teal">
                  {wing}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="text-white/70">No. {String(index + 1).padStart(2, "0")}</li>
        </ol>
      </nav>

      {/* The photograph */}
      <div className="mx-auto mt-6 max-w-6xl px-6">
        <div
          className={`relative mx-auto overflow-hidden rounded-lg bg-black/40 ${portrait ? "max-w-2xl" : ""}`}
          style={{ aspectRatio: `${img.width} / ${img.height}` }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            preload
            sizes={portrait ? "(max-width: 768px) 100vw, 672px" : "(max-width: 1200px) 100vw, 1152px"}
            className="object-contain"
          />
        </div>
      </div>

      {/* Placard */}
      <div className="mx-auto mt-10 grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_320px]">
        <div>
          {img.location && (
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-teal">{img.location}</p>
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">
            <span className="italic">{img.alt}</span>
          </h1>
          {img.story && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">{img.story}</p>
          )}
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
            Photograph {index + 1} of {ORDERED_GALLERY.length} &middot; {AUTHOR_NAME}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link href={`/gallery?view=exhibition&i=${index}`} className={actionClass}>
              <Eye className="size-3.5" />
              Open in the exhibition
            </Link>
            <ShareButton title={img.alt} url={url} className={actionClass} />
            <Link href={`/booking?photo=${slug}`} className={actionClass}>
              <Printer className="size-3.5" />
              Ask about a print
            </Link>
            <Link href={`/annex/jigsaw?photo=${slug}`} className={actionClass}>
              <Puzzle className="size-3.5" />
              Solve as a jigsaw
            </Link>
          </div>
        </div>

        {img.location && (
          <aside className="self-start rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Where</p>
            <PhotoMap location={img.location} className="mt-3 w-full rounded" />
            <Link
              href={`/gallery?view=exhibition&wing=${wingSlug(img.location)}`}
              className="mt-3 block font-display text-lg italic text-white/85 transition-colors hover:text-teal"
            >
              The {wing} wing &rarr;
            </Link>
            <p className="mt-1 text-xs text-white/40">
              {ORDERED_GALLERY.filter((i) => i.location === img.location).length} photographs from {img.location}
            </p>
          </aside>
        )}
      </div>

      {/* Neighbors */}
      <div className="mx-auto mt-14 grid max-w-6xl gap-3 px-6 sm:grid-cols-2">
        <NeighborCard img={prev} dir="prev" />
        <NeighborCard img={next} dir="next" />
      </div>
    </article>
  )
}
