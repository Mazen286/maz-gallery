import { ImageResponse } from "next/og"
import { ORDERED_GALLERY, getPhotoBySlug, photoSlug } from "@/lib/gallery"
import { OG_BASE, ogFont } from "@/lib/og"

// One share card per photograph, prerendered at build. The Daily Postcard
// page points its Open Graph image at today's card by slug, so the daily
// preview needs no rendering on the Worker.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return ORDERED_GALLERY.map((img) => ({ slug: photoSlug(img) }))
}

// A 48px-wide JPEG of the photo (public/og/teaser, made by
// scripts/build-teasers.mjs), stretched to the card: a blur that teases the
// picture without giving the place away. Read from disk at build; fetched
// from the site if this ever renders at runtime.
async function teaser(slug: string): Promise<string> {
  let bytes: Uint8Array | null = null
  try {
    const { readFile } = await import("node:fs/promises")
    const { join } = await import("node:path")
    bytes = new Uint8Array(await readFile(join(process.cwd(), "public", "og", "teaser", `${slug}.jpg`)))
  } catch {
    try {
      const r = await fetch(`${OG_BASE}/og/teaser/${slug}.jpg`)
      if (r.ok) bytes = new Uint8Array(await r.arrayBuffer())
    } catch {
      bytes = null
    }
  }
  if (!bytes) return ""
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return `data:image/jpeg;base64,${btoa(bin)}`
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const img = getPhotoBySlug(slug)
  if (!img) return new Response("Not found", { status: 404 })

  const [display, mono, tease] = await Promise.all([
    ogFont("Fraunces-SemiBoldItalic.woff"),
    ogFont("JetBrainsMono-Medium.woff"),
    teaser(slug),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0c11",
          position: "relative",
          fontFamily: "Fraunces",
        }}
      >
        {tease && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tease}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover", opacity: 0.55 }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(10,12,17,0.2) 0%, rgba(10,12,17,0.55) 55%, rgba(10,12,17,0.95) 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 72, right: 72, bottom: 64, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: 8, color: "#78c8d6" }}>THE DAILY POSTCARD</div>
          <div style={{ fontSize: 84, lineHeight: 1.02, color: "#ffffff" }}>Where was this taken?</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: 4, color: "rgba(255,255,255,0.55)" }}>
            ONE PHOTO · THREE TRIES · MAZ.GALLERY/DAILY
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Fraunces", data: display, style: "italic", weight: 600 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  )
}
