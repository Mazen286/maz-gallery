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
      className={`group flex items-center gap-4 border border-wall-line bg-wall-2 p-3 transition-colors hover:border-brass/50 ${
        dir === "next" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden">
        <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="label text-mist-2">{dir === "prev" ? "Previous" : "Next"}</p>
        <p className="mt-1 font-display text-[17px] italic leading-snug text-ivory">{img.alt}</p>
      </div>
      {dir === "prev" ? (
        <ArrowLeft className="ml-auto size-4 shrink-0 text-mist-2 group-hover:text-brass" aria-hidden="true" />
      ) : (
        <ArrowRight className="mr-auto size-4 shrink-0 text-mist-2 group-hover:text-brass" aria-hidden="true" />
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
    "inline-flex min-h-11 items-center gap-2 rounded-full border border-wall-line px-4 text-[13px] font-medium text-ivory transition-colors hover:border-ivory/50"

  return (
    <article data-tone="dark" className="bg-wall pb-24 pt-24 text-ivory sm:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-5 sm:px-6">
        <ol className="label flex flex-wrap items-center gap-x-2 gap-y-1 text-mist">
          <li><Link href="/gallery" className="inline-block py-2 text-brass transition-colors hover:text-ivory">No. 03 &middot; The Gallery</Link></li>
          {img.location && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/gallery?view=exhibition&wing=${wingSlug(img.location)}`} className="inline-block py-2 transition-colors hover:text-ivory">
                  {wing}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="text-ivory">
            Photograph {index + 1} of {ORDERED_GALLERY.length}
          </li>
        </ol>
      </nav>

      {/* The photograph */}
      <div className="mx-auto mt-6 max-w-6xl px-5 sm:px-6">
        <div className={`frame mx-auto ${portrait ? "max-w-2xl" : ""}`}>
        <div
          className="relative overflow-hidden bg-wall-2"
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
      </div>

      {/* Placard */}
      <div className="mx-auto mt-12 grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          {img.location && (
            <p className="label text-brass">{img.location}</p>
          )}
          <h1 className="mt-4 font-display text-[34px] font-normal italic leading-tight tracking-[-0.01em] sm:text-5xl">
            {img.alt}
          </h1>
          {img.story && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">{img.story}</p>
          )}
          <p className="mt-6 text-[13px] text-mist-2">Photograph by {AUTHOR_NAME}</p>

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
          <aside className="self-start border border-wall-line bg-wall-2 p-4">
            <p className="label text-mist">Where</p>
            <PhotoMap location={img.location} className="mt-3 w-full" />
            <Link
              href={`/gallery?view=exhibition&wing=${wingSlug(img.location)}`}
              className="mt-3 block font-display text-lg italic text-ivory transition-colors hover:text-brass-2"
            >
              The {wing} wing &rarr;
            </Link>
            <p className="mt-1 text-[13px] text-mist-2">
              {ORDERED_GALLERY.filter((i) => i.location === img.location).length} photographs from {img.location}
            </p>
          </aside>
        )}
      </div>

      {/* Neighbors */}
      <div className="mx-auto mt-16 grid max-w-6xl gap-3 px-5 sm:grid-cols-2 sm:px-6">
        <NeighborCard img={prev} dir="prev" />
        <NeighborCard img={next} dir="next" />
      </div>
    </article>
  )
}
